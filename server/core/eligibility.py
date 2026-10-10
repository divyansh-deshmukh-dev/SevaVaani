from typing import Any, Optional, Literal
from pydantic import BaseModel
from core.models import LocalizedString

EligibilityStatus = Literal["LIKELY_ELIGIBLE", "NOT_ELIGIBLE", "MORE_INFORMATION_REQUIRED"]

class CitizenProfile(BaseModel):
    occupation: Optional[str] = None # "farmer", "student", "senior", "other"
    isFarmer: Optional[bool] = None
    landHeldAcres: Optional[float] = None
    isInstitutionalLandholder: Optional[bool] = False
    isIncomeTaxPayer: Optional[bool] = False
    age: Optional[int] = None
    annualIncome: Optional[float] = None
    isStudent: Optional[bool] = None
    hasPuccaHouse: Optional[bool] = None

class EligibilityResult(BaseModel):
    serviceId: str
    status: EligibilityStatus
    explanation: LocalizedString
    missingFields: list[str] = []
    ruleVersion: str = "2026.1-demo"
    isDemoOnly: bool = True

class EligibilityEngine:
    @staticmethod
    def evaluate_pm_kisan(profile: CitizenProfile) -> EligibilityResult:
        missing = []
        if profile.isFarmer is None and profile.occupation != "farmer":
            missing.append("isFarmer")
        if profile.landHeldAcres is None:
            missing.append("landHeldAcres")

        if missing:
            return EligibilityResult(
                serviceId="pm_kisan",
                status="MORE_INFORMATION_REQUIRED",
                explanation=LocalizedString(
                    en="We need to verify if you own cultivable agricultural land.",
                    hi="हमें यह जानने की आवश्यकता है कि क्या आपके पास कृषि भूमि है।",
                    mr="आपल्याकडे शेती जमीन आहे की नाही हे जाणून घेणे आवश्यक आहे."
                ),
                missingFields=missing
            )

        # Exclusion checks
        if profile.isFarmer is False and profile.occupation != "farmer":
            return EligibilityResult(
                serviceId="pm_kisan",
                status="NOT_ELIGIBLE",
                explanation=LocalizedString(
                    en="PM-Kisan is intended specifically for landholding farmer families.",
                    hi="पीएम-किसान विशेष रूप से भूमिधारक किसान परिवारों के लिए है।",
                    mr="पीएम-किसान ही योजना प्रामुख्याने शेतजमीनधारक कुटुंबांसाठी आहे."
                )
            )

        if profile.landHeldAcres is not None and profile.landHeldAcres <= 0:
            return EligibilityResult(
                serviceId="pm_kisan",
                status="NOT_ELIGIBLE",
                explanation=LocalizedString(
                    en="Applicant must hold cultivable agricultural land.",
                    hi="आवेदक के पास कृषि योग्य भूमि होनी चाहिए।",
                    mr="अर्जदाराकडे लागवडीयोग्य शेती जमीन असणे आवश्यक आहे."
                )
            )

        if profile.isInstitutionalLandholder or profile.isIncomeTaxPayer:
            return EligibilityResult(
                serviceId="pm_kisan",
                status="NOT_ELIGIBLE",
                explanation=LocalizedString(
                    en="Institutional landholders or income tax payers are excluded under PM-Kisan rules.",
                    hi="संस्थागत भूमिधारक या आयकर दाता किसान पीएम-किसान नियमों के तहत अपात्र हैं।",
                    mr="संस्थात्मक जमीनधारक किंवा आयकर भरणारे शेतकरी पीएम-किसान नियमांनुसार अपात्र आहेत."
                )
            )

        return EligibilityResult(
            serviceId="pm_kisan",
            status="LIKELY_ELIGIBLE",
            explanation=LocalizedString(
                en="Based on the details provided, you appear to meet the demo eligibility criteria for PM-Kisan.",
                hi="आपके द्वारा दी गई जानकारी के आधार पर, आप पीएम-किसान के डेमो पात्रता मानदंडों को पूरा करते प्रतीत होते हैं।",
                mr="दिलेल्या माहितीच्या आधारे, आपण पीएम-किसानच्या डेमो पात्रता निकषांची पूर्तता करत असल्याचे दिसते."
            )
        )

    @staticmethod
    def evaluate_pension(profile: CitizenProfile) -> EligibilityResult:
        if profile.age is None:
            return EligibilityResult(
                serviceId="old_age_pension",
                status="MORE_INFORMATION_REQUIRED",
                explanation=LocalizedString(
                    en="Age verification is required for old-age pension.",
                    hi="वृद्धावस्था पेंशन के लिए आयु जानना आवश्यक है।",
                    mr="वृद्धपकाळ निवृत्तीवेतनाचा लाभ घेण्यासाठी वयाची माहिती आवश्यक आहे."
                ),
                missingFields=["age"]
            )
        if profile.age < 60:
            return EligibilityResult(
                serviceId="old_age_pension",
                status="NOT_ELIGIBLE",
                explanation=LocalizedString(
                    en="Senior citizen pension requires minimum age of 60 years.",
                    hi="वरिष्ठ नागरिक पेंशन के लिए न्यूनतम आयु 60 वर्ष आवश्यक है।",
                    mr="ज्येष्ठ नागरिक निवृत्तीवेतनासाठी किमान वय ६० वर्षे असणे आवश्यक आहे."
                )
            )
        return EligibilityResult(
            serviceId="old_age_pension",
            status="LIKELY_ELIGIBLE",
            explanation=LocalizedString(
                en="You appear likely eligible for senior citizen pension guidance.",
                hi="आप वरिष्ठ नागरिक पेंशन मार्गदर्शन के लिए पात्र प्रतीत होते हैं।",
                mr="आपण ज्येष्ठ नागरिक निवृत्तीवेतन मार्गदर्शनासाठी पात्र असल्याचे दिसते."
            )
        )

    @staticmethod
    def evaluate(service_id: str, profile: CitizenProfile) -> EligibilityResult:
        if service_id == "pm_kisan":
            return EligibilityEngine.evaluate_pm_kisan(profile)
        elif service_id == "old_age_pension":
            return EligibilityEngine.evaluate_pension(profile)
        else:
            # General guidance default
            return EligibilityResult(
                serviceId=service_id,
                status="LIKELY_ELIGIBLE",
                explanation=LocalizedString(
                    en="Review the official scheme criteria to confirm eligibility.",
                    hi="पात्रता की पुष्टि के लिए आधिकारिक योजना मानदंडों की समीक्षा करें।",
                    mr="पात्रतेची खात्री करण्यासाठी अधिकृत योजनेचे निकष तपासा."
                )
            )

eligibility_engine = EligibilityEngine()
