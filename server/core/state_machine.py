import time
from typing import Optional
from server.core.models import (
    TurnRequest,
    TurnResponse,
    LocalizedString,
    FormFieldDefinition,
    SessionState
)
from server.core.session import SessionData
from server.core.confidence import calculate_confidence, is_confident_enough
from server.core.fallback import FallbackManager
from server.services.catalog import catalog
from server.services.form_engine import form_engine
from server.providers.base import UnderstandingInput
from server.providers.factory import get_ai_provider

class StateMachine:
    async def handle_turn(self, session: SessionData, req: TurnRequest) -> TurnResponse:
        session.language = req.language or session.language
        ai_provider = get_ai_provider()
        now = time.time()

        # Update transcript history if text is provided
        if req.text:
            session.transcriptHistory.append(req.text.strip())

        # Check explicit UI actions first (e.g. button taps)
        if req.action:
            response = await self._handle_explicit_action(session, req)
            session.updatedAt = time.time()
            return response

        # Otherwise, process natural language / speech understanding
        current_field_def: Optional[FormFieldDefinition] = None
        if session.formSession and session.state in ("ASK_FIELD", "AWAIT_ANSWER", "FALLBACK_INPUT", "CONFIRM_FIELD"):
            schema = form_engine.get_form_schema(session.formSession["formId"])
            idx = session.formSession["currentIndex"]
            if schema and idx < len(schema.fields):
                current_field_def = schema.fields[idx]

        understanding_input = UnderstandingInput(
            text=req.text,
            audioBase64=req.audioBase64,
            mimeType=req.mimeType,
            language=session.language,
            contextState=session.state,
            expectingField=current_field_def.id if current_field_def else None,
            expectedFieldType=current_field_def.type if current_field_def else None,
            lastPrompt=getattr(session.lastAssistantMessage, session.language, session.lastAssistantMessage.en),
            currentFormData=session.formSession["data"] if session.formSession else {}
        )

        ai_result = await ai_provider.understand(understanding_input)

        # Dispatch to state handlers
        if session.state in ("WELCOME", "SERVICE_DISCOVERY"):
            response = await self._handle_discovery_state(session, req, ai_result)
        elif session.state == "SERVICE_CONFIRM":
            response = await self._handle_service_confirm_state(session, req, ai_result)
        elif session.state in ("ASK_FIELD", "AWAIT_ANSWER", "FALLBACK_INPUT"):
            response = await self._handle_field_collection_state(session, req, ai_result, current_field_def)
        elif session.state == "CONFIRM_FIELD":
            response = await self._handle_confirm_field_state(session, req, ai_result, current_field_def)
        elif session.state == "FINAL_REVIEW":
            response = await self._handle_final_review_state(session, req, ai_result)
        elif session.state == "GUIDANCE":
            response = await self._build_turn_response(session, session.lastAssistantMessage)
        else:
            response = await self._build_turn_response(session, session.lastAssistantMessage)

        # Record turn metrics
        latency_ms = int((time.time() - now) * 1000)
        session.metrics.append({
            "timestamp": time.time(),
            "state": session.state,
            "field": current_field_def.id if current_field_def else None,
            "intent": ai_result.intent,
            "confidence": ai_result.confidence,
            "fallbackLevel": session.fallbackLevel,
            "latencyMs": latency_ms
        })

        session.updatedAt = time.time()
        return response

    async def _handle_explicit_action(self, session: SessionData, req: TurnRequest) -> TurnResponse:
        action = req.action

        if action == "SELECT_SERVICE":
            service_id = str(req.value or "")
            return await self._transition_to_service(session, service_id)

        elif action == "APPLY_NOW":
            service_id = session.selectedServiceId or str(req.value or "pm_kisan")
            return await self._start_service_form(session, service_id)

        elif action == "SUBMIT_MANUAL_FIELD":
            # Level 2 typed manual entry
            field_id = req.fieldId or session.currentFieldId
            val = req.value
            return await self._process_field_answer(session, field_id, val, 1.0, is_manual=True)

        elif action == "CONFIRM_YES":
            if session.state == "CONFIRM_FIELD":
                return await self._confirm_current_field(session)
            elif session.state == "SERVICE_CONFIRM":
                return await self._start_service_form(session, session.selectedServiceId or "pm_kisan")
            elif session.state == "FINAL_REVIEW":
                return await self._submit_application(session)

        elif action == "CONFIRM_NO":
            if session.state == "CONFIRM_FIELD":
                # User rejected, re-ask field
                session.state = "ASK_FIELD"
                return await self._build_field_prompt(session)
            elif session.state == "SERVICE_CONFIRM":
                session.state = "SERVICE_DISCOVERY"
                msg = LocalizedString(
                    en="No problem. Which service would you like to explore?",
                    hi="कोई बात नहीं। आप किस सेवा के बारे में जानना चाहते हैं?",
                    mr="काही हरकत नाही. आपण कोणत्या सेवेबद्दल माहिती घेऊ इच्छिता?"
                )
                return await self._build_turn_response(session, msg)

        elif action == "HELP":
            return await self._trigger_handoff(session, "Citizen requested assistance via help button")

        elif action == "REPEAT":
            return await self._build_turn_response(session, session.lastAssistantMessage)

        elif action == "BACK":
            return await self._go_back_field(session)

        elif action == "RESTART":
            session.state = "WELCOME"
            session.formSession = None
            session.selectedServiceId = None
            session.fallbackLevel = 0
            session.failureCount.clear()
            msg = LocalizedString(
                en="Let us start again. Which government service do you need?",
                hi="आइए दोबारा शुरू करते हैं। आपको किस सरकारी सेवा की आवश्यकता है?",
                mr="चला पुन्हा सुरू करूया. तुम्हाला कोणत्या सरकारी सेवेची गरज आहे?"
            )
            return await self._build_turn_response(session, msg)

        return await self._build_turn_response(session, session.lastAssistantMessage)

    async def _handle_discovery_state(self, session: SessionData, req: TurnRequest, ai_result) -> TurnResponse:
        intent = ai_result.intent

        if intent == "HELP":
            return await self._trigger_handoff(session, "Help requested during service discovery")

        if intent == "DIRECT_SERVICE":
            matched_service, conf, candidates = catalog.match_service(req.text or "", session.language)
            service_id = ai_result.serviceId or (matched_service.serviceId if matched_service else "pm_kisan")
            return await self._transition_to_service(session, service_id)

        elif intent == "PROBLEM_NEED":
            # Transition to recommendation / need discovery
            # For farmer need, recommend PM-Kisan; for other needs, recommend appropriate scheme
            matched_service, conf, candidates = catalog.match_service(req.text or "", session.language)
            session.state = "SERVICE_RECOMMENDATION"
            rec_service = matched_service or catalog.get_service("pm_kisan")
            session.selectedServiceId = rec_service.serviceId if rec_service else "pm_kisan"

            msg = LocalizedString(
                en=f"Based on your need, I recommend {rec_service.name.en}. Would you like to proceed?",
                hi=f"आपकी आवश्यकता के अनुसार, मैं {rec_service.name.hi} की सिफ़ारिश करता हूँ। क्या आप इसके लिए आवेदन करना चाहते हैं?",
                mr=f"तुमच्या गरजेनुसार, मी {rec_service.name.mr} ची शिफारस करतो. आपण अर्ज करू इच्छिता का?"
            )
            return await self._build_turn_response(session, msg)

        else:
            if not req.text or not req.text.strip():
                return await self._build_turn_response(session, session.lastAssistantMessage)
            # Unclear query
            msg = LocalizedString(
                en="Please name the government scheme you need, or tell me your problem (e.g. 'I need PM-Kisan' or 'I am a farmer needing assistance').",
                hi="कृपया जिस योजना की आवश्यकता है उसका नाम बताएं, या अपनी समस्या बताएं (जैसे: 'मुझे पीएम-किसान चाहिए' या 'मैं किसान हूँ मुझे मदद चाहिए')।",
                mr="कृपया तुम्हाला हव्या असलेल्या योजनेचे नाव सांगा किंवा तुमची समस्या सांगा (उदा. 'मला पीएम-किसान हवे आहे' किंवा 'मी शेतकरी आहे मला मदतीची गरज आहे')."
            )
            session.state = "SERVICE_DISCOVERY"
            return await self._build_turn_response(session, msg)

    async def _transition_to_service(self, session: SessionData, service_id: str) -> TurnResponse:
        service = catalog.get_service(service_id)
        if not service:
            service = catalog.get_service("pm_kisan")
        session.selectedServiceId = service.serviceId

        if service.directApplicationSupported and service.formSchemaId:
            # Immediately start PM-Kisan form as requested by Rule:
            # "Do not run the eligibility discovery flow if the user explicitly names a supported service and asks to apply."
            return await self._start_service_form(session, service.serviceId)
        else:
            # Unsupported direct service -> Transition to Guidance Mode
            session.state = "GUIDANCE"
            guidance = catalog.get_service_guidance(service.serviceId, session.language)
            msg = LocalizedString(
                en=f"Direct digital submission for {service.name.en} is not available in this demo. Here is step-by-step guidance on how and where to apply.",
                hi=f"{service.name.hi} के लिए इस डेमो में सीधा ऑनलाइन आवेदन उपलब्ध नहीं है। यहाँ आवेदन करने के चरण और आवश्यक दस्तावेज़ दिए गए हैं।",
                mr=f"{service.name.mr} साठी या डेमोमध्ये थेट ऑनलाइन अर्ज उपलब्ध नाही. येथे अर्ज कसा आणि कोठे करावा याबद्दल मार्गदर्शन दिले आहे."
            )
            return await self._build_turn_response(session, msg, guidance_info=guidance)

    async def _start_service_form(self, session: SessionData, service_id: str) -> TurnResponse:
        service = catalog.get_service(service_id)
        if not service or not service.formSchemaId:
            service = catalog.get_service("pm_kisan")

        session.selectedServiceId = service.serviceId
        session.formSession = form_engine.initialize_session_form(service.formSchemaId)
        session.state = "ASK_FIELD"
        session.fallbackLevel = 0
        session.failureCount.clear()

        return await self._build_field_prompt(session)

    async def _handle_service_confirm_state(self, session: SessionData, req: TurnRequest, ai_result) -> TurnResponse:
        if ai_result.intent == "CONFIRM_YES":
            return await self._start_service_form(session, session.selectedServiceId or "pm_kisan")
        elif ai_result.intent == "CONFIRM_NO":
            session.state = "SERVICE_DISCOVERY"
            msg = LocalizedString(
                en="Which other government service can I assist you with?",
                hi="मैं आपकी किस अन्य सरकारी सेवा में मदद कर सकता हूँ?",
                mr="मी आपल्याला इतर कोणत्या सरकारी सेवेत मदत करू शकतो?"
            )
            return await self._build_turn_response(session, msg)
        else:
            return await self._build_turn_response(session, session.lastAssistantMessage)

    async def _handle_field_collection_state(
        self, session: SessionData, req: TurnRequest, ai_result, current_field_def: Optional[FormFieldDefinition]
    ) -> TurnResponse:
        if not current_field_def:
            session.state = "FINAL_REVIEW"
            return await self._build_final_review_prompt(session)

        # Global commands
        if ai_result.intent == "HELP":
            return await self._trigger_handoff(session, f"Help requested at field: {current_field_def.id}")
        elif ai_result.intent == "REPEAT":
            return await self._build_turn_response(session, session.lastAssistantMessage)
        elif ai_result.intent == "BACK":
            return await self._go_back_field(session)

        raw_val = ai_result.normalizedValue or ai_result.extractedValue or req.text
        return await self._process_field_answer(
            session, current_field_def.id, raw_val, ai_result.confidence, is_manual=False
        )

    async def _process_field_answer(
        self, session: SessionData, field_id: str, raw_value: any, model_conf: float, is_manual: bool = False
    ) -> TurnResponse:
        schema = form_engine.get_form_schema(session.formSession["formId"])
        field_def = next((f for f in schema.fields if f.id == field_id), None)
        if not field_def:
            return await self._build_turn_response(session, session.lastAssistantMessage)

        # Validate deterministically
        state_context = session.formSession["data"].get("state")
        is_valid, normalized_val, err_msg = form_engine.validate_field(field_def, raw_value, state_context)

        # Compute deterministic confidence
        final_conf = calculate_confidence(
            model_confidence=1.0 if is_manual else model_conf,
            field_id=field_id,
            is_valid=is_valid,
            transcript=str(raw_value or "")
        )

        confident = is_confident_enough(field_id, final_conf)

        if is_valid and confident:
            # Successful capture -> Ask for confirmation
            session.formSession["data"][field_id] = normalized_val
            session.formSession["statuses"][field_id] = "captured"
            session.state = "CONFIRM_FIELD"
            session.fallbackLevel = 0
            session.failureCount[field_id] = 0

            # Form confirmation prompt
            display_val = str(normalized_val)
            if field_id == "aadhaar":
                # Space grouped for voice read-back e.g. 5544 3322 1100
                display_val = " ".join([display_val[i:i+4] for i in range(0, len(display_val), 4)])
            elif field_id == "mobile":
                display_val = f"{display_val[:5]} {display_val[5:]}"

            msg = LocalizedString(
                en=f"You stated: {display_val}. Is this correct?",
                hi=f"आपने बताया: {display_val}। क्या यह सही है?",
                mr=f"तुम्ही सांगितले: {display_val}. हे बरोबर आहे का?"
            )
            return await self._build_turn_response(session, msg, confidence=final_conf)

        else:
            # Failure handling / Fallback ladder
            streak = session.failureCount.get(field_id, 0) + 1
            session.failureCount[field_id] = streak

            if streak == 1:
                # Level 1: Simpler re-prompt with example
                session.fallbackLevel = 1
                session.state = "AWAIT_ANSWER"
                re_prompt = FallbackManager.get_level_1_prompt(field_id, session.language)
                return await self._build_turn_response(session, re_prompt, confidence=final_conf)

            elif streak == 2:
                # Level 2: Visual / manual typed input
                session.fallbackLevel = 2
                session.state = "FALLBACK_INPUT"
                msg = LocalizedString(
                    en=f"I am having trouble hearing this clearly. Please type your {field_def.label.en} in the box below.",
                    hi=f"मुझे स्पष्ट आवाज़ नहीं मिल रही है। कृपया नीचे दिए गए बॉक्स में अपना {field_def.label.hi} दर्ज करें।",
                    mr=f"मला स्पष्ट आवाज येत नाही. कृपया खालील बॉक्समध्ये तुमचे {field_def.label.mr} टाइप करा."
                )
                return await self._build_turn_response(session, msg, confidence=final_conf)

            else:
                # Level 3: Operator / human handoff
                return await self._trigger_handoff(session, f"Repeated validation failure for field '{field_id}'")

    async def _handle_confirm_field_state(
        self, session: SessionData, req: TurnRequest, ai_result, current_field_def: Optional[FormFieldDefinition]
    ) -> TurnResponse:
        if ai_result.intent == "CONFIRM_YES":
            return await self._confirm_current_field(session)

        elif ai_result.intent in ("CONFIRM_NO", "CORRECTION"):
            if ai_result.extractedValue:
                # User provided inline correction (e.g. "नहीं, मेरा नाम रमेश है")
                return await self._process_field_answer(
                    session, current_field_def.id, ai_result.extractedValue, 0.90, is_manual=False
                )
            else:
                # User said no, ask field again
                session.state = "ASK_FIELD"
                session.formSession["statuses"][current_field_def.id] = "pending"
                return await self._build_field_prompt(session)

        elif ai_result.intent == "HELP":
            return await self._trigger_handoff(session, "Help requested during confirmation")

        elif ai_result.intent == "BACK":
            return await self._go_back_field(session)

        elif ai_result.intent == "REPEAT":
            return await self._build_turn_response(session, session.lastAssistantMessage)

        # Re-prompt confirmation if answer unclear
        msg = LocalizedString(
            en="Please say 'Yes' if the details are correct, or 'No' to correct it.",
            hi="कृपया जानकारी सही होने पर 'हाँ' बोलिए, या बदलने के लिए 'नहीं' बोलिए।",
            mr="माहिती बरोबर असल्यास 'होय' म्हणा, किंवा बदलण्यासाठी 'नाही' म्हणा."
        )
        return await self._build_turn_response(session, msg)

    async def _confirm_current_field(self, session: SessionData) -> TurnResponse:
        idx = session.formSession["currentIndex"]
        schema = form_engine.get_form_schema(session.formSession["formId"])
        curr_field = schema.fields[idx]

        form_engine.confirm_field(session.formSession, curr_field.id)

        # Check if form is complete
        if form_engine.is_complete(session.formSession):
            session.state = "FINAL_REVIEW"
            return await self._build_final_review_prompt(session)

        # Move to next field
        session.state = "ASK_FIELD"
        session.fallbackLevel = 0
        return await self._build_field_prompt(session)

    async def _build_field_prompt(self, session: SessionData) -> TurnResponse:
        idx = session.formSession["currentIndex"]
        schema = form_engine.get_form_schema(session.formSession["formId"])
        field = schema.fields[idx]
        session.currentFieldId = field.id

        return await self._build_turn_response(session, field.prompt)

    async def _go_back_field(self, session: SessionData) -> TurnResponse:
        idx = session.formSession["currentIndex"]
        if idx > 0:
            session.formSession["currentIndex"] = idx - 1
        session.state = "ASK_FIELD"
        session.fallbackLevel = 0
        return await self._build_field_prompt(session)

    async def _build_final_review_prompt(self, session: SessionData) -> TurnResponse:
        msg = LocalizedString(
            en="All details have been collected! Please review your answers. Say 'Yes' or click Submit to send your demo application.",
            hi="सभी विवरण एकत्र कर लिए गए हैं! कृपया अपने उत्तरों की समीक्षा करें। डेमो आवेदन जमा करने के लिए 'हाँ' बोलें या सबमिट दबाएँ।",
            mr="सर्व माहिती गोळा केली गेली आहे! कृपया आपल्या उत्तरांचे पुनरावलोकन करा. डेमो अर्ज सादर करण्यासाठी 'होय' म्हणा किंवा सबमिट करा."
        )
        return await self._build_turn_response(session, msg)

    async def _handle_final_review_state(self, session: SessionData, req: TurnRequest, ai_result) -> TurnResponse:
        if ai_result.intent == "CONFIRM_YES":
            return await self._submit_application(session)
        elif ai_result.intent == "HELP":
            return await self._trigger_handoff(session, "Help requested during final review")
        else:
            return await self._build_final_review_prompt(session)

    async def _submit_application(self, session: SessionData) -> TurnResponse:
        session.state = "DONE"
        timestamp_str = time.strftime("%Y%m%d-%H%M%S")
        app_id = f"DEMO-PMK-{timestamp_str}"

        submission_result = {
            "success": True,
            "applicationId": app_id,
            "status": "SUBMITTED (DEMO)",
            "message": "Demo application submitted successfully. This is a prototype submission; no real government records were altered.",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }
        session.submissionResult = submission_result

        msg = LocalizedString(
            en=f"Congratulations! Your demo application has been submitted successfully with Application ID: {app_id}.",
            hi=f"बधाई हो! आपका डेमो आवेदन सफलतापूर्वक जमा हो गया है। आपका आवेदन क्रमांक है: {app_id}।",
            mr=f"अभिनंदन! आपला डेमो अर्ज यशस्वीरीत्या सादर झाला आहे. आपला अर्ज क्रमांक आहे: {app_id}."
        )
        return await self._build_turn_response(session, msg, submission_result=submission_result)

    async def _trigger_handoff(self, session: SessionData, reason: str) -> TurnResponse:
        session.state = "HANDOFF"
        session.fallbackLevel = 3
        handoff_record = FallbackManager.create_handoff_record(
            session_id=session.sessionId,
            language=session.language,
            reason=reason,
            failing_field=session.currentFieldId,
            form_data=session.formSession["data"] if session.formSession else {},
            recent_transcripts=session.transcriptHistory
        )
        session.handoffRecord = handoff_record

        msg = LocalizedString(
            en=f"A support case has been opened for you (Case ID: {handoff_record['handoffId']}). An operator can review your details.",
            hi=f"आपके लिए एक सहायता केस दर्ज कर लिया गया है (केस आईडी: {handoff_record['handoffId']})। सेवा केंद्र प्रतिनिधि आपकी सहायता करेंगे।",
            mr=f"तुमच्यासाठी मदत प्रकरण नोंदवले गेले आहे (प्रकरण आयडी: {handoff_record['handoffId']}). सेवा केंद्र प्रतिनिधी तुम्हाला मदत करतील."
        )
        return await self._build_turn_response(session, msg)

    async def _build_turn_response(
        self,
        session: SessionData,
        message: LocalizedString,
        confidence: float = 1.0,
        guidance_info: Optional[dict] = None,
        submission_result: Optional[dict] = None
    ) -> TurnResponse:
        session.lastAssistantMessage = message
        current_field_def = None
        field_idx = 0
        total_fields = 0
        form_data = {}
        field_statuses = {}

        if session.formSession:
            schema = form_engine.get_form_schema(session.formSession["formId"])
            if schema:
                total_fields = len(schema.fields)
                field_idx = session.formSession["currentIndex"]
                if field_idx < total_fields:
                    current_field_def = schema.fields[field_idx]
            form_data = session.formSession.get("data", {})
            field_statuses = session.formSession.get("statuses", {})

        service = catalog.get_service(session.selectedServiceId) if session.selectedServiceId else None

        return TurnResponse(
            sessionId=session.sessionId,
            state=session.state,
            assistantMessage=message,
            currentField=current_field_def,
            fieldIndex=field_idx,
            totalFields=total_fields,
            formData=form_data,
            fieldStatuses=field_statuses,
            confidence=confidence,
            fallbackLevel=session.fallbackLevel,
            service=service,
            recommendedServices=[catalog.get_service("pm_kisan")] if session.state == "SERVICE_RECOMMENDATION" else [],
            guidanceInfo=guidance_info,
            submissionResult=submission_result or session.submissionResult,
            transcript=session.transcriptHistory[-1] if session.transcriptHistory else None
        )

state_machine = StateMachine()
