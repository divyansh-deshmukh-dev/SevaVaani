from typing import Any, Optional
from server.core.models import LocalizedString

class FallbackManager:
    @staticmethod
    def get_level_1_prompt(field_id: str, language: str = "hi") -> LocalizedString:
        """Returns simplified Level 1 re-prompt with examples"""
        prompts = {
            "full_name": {
                "en": "I did not catch that clearly. Please say your name slowly, for example: 'Ramesh Kumar'.",
                "hi": "मुझे स्पष्ट सुनाई नहीं दिया। कृपया अपना नाम धीरे से बोलिए, जैसे: 'रमेश कुमार'।",
                "mr": "मला स्पष्ट ऐकू आले नाही. कृपया तुमचे नाव सावकाश सांगा, उदा. 'रमेश पाटील'."
            },
            "aadhaar": {
                "en": "Aadhaar number was not clear. Please speak four digits at a time, for example: '5 5 4 4'.",
                "hi": "आधार नंबर स्पष्ट नहीं था। कृपया चार-चार अंक करके बोलिए, जैसे: '5 5 4 4'।",
                "mr": "आधार क्रमांक स्पष्ट नव्हता. कृपया चार-चार अंक करून सांगा, उदा. '5 5 4 4'."
            },
            "mobile": {
                "en": "Please say your 10-digit mobile number clearly, digit by digit.",
                "hi": "कृपया अपना 10 अंकों का मोबाइल नंबर एक-एक अंक करके स्पष्ट बोलिए।",
                "mr": "कृपया तुमचा १० अंकी मोबाईल नंबर एक-एक अंक करून स्पष्ट सांगा."
            },
            "state": {
                "en": "Please name your state clearly, for example: 'Maharashtra' or 'Madhya Pradesh'.",
                "hi": "कृपया अपने राज्य का नाम स्पष्ट बताइए, जैसे: 'मध्य प्रदेश' या 'महाराष्ट्र'।",
                "mr": "कृपया तुमच्या राज्याचे नाव स्पष्ट सांगा, उदा. 'महाराष्ट्र' किंवा 'मध्य प्रदेश'."
            },
            "district": {
                "en": "Please tell me the name of your district, for example: 'Pune' or 'Bhopal'.",
                "hi": "कृपया अपने ज़िले का नाम बताइए, जैसे: 'भोपाल' या 'पुणे'।",
                "mr": "कृपया तुमच्या जिल्ह्याचे नाव सांगा, उदा. 'पुणे' किंवा 'नाशिक'."
            },
            "village": {
                "en": "Please tell me the name of your village clearly.",
                "hi": "कृपया अपने गाँव का नाम स्पष्ट बताइए।",
                "mr": "कृपया तुमच्या गावाचे नाव स्पष्ट सांगा."
            },
            "land_area": {
                "en": "Please state your land area and unit, for example: '2.5 acre' or '1 hectare'.",
                "hi": "कृपया ज़मीन का माप और इकाई बताइए, जैसे: '2.5 एकड़' या '1 हेक्टेयर'।",
                "mr": "कृपया जमिनीचे क्षेत्रफळ आणि एकक सांगा, उदा. '२.५ एकर' किंवा '१ हेक्टर'."
            }
        }
        default_prompt = {
            "en": "I could not understand that. Please speak clearly or try again.",
            "hi": "मुझे समझ नहीं आया। कृपया दोबारा स्पष्ट बोलिए।",
            "mr": "मला समजले नाही. कृपया पुन्हा स्पष्ट बोला."
        }
        p = prompts.get(field_id, default_prompt)
        return LocalizedString(**p)

    @staticmethod
    def create_handoff_record(
        session_id: str,
        language: str,
        reason: str,
        failing_field: Optional[str],
        form_data: dict[str, Any],
        recent_transcripts: list[str]
    ) -> dict[str, Any]:
        """Creates a realistic Level 3 handoff record for operator review"""
        # Mask sensitive fields
        masked_data = {}
        for k, v in form_data.items():
            str_v = str(v)
            if k == "aadhaar" and len(str_v) == 12:
                masked_data[k] = "XXXX-XXXX-" + str_v[-4:]
            elif k == "mobile" and len(str_v) == 10:
                masked_data[k] = str_v[:2] + "XXXXXX" + str_v[-2:]
            else:
                masked_data[k] = v

        return {
            "handoffId": f"HO-{session_id[:8].upper()}",
            "sessionId": session_id,
            "language": language,
            "reason": reason,
            "failingField": failing_field,
            "formDataSnapshot": masked_data,
            "recentTranscripts": recent_transcripts[-5:],
            "status": "QUEUED_FOR_ASSISTANCE",
            "message": {
                "en": "We have created an assistance case for you. A public service operator can assist with this record.",
                "hi": "आपके लिए एक सहायता केस दर्ज कर लिया गया है। सेवा केंद्र प्रतिनिधि इस रिकॉर्ड के साथ आपकी मदद कर सकते हैं।",
                "mr": "तुमच्यासाठी मदत प्रकरण नोंदवले गेले आहे. सेवा केंद्र प्रतिनिधी या नोंदीसह तुम्हाला मदत करू शकतात."
            }
        }
