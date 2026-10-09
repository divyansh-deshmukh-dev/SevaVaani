import type { ServiceDefinition } from '../types';

export const FALLBACK_SERVICES: ServiceDefinition[] = [
  {
    "serviceId": "pm_kisan",
    "id": "pm_kisan",
    "name": {
      "en": "PM-Kisan Samman Nidhi Farmer Registration",
      "hi": "पीएम-किसान सम्मान निधि किसान पंजीकरण",
      "mr": "पीएम-किसान सन्मान निधी शेतकरी नोंदणी"
    },
    "category": "agriculture",
    "serviceType": "agriculture_service",
    "aliases": [
      "pm kisan",
      "pm-kisan",
      "pmkisan",
      "kisan samman nidhi",
      "kisan pension",
      "farmer support",
      "farmer financial help",
      "kisan scheme",
      "पीएम किसान",
      "किसान सम्मान निधि",
      "किसान योजना",
      "किसान आर्थिक सहायता",
      "शेतकरी सन्मान निधी",
      "पीएम किसान योजना",
      "शेतकरी योजना",
      "pm-kisan apply",
      "apply pm kisan",
      "mujhe pm-kisan ke liye apply karna hai"
    ],
    "applicationMode": "direct-demo",
    "directApplicationSupported": true,
    "guidanceAvailable": true,
    "description": {
      "en": "Direct income support of ₹6,000 per year in three equal installments to eligible farmer families across India.",
      "hi": "पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता तीन समान किस्तों में प्रदान की जाती है।",
      "mr": "पात्र शेतकरी कुटुंबांना दरवर्षी तीन समान हप्त्यांमध्ये ₹६,००० चे थेट उत्पन्न सहाय्य प्रदान केले जाते."
    },
    "formSchemaId": "pm_kisan_form",
    "eligibilityRuleId": "pm_kisan_rules",
    "apiAdapter": "demo_pm_kisan",
    "requiredDocuments": [
      {
        "en": "Aadhaar Card (12-digit number)",
        "hi": "आधार कार्ड (12-अंकीय संख्या)",
        "mr": "आधार कार्ड (12-अंकी क्रमांक)"
      },
      {
        "en": "Land ownership record / Khasra-Khatauni",
        "hi": "भूमि स्वामित्व दस्तावेज / खसरा-खतौनी",
        "mr": "जमीन मालकी कागदपत्रे / ७/१२ उतारा"
      },
      {
        "en": "Bank account linked with Aadhaar (DBT active)",
        "hi": "आधार से जुड़ा बैंक खाता (DBT सक्रिय)",
        "mr": "आधारशी जोडलेले बँक खाते (DBT सक्रिय)"
      },
      {
        "en": "Active Mobile Number",
        "hi": "सक्रिय मोबाइल नंबर",
        "mr": "सक्रिय मोबाइल क्रमांक"
      }
    ],
    "guidance": {
      "whoIsItFor": {
        "en": "Small and marginal landholding farmer families with cultivable land holdings in their name.",
        "hi": "खेती योग्य भूमि के स्वामी छोटे एवं सीमांत किसान परिवार जिनके नाम पर भूमि दर्ज हो।",
        "mr": "स्वतःच्या नावावर शेतजमीन असलेली लहान व अल्पभूधारक शेतकरी कुटुंबे."
      },
      "eligibilityCriteria": [
        {
          "en": "Must be an Indian farmer family owning cultivable agricultural land.",
          "hi": "भारतीय किसान परिवार जिसके पास खेती योग्य भूमि का स्वामित्व हो।",
          "mr": "लागवडीयोग्य शेतजमिनीची मालकी असलेले भारतीय शेतकरी कुटुंब असावे."
        },
        {
          "en": "Institutional landholders and institutional bodies are excluded.",
          "hi": "संस्थागत भूमि धारक इस योजना के पात्र नहीं हैं।",
          "mr": "संस्थात्मक जमीनधारक या योजनेस पात्र नाहीत."
        },
        {
          "en": "Income tax payers and serving government employees are excluded.",
          "hi": "आयकर दाता एवं सेवारत सरकारी कर्मचारी अपात्र हैं।",
          "mr": "आयकर भरणारे आणि शासकीय सेवेत असणारे कुटुंब अपात्र आहेत."
        }
      ],
      "requiredDocuments": [
        {
          "en": "Aadhaar Card",
          "hi": "आधार कार्ड",
          "mr": "आधार कार्ड"
        },
        {
          "en": "Land Records / Record of Rights (RoR)",
          "hi": "भूलेख अभिलेख / खतौनी",
          "mr": "७/१२ उतारा / जमीन महसूल नोंद"
        },
        {
          "en": "Aadhaar-seeded Bank Passbook",
          "hi": "आधार से जुड़ा बैंक खाता पासबुक",
          "mr": "आधार संलग्न बँक पासबुक"
        }
      ],
      "steps": [
        {
          "step": 1,
          "title": {
            "en": "Voice Information Capture",
            "hi": "आवाज़ द्वारा विवरण दर्ज करना",
            "mr": "आवाजाद्वारे माहिती नोंदवणे"
          },
          "details": {
            "en": "Speak name, Aadhaar digits, state, district, land area, and bank details in Hindi, Marathi, or English.",
            "hi": "हिंदी, मराठी या अंग्रेजी में नाम, आधार अंक, राज्य, जिला, भूमि क्षेत्र और बैंक विवरण बोलकर बताएं।",
            "mr": "हिंदी, मराठी किंवा इंग्रजीत नाव, आधार क्रमांक, राज्य, जिल्हा, जमीन व बँक तपशील सांगा."
          }
        },
        {
          "step": 2,
          "title": {
            "en": "Citizen Step-by-Step Confirmation",
            "hi": "नागरिक चरणबद्ध पुष्टि",
            "mr": "नागरिक टप्प्याटप्प्याने पडताळणी"
          },
          "details": {
            "en": "Audible playback and on-screen cards confirm each field before proceeding.",
            "hi": "आगे बढ़ने से पहले बोलकर और स्क्रीन पर दिखाकर हर फ़ील्ड की पुष्टि ली जाती है।",
            "mr": "पुढे जाण्यापूर्वी प्रत्येक नोंदीची आवाजाने व स्क्रीनवर पडताळणी केली जाते."
          }
        },
        {
          "step": 3,
          "title": {
            "en": "Demo Application Submission",
            "hi": "डेमो आवेदन प्रस्तुति",
            "mr": "डेमो अर्ज सादर करणे"
          },
          "details": {
            "en": "Generates a structured simulated application ID (e.g., DEMO-PMK-20261009-001) for prototype tracking.",
            "hi": "प्रोटोटाइप ट्रैकिंग हेतु एक संरचित डेमो आवेदन क्रमांक (उदा. DEMO-PMK-20261009-001) तैयार करता है।",
            "mr": "प्रोटोटाइप ट्रॅकिंगसाठी संरचित डेमो अर्ज क्रमांक (उदा. DEMO-PMK-20261009-001) तयार करतो."
          }
        }
      ],
      "faqs": [
        {
          "question": {
            "en": "How much financial assistance is provided?",
            "hi": "योजना के तहत कितनी वित्तीय सहायता मिलती है?",
            "mr": "योजनेंतर्गत किती आर्थिक मदत मिळते?"
          },
          "answer": {
            "en": "₹6,000 per financial year in three equal quarterly installments of ₹2,000 each via Direct Benefit Transfer (DBT).",
            "hi": "प्रति वर्ष ₹6,000 तीन किस्तों में (₹2,000 प्रत्येक) सीधे आधार से जुड़े बैंक खाते में DBT द्वारा।",
            "mr": "दरवर्षी ₹६,००० तीन हप्त्यांमध्ये (प्रत्येकी ₹२,०००) थेट बँक खात्यात DBT द्वारे."
          }
        }
      ],
      "disclaimer": {
        "en": "This is an experimental digital public service demonstration. Direct voice registration is fully active in this prototype.",
        "hi": "यह एक प्रायोगिक डिजिटल सार्वजनिक सेवा डेमो है। इस प्रोटोटाइप में सीधी आवाज़ पंजीकरण सुविधा सक्रिय है।",
        "mr": "हा एक प्रायोगिक डिजिटल सार्वजनिक सेवा डेमो आहे. या प्रोटोटाइपमध्ये थेट आवाज नोंदणी सुविधा सक्रिय आहे."
      }
    },
    "officialSource": "https://pmkisan.gov.in (Official Reference Only)",
    "officialSourceMetadata": {
      "portalName": "PM-Kisan Official Portal",
      "url": "https://pmkisan.gov.in",
      "department": {
        "en": "Ministry of Agriculture & Farmers Welfare, Government of India",
        "hi": "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
        "mr": "कृषी आणि शेतकरी कल्याण मंत्रालय, भारत सरकार"
      }
    },
    "isDemo": true,
    "demoStatus": "Direct voice demo application active"
  },
  {
    "serviceId": "aadhaar_service",
    "id": "aadhaar_service",
    "name": {
      "en": "Aadhaar Card Enrollment & Update Service",
      "hi": "आधार कार्ड नामांकन एवं अद्यतन सेवा",
      "mr": "आधार कार्ड नोंदणी आणि अद्ययावत सेवा"
    },
    "category": "identity",
    "serviceType": "identity_service",
    "aliases": [
      "aadhaar",
      "aadhaar card",
      "aadhar",
      "aadhar card",
      "uidai",
      "आधार",
      "आधार कार्ड",
      "आधार कार्ड बनवाना",
      "आधार कार्ड बनवणे",
      "नया आधार",
      "update aadhaar",
      "aadhaar update",
      "आधार कार्ड बनाना है",
      "aadhaar card banana hai",
      "aadhaar banana",
      "आधार दुरुस्ती",
      "aadhaar kendra"
    ],
    "applicationMode": "guidance-only",
    "directApplicationSupported": false,
    "guidanceAvailable": true,
    "description": {
      "en": "Guidance on enrolling for new Aadhaar card, biometric updates, and updating address or mobile phone linkage.",
      "hi": "नया आधार कार्ड बनवाने, बायोमेट्रिक अपडेट और पता या मोबाइल नंबर सुधार संबंधी संपूर्ण मार्गदर्शन।",
      "mr": "नवीन आधार कार्ड काढणे, बायोमेट्रिक अद्ययावत करणे आणि पत्ता किंवा मोबाइल क्रमांक दुरुस्तीबाबत मार्गदर्शन."
    },
    "formSchemaId": null,
    "eligibilityRuleId": null,
    "apiAdapter": null,
    "requiredDocuments": [
      {
        "en": "Proof of Identity (PoI) - Voter ID, Passport, PAN Card",
        "hi": "पहचान का प्रमाण (PoI) - वोटर आईडी, पासपोर्ट, पैन कार्ड",
        "mr": "ओळखीचा पुरावा (PoI) - मतदार ओळखपत्र, पासपोर्ट, पॅन कार्ड"
      },
      {
        "en": "Proof of Address (PoA) - Electricity bill, Water bill, Ration card",
        "hi": "पते का प्रमाण (PoA) - बिजली बिल, पानी बिल, राशन कार्ड",
        "mr": "पत्त्याचा पुरावा (PoA) - वीज बिल, पाणी बिल, रेशन कार्ड"
      },
      {
        "en": "Proof of Date of Birth (DoB) - Birth Certificate, SSLC Marksheet",
        "hi": "जन्म तिथि का प्रमाण (DoB) - जन्म प्रमाण पत्र, अंकसूची",
        "mr": "जन्मतारखेचा पुरावा (DoB) - जन्म दाखला, शाळा सोडल्याचा दाखला"
      }
    ],
    "guidance": {
      "whoIsItFor": {
        "en": "Every Indian resident citizen of any age (including newborns with Baal Aadhaar).",
        "hi": "किसी भी आयु का प्रत्येक भारतीय निवासी (नवजात शिशुओं हेतु बाल आधार सहित)।",
        "mr": "कोणत्याही वयाचा प्रत्येक भारतीय रहिवासी (लहान मुलांसाठी बाल आधारसह)."
      },
      "eligibilityCriteria": [
        {
          "en": "Resident in India for at least 182 days in the past 12 months.",
          "hi": "पिछले 12 महीनों में कम से कम 182 दिन भारत में निवास किया हो।",
          "mr": "मागील १२ महिन्यांत किमान १८२ दिवस भारतात वास्तव्य केलेले असावे."
        }
      ],
      "requiredDocuments": [
        {
          "en": "Valid Identity Proof (e.g., PAN Card, Voter ID)",
          "hi": "वैध पहचान पत्र (जैसे पैन कार्ड, वोटर आईडी)",
          "mr": "वैध ओळखपत्र (उदा. पॅन कार्ड, मतदार ओळखपत्र)"
        },
        {
          "en": "Valid Address Proof (e.g., Electricity bill, Domicile)",
          "hi": "वैध निवास प्रमाण (जैसे बिजली बिल, निवास प्रमाण पत्र)",
          "mr": "वैध रहिवासी पुरावा (उदा. वीज बिल, अधिवास दाखला)"
        }
      ],
      "steps": [
        {
          "step": 1,
          "title": {
            "en": "Locate Authorized Enrollment Centre",
            "hi": "अधिकृत आधार सेवा केंद्र खोजें",
            "mr": "अधिकृत आधार नोंदणी केंद्र शोधा"
          },
          "details": {
            "en": "Visit an authorized UIDAI Aadhaar Seva Kendra, post office, or designated bank branch.",
            "hi": "अपने निकटतम यूआईडीएआई आधार सेवा केंद्र, डाकघर या अधिकृत बैंक शाखा पर जाएं।",
            "mr": "जवळच्या UIDAI आधार सेवा केंद्राला, पोस्ट ऑफिसला किंवा अधिकृत बँकेला भेट द्या."
          }
        },
        {
          "step": 2,
          "title": {
            "en": "Biometric & Demographic Capture",
            "hi": "बायोमेट्रिक एवं विवरण दर्ज कराना",
            "mr": "बायोमेट्रिक आणि माहिती नोंदणी"
          },
          "details": {
            "en": "Provide iris scan, 10 fingerprints, live photograph, and verify document proofs.",
            "hi": "आंखों की पुतली (आइरिस), दसों उंगलियों के निशान, फोटो और दस्तावेज़ सत्यापन कराएं।",
            "mr": "डोळ्यांचे स्कॅन, १० बोटांचे ठसे, फोटो आणि कागदपत्रांची पडताळणी करून घ्या."
          }
        },
        {
          "step": 3,
          "title": {
            "en": "Receive Acknowledgement Slip (EID)",
            "hi": "नामांकन रसीद (EID) प्राप्त करें",
            "mr": "नोंदणी पावती (EID) मिळवा"
          },
          "details": {
            "en": "Collect the 28-digit Enrollment Slip to track status online at uidai.gov.in.",
            "hi": "uidai.gov.in पर स्थिति ट्रैक करने के लिए 28-अंकीय नामांकन पर्ची संभाल कर रखें।",
            "mr": "uidai.gov.in वर स्थिती तपासण्यासाठी २८-अंकी नोंदणी पावती जपून ठेवा."
          }
        }
      ],
      "faqs": [
        {
          "question": {
            "en": "Can Aadhaar card be made purely online from home?",
            "hi": "क्या नया आधार कार्ड घर बैठे पूरी तरह ऑनलाइन बन सकता है?",
            "mr": "नवीन आधार कार्ड घरात बसून पूर्णपणे ऑनलाइन काढता येते का?"
          },
          "answer": {
            "en": "No. Fresh enrollment mandates physical biometric capture (fingerprints & iris) at an authorized center.",
            "hi": "नहीं। नए नामांकन के लिए अधिकृत केंद्र पर जाकर बायोमेट्रिक (उंगलियों व आंखों का स्कैन) कराना अनिवार्य है।",
            "mr": "नाही. नवीन नोंदणीसाठी अधिकृत केंद्रावर जाऊन बोटांचे ठसे व डोळ्यांचे स्कॅन देणे बंधनकारक आहे."
          }
        }
      ],
      "disclaimer": {
        "en": "Direct application is not available in this prototype. Biometrics require an authorized in-person UIDAI center.",
        "hi": "इस प्रोटोटाइप में सीधा ऑनलाइन आवेदन उपलब्ध नहीं है। बायोमेट्रिक हेतु अधिकृत केंद्र पर उपस्थिति आवश्यक है।",
        "mr": "या प्रोटोटाइपमध्ये थेट अर्ज उपलब्ध नाही. बायोमेट्रिकसाठी अधिकृत केंद्रावर उपस्थिती आवश्यक आहे."
      }
    },
    "officialSource": "https://uidai.gov.in (Official Reference Only)",
    "officialSourceMetadata": {
      "portalName": "Unique Identification Authority of India (UIDAI)",
      "url": "https://uidai.gov.in",
      "department": {
        "en": "Ministry of Electronics and Information Technology (MeitY), Government of India",
        "hi": "इलेक्ट्रॉनिक्स एवं सूचना प्रौद्योगिकी मंत्रालय, भारत सरकार",
        "mr": "इलेक्ट्रॉनिक्स आणि माहिती तंत्रज्ञान मंत्रालय, भारत सरकार"
      }
    },
    "isDemo": true,
    "demoStatus": "Guidance available in prototype"
  },
  {
    "serviceId": "ration_card",
    "id": "ration_card",
    "name": {
      "en": "National Food Security Ration Card Assistance",
      "hi": "राष्ट्रीय खाद्य सुरक्षा राशन कार्ड सहायता",
      "mr": "राष्ट्रीय अन्न सुरक्षा शिधापत्रिका (रेशन कार्ड) सहाय्य"
    },
    "category": "food_security",
    "serviceType": "food_service",
    "aliases": [
      "ration card",
      "ration",
      "food security",
      "nfsa",
      "rashan card",
      "राशन कार्ड",
      "राशन",
      "खाद्य सुरक्षा",
      "शिधापत्रिका",
      "रेशन कार्ड",
      "रेशन",
      "राशन कार्ड बनवाना",
      "ration card banana hai",
      "नवीन शिधापत्रिका"
    ],
    "applicationMode": "guidance-only",
    "directApplicationSupported": false,
    "guidanceAvailable": true,
    "description": {
      "en": "Guidance on applying for new ration cards, adding family members, and subsidized food grain eligibility under NFSA.",
      "hi": "नया राशन कार्ड बनवाने, परिवार के सदस्य जोड़ने और एनएफएसए के तहत रियायती खाद्यान्न पात्रता संबंधी मार्गदर्शन।",
      "mr": "नवीन शिधापत्रिका, कुटुंबातील सदस्य जोडणे आणि अनुदानित अन्नधान्य पात्रतेबाबत सविस्तर मार्गदर्शन."
    },
    "formSchemaId": null,
    "eligibilityRuleId": "ration_card_rules",
    "apiAdapter": null,
    "requiredDocuments": [
      {
        "en": "Aadhaar cards of all family members",
        "hi": "परिवार के सभी सदस्यों के आधार कार्ड",
        "mr": "कुटुंबातील सर्व सदस्यांची आधार कार्डे"
      },
      {
        "en": "Income Certificate / Proof of income",
        "hi": "आय प्रमाण पत्र",
        "mr": "उत्पन्न प्रमाणपत्र"
      },
      {
        "en": "Proof of Residence (Electricity bill, gas passbook)",
        "hi": "निवास प्रमाण पत्र (बिजली बिल, गैस पासबुक)",
        "mr": "रहिवासी पुरावा (वीज बिल, गॅस पासबुक)"
      }
    ],
    "guidance": {
      "whoIsItFor": {
        "en": "Economically vulnerable households and families requiring subsidized food grains.",
        "hi": "आर्थिक रूप से कमजोर परिवार जिन्हें रियायती खाद्यान्न की आवश्यकता है।",
        "mr": "अनुदानित अन्नधान्याची गरज असणारी आर्थिकदृष्ट्या दुर्बल कुटुंबे."
      },
      "eligibilityCriteria": [
        {
          "en": "Resident family without an existing active ration card in another state.",
          "hi": "परिवार का किसी अन्य राज्य में पहले से सक्रिय राशन कार्ड नहीं होना चाहिए।",
          "mr": "दुसऱ्या राज्यात कुटुंबाचे सक्रिय रेशन कार्ड नसावे."
        },
        {
          "en": "Household income within state poverty and welfare criteria.",
          "hi": "पारिवारिक आय राज्य द्वारा निर्धारित सीमा के भीतर होनी चाहिए।",
          "mr": "कुटुंबाचे वार्षिक उत्पन्न राज्य शासनाच्या निकषांनुसार असावे."
        }
      ],
      "requiredDocuments": [
        {
          "en": "Aadhaar Cards of all members",
          "hi": "सभी सदस्यों के आधार कार्ड",
          "mr": "सर्व सदस्यांचे आधार कार्ड"
        },
        {
          "en": "Proof of residence",
          "hi": "निवास प्रमाण पत्र",
          "mr": "रहिवासी पुरावा"
        }
      ],
      "steps": [
        {
          "step": 1,
          "title": {
            "en": "Submit Application via State Food Portal or CSC",
            "hi": "राज्य खाद्य पोर्टल या जनसेवा केंद्र (CSC) पर आवेदन",
            "mr": "राज्य अन्न नागरी पुरवठा पोर्टल किंवा सीएससीवर अर्ज"
          },
          "details": {
            "en": "Fill state food supplies form with family tree and member Aadhaar numbers.",
            "hi": "परिवार के सभी सदस्यों के आधार और विवरण के साथ राज्य खाद्य आपूर्ति फॉर्म भरें।",
            "mr": "कुटुंबातील सदस्यांचे आधार व तपशील जोडून अन्न पुरवठा अर्ज भरा."
          }
        },
        {
          "step": 2,
          "title": {
            "en": "Document Verification by Supply Inspector",
            "hi": "पूर्ति निरीक्षक द्वारा सत्यापन",
            "mr": "पुरवठा निरीक्षकाकडून पडताळणी"
          },
          "details": {
            "en": "Local civil supplies inspector verifies family residence and income threshold.",
            "hi": "स्थानीय नागरिक आपूर्ति निरीक्षक निवास और आय सीमा का सत्यापन करता है।",
            "mr": "स्थानिक नागरी पुरवठा निरीक्षक रहिवासी आणि उत्पन्न निकषांची तपासणी करतो."
          }
        },
        {
          "step": 3,
          "title": {
            "en": "Ration Card Issuance & Fair Price Shop Linking",
            "hi": "राशन कार्ड जारी होना एवं उचित दर दुकान से संबद्धता",
            "mr": "रेशन कार्ड वाटप आणि रास्त भाव दुकानाशी जोडणी"
          },
          "details": {
            "en": "Collect digital or physical card and collect quota from designated fair price shop.",
            "hi": "डिजिटल या भौतिक राशन कार्ड प्राप्त करें और निर्धारित कोटे का खाद्यान्न प्राप्त करें।",
            "mr": "डिजिटल किंवा प्रत्यक्ष रेशन कार्ड मिळवा आणि धान्याचा कोटा मिळवा."
          }
        }
      ],
      "faqs": [
        {
          "question": {
            "en": "What is the One Nation One Ration Card (ONORC)?",
            "hi": "वन नेशन वन राशन कार्ड (ONORC) क्या है?",
            "mr": "वन नेशन वन रेशन कार्ड म्हणजे काय?"
          },
          "answer": {
            "en": "It allows migrant beneficiaries to collect subsidized rations from any Fair Price Shop across India using biometric authentication.",
            "hi": "यह प्रवासी श्रमिकों को भारत में कहीं भी बायोमेट्रिक प्रमाणीकरण द्वारा अपना राशन लेने की सुविधा देता है।",
            "mr": "हे स्थलांतरित कामगारांना देशभरात कोणत्याही रास्त भाव दुकानातून बायोमेट्रिकने धान्य घेण्याची मुभा देते."
          }
        }
      ],
      "disclaimer": {
        "en": "Direct application is not available in this prototype. Guidance provided reflects NFSA standards.",
        "hi": "इस प्रोटोटाइप में सीधा ऑनलाइन आवेदन उपलब्ध नहीं है। यहाँ NFSA मानकों का मार्गदर्शन दिया गया है।",
        "mr": "या प्रोटोटाइपमध्ये थेट अर्ज उपलब्ध नाही. येथे NFSA मानकांचे मार्गदर्शन दिले आहे."
      }
    },
    "officialSource": "https://nfsa.gov.in (Official Reference Only)",
    "officialSourceMetadata": {
      "portalName": "National Food Security Portal (NFSA)",
      "url": "https://nfsa.gov.in",
      "department": {
        "en": "Department of Food and Public Distribution, Government of India",
        "hi": "खाद्य एवं सार्वजनिक वितरण विभाग, भारत सरकार",
        "mr": "अन्न आणि सार्वजनिक वितरण विभाग, भारत सरकार"
      }
    },
    "isDemo": true,
    "demoStatus": "Guidance available in prototype"
  },
  {
    "serviceId": "old_age_pension",
    "id": "old_age_pension",
    "name": {
      "en": "National Social Assistance Old Age Pension (IGNOAPS)",
      "hi": "राष्ट्रीय सामाजिक सहायता वृद्धावस्था पेंशन योजना",
      "mr": "राष्ट्रीय सामाजिक सहाय्य वृद्धपकाळ निवृत्तीवेतन योजना"
    },
    "category": "social_welfare",
    "serviceType": "social_security",
    "aliases": [
      "old age pension",
      "pension",
      "vridha pension",
      "senior citizen pension",
      "budhapa pension",
      "पेंशन",
      "वृद्धावस्था पेंशन",
      "बुढ़ापा पेंशन",
      "पेन्शन",
      "श्रावण बाळ योजना",
      "वृद्ध निवृत्तीवेतन",
      "budhapa pension chahiye",
      "ज्येष्ठ नागरिक पेन्शन",
      "mujhe budhapa pension ke baare mein batao"
    ],
    "applicationMode": "guidance-only",
    "directApplicationSupported": false,
    "guidanceAvailable": true,
    "description": {
      "en": "Monthly pension support to senior citizens aged 60 and above living below the poverty line.",
      "hi": "गरीबी रेखा से नीचे रहने वाले 60 वर्ष या उससे अधिक आयु के वरिष्ठ नागरिकों को मासिक वित्तीय पेंशन सहायता।",
      "mr": "दारिद्र्यरेषेखालील ६० वर्षे आणि त्याहून अधिक वयाच्या ज्येष्ठ नागरिकांना मासिक निवृत्तीवेतन सहाय्य."
    },
    "formSchemaId": null,
    "eligibilityRuleId": "pension_rules",
    "apiAdapter": null,
    "requiredDocuments": [
      {
        "en": "Age proof / Birth certificate / Aadhaar",
        "hi": "आयु प्रमाण / जन्म प्रमाण पत्र / आधार",
        "mr": "वयाचा पुरावा / जन्माचा दाखला / आधार"
      },
      {
        "en": "BPL card or verified low-income certificate",
        "hi": "बीपीएल कार्ड या सत्यापित अल्प आय प्रमाण पत्र",
        "mr": "बीपीएल कार्ड किंवा प्रमाणित अल्प उत्पन्न दाखला"
      },
      {
        "en": "Bank Passbook with Aadhaar linkage",
        "hi": "आधार से जुड़ा बैंक खाता पासबुक",
        "mr": "आधार संलग्न बँक पासबुक"
      }
    ],
    "guidance": {
      "whoIsItFor": {
        "en": "Senior citizens aged 60+ belonging to BPL households.",
        "hi": "बीपीएल परिवारों के 60 वर्ष या उससे अधिक आयु के वरिष्ठ नागरिक।",
        "mr": "दारिद्र्यरेषेखालील ६० किंवा त्याहून अधिक वयाचे ज्येष्ठ नागरिक."
      },
      "eligibilityCriteria": [
        {
          "en": "Applicant must be aged 60 years or above.",
          "hi": "आवेदक की आयु 60 वर्ष या उससे अधिक होनी चाहिए।",
          "mr": "अर्जदाराचे वय ६० वर्षे किंवा त्याहून अधिक असावे."
        },
        {
          "en": "Household must belong to Below Poverty Line (BPL) according to government criteria.",
          "hi": "आवेदक परिवार गरीबी रेखा से नीचे (बीपीएल) श्रेणी में होना चाहिए।",
          "mr": "कुटुंब दारिद्र्यरेषेखालील (BPL) प्रवर्गातील असावे."
        }
      ],
      "requiredDocuments": [
        {
          "en": "Age verification proof",
          "hi": "आयु प्रमाण पत्र",
          "mr": "वयाचा पुरावा"
        },
        {
          "en": "BPL Card / Income certificate",
          "hi": "बीपीएल कार्ड / आय प्रमाण पत्र",
          "mr": "बीपीएल कार्ड / उत्पन्न दाखला"
        }
      ],
      "steps": [
        {
          "step": 1,
          "title": {
            "en": "Application at Block Development Office (BDO) or CSC",
            "hi": "ब्लॉक विकास कार्यालय (BDO) या जनसेवा केंद्र पर आवेदन",
            "mr": "पंचायत समिती किंवा नागरी केंद्रात अर्ज"
          },
          "details": {
            "en": "Submit NSAP pension form along with proof of age and BPL card.",
            "hi": "आयु प्रमाण और बीपीएल कार्ड के साथ एनएसएपी पेंशन फॉर्म जमा करें।",
            "mr": "वयाचा पुरावा व बीपीएल कार्डासह निवृत्तीवेतन अर्ज सादर करा."
          }
        },
        {
          "step": 2,
          "title": {
            "en": "Sanction by District Social Welfare Officer",
            "hi": "जिला समाज कल्याण अधिकारी द्वारा स्वीकृति",
            "mr": "जिल्हा समाज कल्याण अधिकाऱ्यांची मंजुरी"
          },
          "details": {
            "en": "Social welfare department verifies age criteria and sanctions pension order.",
            "hi": "समाज कल्याण विभाग आयु सत्यापन के उपरांत पेंशन स्वीकृति आदेश जारी करता है।",
            "mr": "समाज कल्याण विभागाकडून छाननी होऊन निवृत्तीवेतन मंजूर केले जाते."
          }
        },
        {
          "step": 3,
          "title": {
            "en": "Monthly DBT Disbursement",
            "hi": "मासिक डीबीटी पेंशन अंतरण",
            "mr": "मासिक बँक खात्यात थेट जमा"
          },
          "details": {
            "en": "Monthly amount is deposited directly into the beneficiary's Aadhaar-linked bank account.",
            "hi": "मासिक राशि सीधे लाभार्थी के आधार से जुड़े बैंक खाते में जमा होती है।",
            "mr": "मासिक रक्कम थेट आधार संलग्न बँक खात्यात जमा होते."
          }
        }
      ],
      "faqs": [
        {
          "question": {
            "en": "What is the monthly pension amount?",
            "hi": "मासिक पेंशन राशि कितनी है?",
            "mr": "मासिक निवृत्तीवेतन किती मिळते?"
          },
          "answer": {
            "en": "Central government contributes ₹200-₹500/month, and states add top-ups, making total pension ₹1,000 to ₹3,000/month depending on state.",
            "hi": "केंद्र सरकार ₹200-₹500 और राज्य सरकार अतिरिक्त टॉप-अप देती है, जिससे कुल पेंशन ₹1,000 से ₹3,000 प्रति माह होती है।",
            "mr": "केंद्र आणि राज्य शासनाच्या एकत्रित हिश्श्यामुळे राज्यानुसार दरमहा ₹१,००० ते ₹३,००० मिळतात."
          }
        }
      ],
      "disclaimer": {
        "en": "Direct application is not available in this prototype. Guidance provided reflects NSAP standards.",
        "hi": "इस प्रोटोटाइप में सीधा ऑनलाइन आवेदन उपलब्ध नहीं है। यहाँ एनएसएपी मानकों का मार्गदर्शन दिया गया है।",
        "mr": "या प्रोटोटाइपमध्ये थेट अर्ज उपलब्ध नाही. येथे NSAP मानकांचे मार्गदर्शन दिले आहे."
      }
    },
    "officialSource": "https://nsap.nic.in (Official Reference Only)",
    "officialSourceMetadata": {
      "portalName": "National Social Assistance Programme (NSAP)",
      "url": "https://nsap.nic.in",
      "department": {
        "en": "Ministry of Rural Development, Government of India",
        "hi": "ग्रामीण विकास मंत्रालय, भारत सरकार",
        "mr": "ग्रामविकास मंत्रालय, भारत सरकार"
      }
    },
    "isDemo": true,
    "demoStatus": "Guidance available in prototype"
  },
  {
    "serviceId": "post_matric_scholarship",
    "id": "post_matric_scholarship",
    "name": {
      "en": "Post-Matric Student Scholarship Assistance",
      "hi": "पोस्ट-मैट्रिक छात्रवृत्ति सहायता",
      "mr": "मॅट्रिकोत्तर विद्यार्थी शिष्यवृत्ती सहाय्य"
    },
    "category": "education",
    "serviceType": "education_service",
    "aliases": [
      "scholarship",
      "post matric scholarship",
      "student scholarship",
      "education help",
      "chhatravritti",
      "छात्रवृत्ति",
      "स्कॉलरशिप",
      "पढ़ाई सहायता",
      "शिष्यवृत्ती",
      "विद्यार्थी शिष्यवृत्ती",
      "शिक्षण सहाय्य",
      "student scholarship chahiye"
    ],
    "applicationMode": "guidance-only",
    "directApplicationSupported": false,
    "guidanceAvailable": true,
    "description": {
      "en": "Financial assistance to students from eligible families pursuing post-matriculation and higher educational courses.",
      "hi": "10वीं के बाद उच्चतर माध्यमिक एवं कॉलेज की पढ़ाई कर रहे पात्र विद्यार्थियों हेतु वित्तीय छात्रवृत्ति सहायता।",
      "mr": "१० वी नंतर उच्च माध्यमिक व महाविद्यालयीन शिक्षण घेणाऱ्या पात्र विद्यार्थ्यांसाठी शिष्यवृत्ती."
    },
    "formSchemaId": null,
    "eligibilityRuleId": "scholarship_rules",
    "apiAdapter": null,
    "requiredDocuments": [
      {
        "en": "Marksheet of previous qualifying exam",
        "hi": "पिछली उत्तीर्ण परीक्षा की अंकसूची",
        "mr": "मागील उत्तीर्ण परीक्षेचे गुणपत्रक"
      },
      {
        "en": "Family Income Certificate",
        "hi": "पारिवारिक आय प्रमाण पत्र",
        "mr": "कौटुंबिक उत्पन्न दाखला"
      },
      {
        "en": "Caste / Category Certificate (if applicable)",
        "hi": "जाति / श्रेणी प्रमाण पत्र (यदि लागू हो)",
        "mr": "जातीचे प्रमाणपत्र (लागू असल्यास)"
      }
    ],
    "guidance": {
      "whoIsItFor": {
        "en": "Students in Class 11, 12, ITI, Diploma, Undergraduate, and Postgraduate programs.",
        "hi": "कक्षा 11वीं, 12वीं, आईटीआई, डिप्लोमा और कॉलेज में अध्ययनरत विद्यार्थी।",
        "mr": "११ वी, १२ वी, आयटीआय, पदविका आणि पदवीचे शिक्षण घेणारे विद्यार्थी."
      },
      "eligibilityCriteria": [
        {
          "en": "Passed 10th standard and enrolled in a recognized educational institute.",
          "hi": "मान्यता प्राप्त संस्थान में 10वीं के बाद नियमित प्रवेश लिया हो।",
          "mr": "मान्यताप्राप्त शिक्षण संस्थेत १० वी नंतर नियमित प्रवेश घेतलेला असावा."
        },
        {
          "en": "Family annual income within scheme limits (typically under ₹2.5 Lakhs).",
          "hi": "वार्षिक पारिवारिक आय योजना सीमा (सामान्यतः ₹2.5 लाख से कम) में हो।",
          "mr": "कुटुंबाचे वार्षिक उत्पन्न विहित मर्यादेत असावे."
        }
      ],
      "requiredDocuments": [
        {
          "en": "Previous Marksheet & Fee Receipt",
          "hi": "पिछली अंकसूची एवं शुल्क रसीद",
          "mr": "मागील गुणपत्रिका व फी पावती"
        },
        {
          "en": "Income Certificate & Bank Passbook",
          "hi": "आय प्रमाण पत्र एवं बैंक पासबुक",
          "mr": "उत्पन्न दाखला व बँक पासबुक"
        }
      ],
      "steps": [
        {
          "step": 1,
          "title": {
            "en": "Register on National Scholarship Portal (NSP)",
            "hi": "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) पर पंजीकरण",
            "mr": "नॅशनल स्कॉलरशिप पोर्टलवर (NSP) नोंदणी"
          },
          "details": {
            "en": "Create One-Time Registration (OTR) with Aadhaar and enter academic details.",
            "hi": "आधार द्वारा वन-टाइम रजिस्ट्रेशन (OTR) करें और शैक्षणिक विवरण भरें।",
            "mr": "आधारद्वारे ओसीआर नोंदणी करून शैक्षणिक तपशील भरा."
          }
        },
        {
          "step": 2,
          "title": {
            "en": "Institute Level Verification",
            "hi": "संस्थान स्तर पर सत्यापन",
            "mr": "महाविद्यालयीन स्तरावर पडताळणी"
          },
          "details": {
            "en": "School/College nodal officer verifies the bonafide student admission.",
            "hi": "स्कूल या कॉलेज का नोडल अधिकारी छात्र प्रवेश का सत्यापन करता है।",
            "mr": "शाळा किंवा महाविद्यालयाचे नोडल अधिकारी प्रवेशाची पडताळणी करतात."
          }
        },
        {
          "step": 3,
          "title": {
            "en": "Direct DBT Fee & Maintenance Transfer",
            "hi": "सीधे बैंक खाते में छात्रवृत्ति अंतरण",
            "mr": "थेट बँक खात्यात शिष्यवृत्ती जमा"
          },
          "details": {
            "en": "Approved scholarship and maintenance allowance are credited via DBT.",
            "hi": "स्वीकृत छात्रवृत्ति राशि सीधे आधार से जुड़े खाते में डीबीटी द्वारा प्राप्त होती है।",
            "mr": "मंजूर शिष्यवृत्तीची रक्कम थेट बँक खात्यात जमा होते."
          }
        }
      ],
      "faqs": [
        {
          "question": {
            "en": "When do applications typically open?",
            "hi": "छात्रवृत्ति के आवेदन सामान्यतः कब शुरू होते हैं?",
            "mr": "शिष्यवृत्तीचे अर्ज सामान्यतः केव्हा सुरू होतात?"
          },
          "answer": {
            "en": "NSP applications generally open between July and November each academic year.",
            "hi": "एनएसपी पर प्रत्येक शैक्षणिक वर्ष में सामान्यतः जुलाई से नवंबर के बीच आवेदन शुरू होते हैं।",
            "mr": "NSP पोर्टलवर दरवर्षी जुलै ते नोव्हेंबर दरम्यान अर्ज प्रक्रिया सुरू असते."
          }
        }
      ],
      "disclaimer": {
        "en": "Direct application is not available in this prototype. Guidance provided reflects NSP standards.",
        "hi": "इस प्रोटोटाइप में सीधा ऑनलाइन आवेदन उपलब्ध नहीं है। यहाँ एनएसपी मानकों का मार्गदर्शन दिया गया है।",
        "mr": "या प्रोटोटाइपमध्ये थेट अर्ज उपलब्ध नाही. येथे NSP मानकांचे मार्गदर्शन दिले आहे."
      }
    },
    "officialSource": "https://scholarships.gov.in (Official Reference Only)",
    "officialSourceMetadata": {
      "portalName": "National Scholarship Portal (NSP)",
      "url": "https://scholarships.gov.in",
      "department": {
        "en": "Ministry of Electronics and Information Technology (MeitY), Government of India",
        "hi": "इलेक्ट्रॉनिक्स एवं सूचना प्रौद्योगिकी मंत्रालय, भारत सरकार",
        "mr": "इलेक्ट्रॉनिक्स आणि माहिती तंत्रज्ञान मंत्रालय, भारत सरकार"
      }
    },
    "isDemo": true,
    "demoStatus": "Guidance available in prototype"
  },
  {
    "serviceId": "pm_awas_yojana",
    "id": "pm_awas_yojana",
    "name": {
      "en": "Pradhan Mantri Awas Yojana (Rural / Urban Housing)",
      "hi": "प्रधानमंत्री आवास योजना (ग्रामीण / शहरी आवास सहायता)",
      "mr": "प्रधानमंत्री आवास योजना (ग्रामीण / शहरी घरकुल सहाय्य)"
    },
    "category": "housing",
    "serviceType": "housing_service",
    "aliases": [
      "pm awas",
      "awas yojana",
      "housing scheme",
      "ghar yojana",
      "makan yojana",
      "आवास योजना",
      "पीएम आवास",
      "घर योजना",
      "मकान सहायता",
      "आवास",
      "घरकुल योजना",
      "घरकुल"
    ],
    "applicationMode": "guidance-only",
    "directApplicationSupported": false,
    "guidanceAvailable": true,
    "description": {
      "en": "Financial assistance for construction of pucca houses for homeless and families living in kutcha/dilapidated houses.",
      "hi": "बेघर तथा कच्चे या जीर्ण-शीर्ण मकानों में रहने वाले परिवारों के लिए पक्के मकान के निर्माण हेतु वित्तीय सहायता।",
      "mr": "बेघर आणि कच्च्या घरात राहणाऱ्या कुटुंबांसाठी पक्क्या घराच्या बांधकामासाठी आर्थिक सहाय्य."
    },
    "formSchemaId": null,
    "eligibilityRuleId": "housing_rules",
    "apiAdapter": null,
    "requiredDocuments": [
      {
        "en": "Aadhaar Card",
        "hi": "आधार कार्ड",
        "mr": "आधार कार्ड"
      },
      {
        "en": "Job Card / BPL Proof / Income Certificate",
        "hi": "जॉब कार्ड / बीपीएल प्रमाण / आय प्रमाण",
        "mr": "जॉब कार्ड / बीपीएल प्रमाणपत्र / उत्पन्न दाखला"
      },
      {
        "en": "Geo-tagged photo of existing kutcha house",
        "hi": "कच्चे मकान का जियो-टैग्ड फोटो",
        "mr": "सध्याच्या कच्च्या घराचा फोटो"
      }
    ],
    "guidance": {
      "whoIsItFor": {
        "en": "Homeless families and households living in zero, one, or two-room houses with kutcha walls and roof.",
        "hi": "बेघर परिवार एवं कच्चे दीवारों/छत वाले मकानों में रहने वाले परिवार।",
        "mr": "बेघर कुटुंबे आणि कच्च्या घरात राहणारी कुटुंबे."
      },
      "eligibilityCriteria": [
        {
          "en": "Family must not own a pucca house anywhere in India.",
          "hi": "परिवार के किसी भी सदस्य के नाम पर भारत में कहीं भी पक्का मकान नहीं होना चाहिए।",
          "mr": "कुटुंबाच्या मालकीचे भारतात कोठेही पक्के घर नसावे."
        }
      ],
      "requiredDocuments": [
        {
          "en": "Aadhaar number and consent",
          "hi": "आधार संख्या एवं सहमति",
          "mr": "आधार क्रमांक"
        },
        {
          "en": "Bank account details",
          "hi": "बैंक खाता विवरण",
          "mr": "बँक खाते तपशील"
        }
      ],
      "steps": [
        {
          "step": 1,
          "title": {
            "en": "Name in Gram Panchayat PMAY-G Beneficiary List",
            "hi": "ग्राम पंचायत आवास प्रतीक्षा सूची में नाम",
            "mr": "ग्रामपंचायत घरकुल प्रतीक्षा यादीत नाव"
          },
          "details": {
            "en": "SECC 2011 and Awas+ survey determines priority list ratified by Gram Sabha.",
            "hi": "ग्राम सभा द्वारा अनुमोदित आवास प्लस प्राथमिकता सूची में नाम दर्ज होना आवश्यक है।",
            "mr": "ग्रामसभेत मंजूर केलेल्या आवास प्लस प्राधान्य यादीनुसार निवड केली जाते."
          }
        },
        {
          "step": 2,
          "title": {
            "en": "Geo-Tagging Inspection & Sanction",
            "hi": "जियो-टैगिंग निरीक्षण एवं स्वीकृति",
            "mr": "जमीन जिओ-टॅगिंग व मंजुरी"
          },
          "details": {
            "en": "Village official captures geo-tagged photos of existing site before construction.",
            "hi": "पंचायत अधिकारी निर्माण से पूर्व मौजूदा स्थल का जियो-टैग्ड फोटो अपलोड करता है।",
            "mr": "बांधकामापूर्वी जागेचे जिओ-टॅगिंग करून फोटो अपलोड केले जातात."
          }
        },
        {
          "step": 3,
          "title": {
            "en": "Installment-wise Fund Release (₹1.20 - ₹1.30 Lakhs)",
            "hi": "किस्तवार निर्माण राशि अंतरण (₹1.20 - ₹1.30 लाख)",
            "mr": "टप्प्याटप्प्याने हप्ते जमा (₹१.२० ते ₹१.३० लाख)"
          },
          "details": {
            "en": "Funds released in 3-4 stages: Plinth, Lintle, Roof, and Completion.",
            "hi": "निर्माण के चरणों (नींव, लिंटल, छत और पूर्णता) के आधार पर 3-4 किस्तों में राशि अंतरित होती है।",
            "mr": "पाया, खिडकी, स्लॅब व पूर्णत्व या टप्प्यांवर हप्त्यांमध्ये रक्कम बँक खात्यात जमा होते."
          }
        }
      ],
      "faqs": [
        {
          "question": {
            "en": "Is toilet assistance included?",
            "hi": "क्या शौचालय निर्माण सहायता भी मिलती है?",
            "mr": "शौचालय बांधकामासाठी स्वतंत्र मदत मिळते का?"
          },
          "answer": {
            "en": "Yes. ₹12,000 additional assistance is provided through Swachh Bharat Mission (Grameen) for toilet construction.",
            "hi": "हाँ। स्वच्छ भारत मिशन द्वारा शौचालय निर्माण हेतु अतिरिक्त ₹12,000 की सहायता मिलती है।",
            "mr": "होय. स्वच्छ भारत मिशन अंतर्गत शौचालयासाठी अतिरिक्त ₹१२,००० दिले जातात."
          }
        }
      ],
      "disclaimer": {
        "en": "Direct application is not available in this prototype. Guidance provided reflects PMAY standards.",
        "hi": "इस प्रोटोटाइप में सीधा ऑनलाइन आवेदन उपलब्ध नहीं है। यहाँ पीएमएवाई मानकों का मार्गदर्शन दिया गया है।",
        "mr": "या प्रोटोटाइपमध्ये थेट अर्ज उपलब्ध नाही. येथे PMAY मानकांचे मार्गदर्शन दिले आहे."
      }
    },
    "officialSource": "https://pmayg.nic.in (Official Reference Only)",
    "officialSourceMetadata": {
      "portalName": "Pradhan Mantri Awaas Yojana - Gramin",
      "url": "https://pmayg.nic.in",
      "department": {
        "en": "Ministry of Rural Development, Government of India",
        "hi": "ग्रामीण विकास मंत्रालय, भारत सरकार",
        "mr": "ग्रामविकास मंत्रालय, भारत सरकार"
      }
    },
    "isDemo": true,
    "demoStatus": "Guidance available in prototype"
  },
  {
    "serviceId": "income_certificate",
    "id": "income_certificate",
    "name": {
      "en": "Income Certificate Issuance Service",
      "hi": "आय प्रमाण पत्र निर्गमन सेवा",
      "mr": "उत्पन्न प्रमाणपत्र वितरण सेवा"
    },
    "category": "certificate",
    "serviceType": "certificate_service",
    "aliases": [
      "income certificate",
      "aay praman patra",
      "उत्पन्न दाखला",
      "आय प्रमाण पत्र",
      "income praman patra",
      "आय प्रमाणपत्र",
      "aay praman"
    ],
    "applicationMode": "guidance-only",
    "directApplicationSupported": false,
    "guidanceAvailable": true,
    "description": {
      "en": "Official state certificate certifying annual family income for welfare schemes, scholarships, and fee concessions.",
      "hi": "सरकारी योजनाओं, छात्रवृत्ति और शुल्क छूट हेतु वार्षिक पारिवारिक आय को प्रमाणित करने वाला आधिकारिक प्रमाण पत्र।",
      "mr": "शासकीय योजना, शिष्यवृत्ती आणि शुल्क सवलतींसाठी वार्षिक कौटुंबिक उत्पन्नाचा अधिकृत दाखला."
    },
    "formSchemaId": null,
    "eligibilityRuleId": null,
    "apiAdapter": null,
    "requiredDocuments": [
      {
        "en": "Salary slip or self-declaration affidavit",
        "hi": "वेतन पर्ची या स्व-घोषणा शपथ पत्र",
        "mr": "वेतन पावती किंवा स्वयंघोषणा शपथपत्र"
      },
      {
        "en": "Ration Card or Voter ID",
        "hi": "राशन कार्ड या वोटर आईडी",
        "mr": "रेशन कार्ड किंवा मतदार ओळखपत्र"
      },
      {
        "en": "Aadhaar Card",
        "hi": "आधार कार्ड",
        "mr": "आधार कार्ड"
      }
    ],
    "guidance": {
      "whoIsItFor": {
        "en": "Citizens and students applying for government reservations, fee waivers, and subsidies.",
        "hi": "सरकारी लाभ, आरक्षण, शुल्क छूट और योजनाओं हेतु आवेदन करने वाले नागरिक एवं छात्र।",
        "mr": "सरकारी लाभ, आरक्षण आणि शिष्यवृत्तीसाठी अर्ज करणारे नागरिक व विद्यार्थी."
      },
      "eligibilityCriteria": [
        {
          "en": "Resident of the respective state/taluka.",
          "hi": "संबंधित राज्य/तहसील का स्थायी निवासी होना चाहिए।",
          "mr": "संबंधित राज्य किंवा तालुक्याचा रहिवासी असावा."
        }
      ],
      "requiredDocuments": [
        {
          "en": "Income proof (Affidavit/Salary slip)",
          "hi": "आय प्रमाण (शपथ पत्र/सैलरी स्लिप)",
          "mr": "उत्पन्नाचा पुरावा (शपथपत्र/पगार पावती)"
        },
        {
          "en": "Residence proof & Aadhaar",
          "hi": "निवास प्रमाण एवं आधार",
          "mr": "रहिवासी दाखला व आधार"
        }
      ],
      "steps": [
        {
          "step": 1,
          "title": {
            "en": "Apply on State e-District Portal or Tehsildar Office",
            "hi": "राज्य ई-डिस्ट्रिक्ट पोर्टल या तहसील कार्यालय पर आवेदन",
            "mr": "आपले सरकार / ई-डिस्ट्रिक्ट पोर्टलवर अर्ज"
          },
          "details": {
            "en": "Submit online application through state portal or local CSC with supporting proofs.",
            "hi": "प्रमाणों के साथ राज्य ई-डिस्ट्रिक्ट पोर्टल या जनसेवा केंद्र के माध्यम से आवेदन करें।",
            "mr": "कागदपत्रांसह आपले सरकार पोर्टलवर किंवा महा-ई-सेवा केंद्रात अर्ज करा."
          }
        },
        {
          "step": 2,
          "title": {
            "en": "Lekhpal / Talathi Field Verification",
            "hi": "लेखपाल / पटवारी द्वारा क्षेत्रीय सत्यापन",
            "mr": "तलाठी / मंडळ अधिकारी चौकशी"
          },
          "details": {
            "en": "Revenue official assesses agricultural and household income sources.",
            "hi": "राजस्व अधिकारी भूमि व अन्य स्रोतों से प्राप्त पारिवारिक आय की जांच करता है।",
            "mr": "तलाठी शेती व इतर मार्गांनी होणाऱ्या वार्षिक उत्पन्नाची पडताळणी करतो."
          }
        },
        {
          "step": 3,
          "title": {
            "en": "Digitally Signed Certificate Download",
            "hi": "डिजिटल हस्ताक्षरित प्रमाण पत्र डाउनलोड",
            "mr": "डिजिटल स्वाक्षरीचा दाखला डाऊनलोड"
          },
          "details": {
            "en": "Tehsildar issues digitally signed QR-coded certificate valid for 1-3 years.",
            "hi": "तहसीलदार द्वारा जारी क्यूआर-युक्त डिजिटल प्रमाण पत्र ऑनलाइन डाउनलोड करें।",
            "mr": "तहसीलदारांकडून मंजूर झालेला डिजिटल स्वाक्षरी असलेला दाखला मिळवा."
          }
        }
      ],
      "faqs": [
        {
          "question": {
            "en": "What is the validity period of an Income Certificate?",
            "hi": "आय प्रमाण पत्र कितने समय तक वैध रहता है?",
            "mr": "उत्पन्न दाखल्याची वैधता किती असते?"
          },
          "answer": {
            "en": "Most states issue Income Certificates with validity for 1 financial year (or up to 3 years in states like Maharashtra).",
            "hi": "अधिकांश राज्यों में यह 1 वित्तीय वर्ष (महाराष्ट्र जैसे राज्यों में 3 वर्ष तक) वैध रहता है।",
            "mr": "बहुतेक राज्यांत १ वर्ष, तर महाराष्ट्रात १ किंवा ३ वर्षांसाठी वैध असतो."
          }
        }
      ],
      "disclaimer": {
        "en": "Direct application is not available in this prototype. Guidance provided reflects state revenue service standards.",
        "hi": "इस प्रोटोटाइप में सीधा ऑनलाइन आवेदन उपलब्ध नहीं है। यहाँ राजस्व सेवा मानकों का मार्गदर्शन दिया गया है।",
        "mr": "या प्रोटोटाइपमध्ये थेट अर्ज उपलब्ध नाही. येथे महसूल सेवा मानकांचे मार्गदर्शन दिले आहे."
      }
    },
    "officialSource": "State e-District / Revenue Portals (Official Reference Only)",
    "officialSourceMetadata": {
      "portalName": "National Portal of India Services",
      "url": "https://services.india.gov.in",
      "department": {
        "en": "Revenue & District Administration Departments",
        "hi": "राजस्व एवं जिला प्रशासन विभाग",
        "mr": "महसूल व जिल्हा प्रशासन विभाग"
      }
    },
    "isDemo": true,
    "demoStatus": "Guidance available in prototype"
  }
] as any;
