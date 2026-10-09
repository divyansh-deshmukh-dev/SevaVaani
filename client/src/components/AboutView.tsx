import { ShieldCheck, Cpu, Code2, CheckCircle2, Server, Globe2, Lock, Wifi } from 'lucide-react';
import type { LanguageCode } from '../types';

interface AboutViewProps {
  language: LanguageCode;
  t: (key: string, fallback?: string) => string;
}

export function AboutView({ language, t: _t }: AboutViewProps) {
  const content = {
    badge: {
      en: 'SYSTEM ARCHITECTURE & PHILOSOPHY • Project Overview',
      hi: 'सिस्टम आर्किटेक्चर एवं दर्शन • प्रोजेक्ट परिचय',
      mr: 'प्रणाली संरचना आणि तत्त्वज्ञान • प्रकल्प परिचय'
    },
    title: {
      en: 'SevaVaani Architecture & Philosophy',
      hi: 'सेवावाणी आर्किटेक्चर एवं दर्शन',
      mr: 'सेवावाणी आर्किटेक्चर आणि तत्त्वज्ञान'
    },
    subtitle: {
      en: 'A transparent research and development prototype designed to make digital public services accessible to Indian citizens in their mother tongue through voice.',
      hi: 'भारत के करोड़ों नागरिकों के लिए डिजिटल सार्वजनिक सेवाओं को अपनी मातृभाषा में सुलभ बनाने का एक पारदर्शी शोध एवं विकास प्रोटोटाइप।',
      mr: 'भारतातील करोडो नागरिकांसाठी डिजिटल सार्वजनिक सेवा त्यांच्या मातृभाषेत आवाजाद्वारे सुलभ बनवणारा पारदर्शक संशोधन आणि विकास प्रोटोटाइप.'
    },
    tenetsTitle: {
      en: '4 Core Architectural Tenets',
      hi: 'चार आधारभूत सिद्धांत (4 Core Architectural Tenets)',
      mr: 'चार मूलभूत तत्त्वे (4 Core Architectural Tenets)'
    },
    tenet1: {
      title: '1. AI = Understanding',
      desc: {
        en: 'Language models only extract intent and structured entities from citizen speech. AI never controls business workflows, state transitions, or submission logic.',
        hi: 'भाषा मॉडल केवल नागरिकों की बोली से इरादा (intent) और आवश्यक मान (entities) निकालते हैं। AI कभी भी व्यावसायिक वर्कफ़्लो या राज्य का नियंत्रण नहीं करता।',
        mr: 'भाषा मॉडेल्स केवळ नागरिकांच्या बोलण्यातून हेतू (intent) आणि आवश्यक नोंदी (entities) काढतात. AI कधीही व्यावसायिक कार्यप्रवाह किंवा स्टेट ट्रान्झिशन नियंत्रित करत नाही.'
      }
    },
    tenet2: {
      title: '2. Code = Control',
      desc: {
        en: 'A deterministic 14-state finite state machine governs conversation progression, step-by-step confirmation, error handling, and state recovery.',
        hi: 'एक कठोर और पूर्वानुमेय 14-चरणीय स्टेट मशीन (Deterministic Finite State Machine) बातचीत की प्रगति, पुष्टि और त्रुटि निवारण का संचालन करती है।',
        mr: 'एक काटेकोर आणि पूर्वानुमेय १४-टप्प्यांची स्टेट मशीन (Deterministic Finite State Machine) संवादाची प्रगती, पडताळणी आणि त्रुटी निवारण चालवते.'
      }
    },
    tenet3: {
      title: '3. Rules = Validation',
      desc: {
        en: 'Aadhaar Verhoeff checksums, phone number formats, and land sizes are validated strictly by deterministic algorithms, eliminating AI hallucinations.',
        hi: 'आधार एल्गोरिदम, मोबाइल फॉर्मेट और भूमि आकार की जांच नियम-आधारित वैलिडेटर्स द्वारा की जाती है, जिससे AI की भ्रम (Hallucination) की संभावना शून्य हो जाती है।',
        mr: 'आधार अल्गोरिदम, मोबाइल फॉरमॅट आणि जमिनीचे मोजमाप नियम-आधारित व्हॅलिडेटर्सद्वारे तपासले जातात, ज्यामुळे AI च्या चुकीच्या अंदाजांना (Hallucination) जागा राहत नाही.'
      }
    },
    tenet4: {
      title: '4. Adapter = Submission',
      desc: {
        en: 'Demo adapters generate realistic, traceable simulated application IDs (e.g., DEMO-PMK-...) and never claim false live government submissions.',
        hi: 'डेमो एडेप्टर वास्तविक सरकारी API के स्थान पर सुरक्षित, अनुकरणीय प्रतिक्रिया (Simulated Application ID) उत्पन्न करते हैं, और कभी झूठा सरकारी दावा नहीं करते।',
        mr: 'डेमो अ‍ॅडॉप्टर्स प्रत्यक्ष सरकारी API ऐवजी सुरक्षित आणि पडताळणीयोग्य डेमो अर्ज क्रमांक (उदा. DEMO-PMK-...) तयार करतात आणि खोटा सरकारी दावा कधीही करत नाहीत.'
      }
    },
    guaranteesTitle: {
      en: 'Engineering Commitments & Guarantees',
      hi: 'इंजीनियरिंग प्रतिबद्धताएं (Engineering Guarantees)',
      mr: 'अभियांत्रिकी हमी आणि बांधिलकी (Engineering Guarantees)'
    },
    g1Title: {
      en: 'Linguistic Parity across 3 Languages:',
      hi: 'समान त्रिभाषी क्षमता (Linguistic Parity):',
      mr: 'समान त्रिभाषिक गुणवत्ता (Linguistic Parity):'
    },
    g1Desc: {
      en: 'Full voice guidance, speech synthesis playback, and confirmation flows are equally supported across Hindi, Marathi, and English with identical capability.',
      hi: 'हिंदी, मराठी और अंग्रेज़ी तीनों भाषाओं में संपूर्ण आवाज मार्गदर्शन, ऑडियो प्लेबैक और सत्यापन एकसमान गुणवत्ता के साथ उपलब्ध है।',
      mr: 'हिंदी, मराठी आणि इंग्रजी या तिन्ही भाषांमध्ये संपूर्ण आवाज मार्गदर्शन, ऑडिओ प्लेबॅक आणि पडताळणी समान क्षमतेसह उपलब्ध आहे.'
    },
    g2Title: {
      en: 'Secure Data Masking (Zero PII Leakage):',
      hi: 'सुरक्षित डेटा मास्किंग (Zero PII Leakage):',
      mr: 'सुरक्षित डेटा मास्किंग (Zero PII Leakage):'
    },
    g2Desc: {
      en: 'Aadhaar numbers (XXXX-XXXX-1100) and phone numbers are strictly masked on screen and in memory. No raw biometric or real citizen credentials are stored.',
      hi: 'आधार संख्या (XXXX-XXXX-1100) और फोन नंबर सिस्टम में केवल मास्क करके प्रस्तुत किए जाते हैं। कोई वास्तविक संवेदनशील डेटा संग्रहीत नहीं होता।',
      mr: 'आधार क्रमांक (XXXX-XXXX-1100) आणि फोन नंबर प्रणालीमध्ये सुरक्षितपणे मास्क करूनच ठेवले जातात. कोणताही संवेदनशील प्रत्यक्ष डेटा साठवला जात नाही.'
    },
    g3Title: {
      en: 'Radical Honesty & Prototype Disclosure:',
      hi: 'पूर्ण पारदर्शी प्रोटोटाइप प्रकटीकरण (Radical Honesty):',
      mr: 'पूर्ण पारदर्शक प्रोटोटाइप प्रकटीकरण (Radical Honesty):'
    },
    g3Desc: {
      en: 'This system never impersonates an official government authority or portal. It clearly marks all operations as experimental prototype simulations.',
      hi: 'यह प्रणाली किसी भी प्रकार से वास्तविक सरकारी पोर्टल के रूप में प्रतिरूपित नहीं होती और प्रत्येक कार्यवाही को स्पष्ट प्रोटोटाइप डेमो के रूप में दर्शाती है।',
      mr: 'ही प्रणाली कोणत्याही प्रकारे प्रत्यक्ष सरकारी पोर्टल असल्याचे भासवत नाही आणि प्रत्येक कृती स्पष्टपणे प्रोटोटाइप डेमो म्हणून दर्शवते.'
    },
    g4Title: {
      en: 'High Resilience & Low-Bandwidth Optimization:',
      hi: 'नेटवर्क लचीलापन एवं कम बैंडविड्थ अनुकूलन:',
      mr: 'नेटवर्क लवचिकता आणि कमी बँडविड्थ अनुकूलन:'
    },
    g4Desc: {
      en: 'Designed with lightweight payloads and offline-ready fallback catalogs to ensure seamless accessibility even under weak rural connectivity.',
      hi: 'ग्रामीण नेटवर्क को ध्यान में रखते हुए हल्के पेलोड और ऑफलाइन-सक्षम कैटलॉग के साथ निर्मित ताकि कमजोर इंटरनेट में भी सुलभता बनी रहे।',
      mr: 'मर्यादित इंटरनेट असलेल्या ग्रामीण भागासाठी हलके पेलोड आणि ऑफलाइन कॅटलॉगसह सुसज्ज.'
    }
  };

  const cur = (obj: { en: string; hi: string; mr: string }) => obj[language] || obj.hi;

  return (
    <div className="gov-container" style={{ padding: '24px 0 48px', maxWidth: '900px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#0d4436',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <span
          style={{
            backgroundColor: '#165b49',
            color: '#a7f3d0',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px'
          }}
        >
          <Cpu size={14} color="#f59e0b" />
          {cur(content.badge)}
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', lineHeight: 1.25 }}>
          {cur(content.title)}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#d1fae5', lineHeight: 1.6 }}>
          {cur(content.subtitle)}
        </p>
      </div>

      {/* 4 Core Architectural Tenets */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #cbd5e1',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px'
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0d4436', marginBottom: '18px' }}>
          {cur(content.tenetsTitle)}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {/* Tenet 1 */}
          <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Cpu size={20} color="#1d4ed8" />
              <div style={{ fontWeight: 800, color: '#1e40af', fontSize: '15px' }}>
                {content.tenet1.title}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#1e3a8a', lineHeight: 1.55 }}>
              {cur(content.tenet1.desc)}
            </p>
          </div>

          {/* Tenet 2 */}
          <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Code2 size={20} color="#059669" />
              <div style={{ fontWeight: 800, color: '#065f46', fontSize: '15px' }}>
                {content.tenet2.title}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#047857', lineHeight: 1.55 }}>
              {cur(content.tenet2.desc)}
            </p>
          </div>

          {/* Tenet 3 */}
          <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={20} color="#ea580c" />
              <div style={{ fontWeight: 800, color: '#9a3412', fontSize: '15px' }}>
                {content.tenet3.title}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#7c2d12', lineHeight: 1.55 }}>
              {cur(content.tenet3.desc)}
            </p>
          </div>

          {/* Tenet 4 */}
          <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#faf5ff', border: '1px solid #e9d5ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Server size={20} color="#9333ea" />
              <div style={{ fontWeight: 800, color: '#6b21a8', fontSize: '15px' }}>
                {content.tenet4.title}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#581c87', lineHeight: 1.55 }}>
              {cur(content.tenet4.desc)}
            </p>
          </div>
        </div>
      </div>

      {/* Radical Honesty & Engineering Guarantees */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #cbd5e1',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0d4436', marginBottom: '18px' }}>
          {cur(content.guaranteesTitle)}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13.5px', color: '#334155' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Globe2 size={20} color="#0d4436" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>{cur(content.g1Title)} </strong>
              <span>{cur(content.g1Desc)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Lock size={20} color="#0d4436" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>{cur(content.g2Title)} </strong>
              <span>{cur(content.g2Desc)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <ShieldCheck size={20} color="#0d4436" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>{cur(content.g3Title)} </strong>
              <span>{cur(content.g3Desc)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Wifi size={20} color="#0d4436" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>{cur(content.g4Title)} </strong>
              <span>{cur(content.g4Desc)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
