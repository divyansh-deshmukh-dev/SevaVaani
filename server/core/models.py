from typing import Any, Literal, Optional
from pydantic import BaseModel, Field

# Core Enums & Literals
LanguageCode = Literal["hi", "mr", "en"]

SessionState = Literal[
    "WELCOME",
    "SERVICE_DISCOVERY",
    "NEED_DISCOVERY",
    "ELIGIBILITY_QUESTIONS",
    "SERVICE_RECOMMENDATION",
    "SERVICE_CONFIRM",
    "ASK_FIELD",
    "AWAIT_ANSWER",
    "CONFIRM_FIELD",
    "FALLBACK_INPUT",
    "FINAL_REVIEW",
    "SUBMITTING",
    "DONE",
    "HANDOFF",
    "GUIDANCE",
    "ERROR"
]

FieldType = Literal[
    "text",
    "digits",
    "number",
    "number_unit",
    "date",
    "place",
    "select",
    "yes_no"
]

FieldStatus = Literal["pending", "captured", "confirmed", "unverified"]

# Service Schema
class LocalizedString(BaseModel):
    en: str
    hi: str
    mr: str

class ServiceDefinition(BaseModel):
    serviceId: str
    id: Optional[str] = None
    name: LocalizedString
    category: str
    serviceType: str = "welfare_scheme"
    aliases: list[str] = []
    applicationMode: str = "guidance-only"
    directApplicationSupported: bool = False
    guidanceAvailable: bool = True
    description: LocalizedString
    formSchemaId: Optional[str] = None
    eligibilityRuleId: Optional[str] = None
    apiAdapter: Optional[str] = None
    requiredDocuments: list[LocalizedString] = []
    guidance: Optional[dict[str, Any]] = None
    officialSource: Optional[str] = None
    officialSourceMetadata: Optional[dict[str, Any]] = None
    isDemo: bool = True
    demoStatus: Optional[str] = None

    def model_post_init(self, __context: Any) -> None:
        if not self.id:
            self.id = self.serviceId
        if self.applicationMode == "direct-demo":
            self.directApplicationSupported = True

# Form Schema
class FormFieldDefinition(BaseModel):
    id: str
    label: LocalizedString
    prompt: LocalizedString
    type: FieldType
    required: bool = True
    helpText: Optional[LocalizedString] = None
    grouping: Optional[int] = None
    unitOptions: Optional[list[str]] = None
    options: Optional[list[LocalizedString]] = None
    placeholder: Optional[LocalizedString] = None

class FormSchema(BaseModel):
    formId: str
    serviceId: str
    title: LocalizedString
    fields: list[FormFieldDefinition]

# Turn & Speech Request / Response
class TurnRequest(BaseModel):
    text: Optional[str] = None
    audioBase64: Optional[str] = None
    mimeType: Optional[str] = "audio/webm"
    language: LanguageCode = "hi"
    action: Optional[str] = None
    fieldId: Optional[str] = None
    value: Optional[Any] = None

class TurnResponse(BaseModel):
    sessionId: str
    state: SessionState
    assistantMessage: LocalizedString
    currentField: Optional[FormFieldDefinition] = None
    fieldIndex: int = 0
    totalFields: int = 0
    formData: dict[str, Any] = Field(default_factory=dict)
    fieldStatuses: dict[str, FieldStatus] = Field(default_factory=dict)
    confidence: float = 1.0
    fallbackLevel: int = 0
    service: Optional[ServiceDefinition] = None
    recommendedServices: list[ServiceDefinition] = Field(default_factory=list)
    guidanceInfo: Optional[dict[str, Any]] = None
    submissionResult: Optional[dict[str, Any]] = None
    transcript: Optional[str] = None
    detectedIntent: Optional[str] = None
