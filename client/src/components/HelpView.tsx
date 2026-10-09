import { useState } from 'react';
import { ChevronDown, ChevronUp, PhoneCall, Headphones } from 'lucide-react';
import type { LanguageCode } from '../types';

interface HelpViewProps {
  language: LanguageCode;
  onEscalateToOperator: () => void;
  t: (key: string, fallback?: string) => string;
}

export function HelpView({ language, onEscalateToOperator, t }: HelpViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: language === 'en' ? 'How does SevaVaani work?' : (language === 'mr' ? 'सेवावाणी कसे काम करते?' : 'सेवावाणी कैसे काम करती है?'),
      a: language === 'en'
        ? 'SevaVaani is a multilingual voice-guided public service assistant for Indian citizens. You can tap the microphone and speak your requirement (such as PM-Kisan, Ration Card, or Pension). The assistant discovers eligible schemes, verifies qualifications, and guides you through the application.'
        : (language === 'mr'
        ? 'सेवावाणी हे नागरिकांसाठी आवाज-आधारित बहुभाषिक जनसेवा सहाय्यक आहे. तुम्ही माइक दाबून शेतकरी मदत, रेशन कार्ड किंवा पेन्शनबाबत बोलू शकता. सहाय्यक संवाद साधून योग्य योजना शोधतो आणि अर्ज भरून घेतो.'
        : 'सेवावाणी भारत के नागरिकों के लिए एक आवाज़-आधारित बहुभाषी सार्वजनिक सेवा सहायक है। आप माइक दबाकर अपनी आवश्यकता (जैसे किसान सहायता, राशन कार्ड या पेंशन) बता सकते हैं। हमारा सहायक बातचीत के माध्यम से सही योजना खोजता है, पात्रता जांचता है और फॉर्म भरने में मदद करता है।')
    },
    {
      q: language === 'en' ? 'Is this an official government website?' : (language === 'mr' ? 'हे अधिकृत सरकारी संकेतस्थळ आहे का?' : 'क्या यह आधिकारिक सरकारी वेबसाइट है?'),
      a: language === 'en'
        ? 'No. SevaVaani is a technology research and development prototype (MVP Demo). It does not submit real applications to live government servers. All registrations displayed here are for interface demonstration purposes only.'
        : (language === 'mr'
        ? 'नाही. सेवावाणी हे एक तंत्रज्ञान प्रोटोटाइप (MVP Demo) आहे. याद्वारे प्रत्यक्ष सरकारी पोर्टलवर अर्ज पाठवला जात नाही. हे केवळ प्रात्यक्षिक चाचणीसाठी आहे.'
        : 'नहीं। सेवावाणी एक शोध और प्रौद्योगिकी प्रोटोटाइप (MVP Demo) है। यह किसी वास्तविक सरकारी पोर्टल पर आवेदन नहीं भेजता और न ही किसी सरकारी संस्था से सीधे संबद्ध है। यहाँ प्रदर्शित सभी पंजीकरण केवल इंटरफ़ेस परीक्षण हेतु हैं।')
    },
    {
      q: language === 'en' ? 'What happens if my voice is not recognized?' : (language === 'mr' ? 'माझा आवाज समजला नाही तर काय होते?' : 'यदि मेरी आवाज़ समझ में न आए तो क्या होगा?'),
      a: language === 'en'
        ? 'SevaVaani provides a 3-tier fallback ladder: 1) Re-prompting with verbal clarification, 2) On-screen manual keyboard/select input, and 3) Escalation to a human operator assistance desk upon repeated recognition issues.'
        : (language === 'mr'
        ? 'सेवावाणीमध्ये ३-स्तरीय फॉलबॅक प्रणाली आहे: १) आवाजाने पुन्हा विचारणे, २) स्क्रीनवर कीबोर्ड इनपुट देणे, ३) वारंवार अडचण आल्यास मानवी ऑपरेटर मदत प्रकरण तयार करणे.'
        : 'सेवावाणी में 3-स्तरीय फॉलबैक व्यवस्था है: 1) आवाज़ से दोबारा पूछना, 2) ऑन-स्क्रीन कीबोर्ड इनपुट या विकल्प प्रस्तुत करना, 3) बार-बार त्रुटि होने पर मानव ऑपरेटर सहायता प्रकरण (Level 3 Handoff) तैयार करना।')
    },
    {
      q: language === 'en' ? 'How is my Aadhaar and mobile data protected?' : (language === 'mr' ? 'माझी वैयक्तिक माहिती कशी सुरक्षित राहते?' : 'मेरी व्यक्तिगत जानकारी (आधार / मोबाइल) कैसे सुरक्षित रहती है?'),
      a: language === 'en'
        ? 'We prioritize citizen privacy. Aadhaar numbers and mobile numbers are always masked (XXXX-XXXX-1100) before being displayed or processed in the system.'
        : (language === 'mr'
        ? 'नागरिकांची गोपनीयता ही आमची प्राथमिकता आहे. आधार क्रमांक आणि मोबाइल नंबर सिस्टीममध्ये सुरक्षितपणे मास्क (XXXX-XXXX-1100) करूनच ठेवले जातात.'
        : 'हम नागरिकों की गोपनीयता को सर्वोच्च प्राथमिकता देते हैं। आधार संख्या और मोबाइल नंबर सिस्टम में सुरक्षित रूप से मास्क (XXXX-XXXX-1100) करके ही प्रदर्शित व संचित किए जाते हैं।')
    },
    {
      q: language === 'en' ? 'How do I reach a human operator?' : (language === 'mr' ? 'मानवी ऑपरेटरची मदत कशी मिळवावी?' : 'मानव ऑपरेटर सहायता कैसे प्राप्त करें?'),
      a: language === 'en'
        ? 'You can say "Need help" at any time during the conversation, or tap the "Request Operator Support" button below to initiate an escalation.'
        : (language === 'mr'
        ? 'संवादादरम्यान तुम्ही कधीही "मदत हवी आहे" बोलू शकता किंवा खालील बटणावर क्लिक करून ऑपरेटरकडे प्रकरण पाठवू शकता.'
        : 'सहायक के साथ बातचीत के दौरान आप कभी भी "मदद चाहिए" बोल सकते हैं, या नीचे दिए गए "मानव ऑपरेटर से सहायता मांगें" बटन पर क्लिक करके सहायता प्रकरण दर्ज कर सकते हैं।')
    }
  ];

  return (
    <div className="gov-container" style={{ padding: '24px 0', maxWidth: '840px' }}>
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
          <Headphones size={14} color="#f59e0b" />
          CITIZEN HELPDESK & ESCALATION • सहायता एवं समर्थन
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          {t('helpTitle', 'नागरिक सहायता एवं संपर्क')}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#d1fae5', lineHeight: 1.5 }}>
          {t('helpSub', 'सेवावाणी के उपयोग में कोई समस्या आ रही है? समाधान खोजें या ऑपरेटर से सहायता मांगें।')}
        </p>
      </div>

      {/* Operator Escalation Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #fed7aa',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(to right, #fff7ed, #ffffff)'
        }}
      >
        <div>
          <span className="badge-gov badge-gov-saffron" style={{ marginBottom: '6px' }}>
            Level 3 Escalation
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#9a3412' }}>
            मानव ऑपरेटर से सहायता की आवश्यकता है?
          </h3>
          <p style={{ fontSize: '13.5px', color: '#475569', marginTop: '4px' }}>
            यदि आवाज़ या फॉर्म भरने में कोई अड़चन आ रही है, तो तुरंत ऑपरेटर टिकट दर्ज करें।
          </p>
        </div>
        <button
          onClick={onEscalateToOperator}
          className="btn-gov-saffron"
          style={{ padding: '12px 24px' }}
        >
          <PhoneCall size={16} />
          {t('requestAssistance', 'मानव ऑपरेटर से सहायता मांगें')}
        </button>
      </div>

      {/* FAQs Section */}
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
          {t('faqTitle', 'अक्सर पूछे जाने वाले सवाल (FAQs)')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="#0d4436" /> : <ChevronDown size={18} color="#64748b" />}
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: '14px 18px',
                      fontSize: '14px',
                      color: '#334155',
                      lineHeight: 1.6,
                      backgroundColor: '#ffffff',
                      borderTop: '1px solid #f1f5f9'
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
