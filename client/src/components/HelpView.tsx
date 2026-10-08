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
      q: language === 'hi' ? 'सेवावाणी कैसे काम करती है?' : (language === 'mr' ? 'सेवावाणी कसे काम करते?' : 'How does SevaVaani work?'),
      a: language === 'hi'
        ? 'सेवावाणी भारत के नागरिकों के लिए एक आवाज़-आधारित बहुभाषी सार्वजनिक सेवा सहायक है। आप माइक दबाकर अपनी आवश्यकता (जैसे किसान सहायता, राशन कार्ड या पेंशन) बता सकते हैं। हमारा सहायक बातचीत के माध्यम से सही योजना खोजता है, पात्रता जांचता है और फॉर्म भरने में मदद करता है।'
        : 'सेवावाणी हे नागरिकांसाठी आवाज-आधारित बहुभाषिक जनसेवा सहाय्यक आहे. तुम्ही माइक दाबून शेतकरी मदत, रेशन कार्ड किंवा पेन्शनबाबत बोलू शकता. सहाय्यक संवाद साधून योग्य योजना शोधतो आणि अर्ज भरून घेतो.'
    },
    {
      q: language === 'hi' ? 'क्या यह आधिकारिक सरकारी वेबसाइट है?' : (language === 'mr' ? 'हे अधिकृत सरकारी संकेतस्थळ आहे का?' : 'Is this an official government website?'),
      a: language === 'hi'
        ? 'नहीं। सेवावाणी एक शोध और प्रौद्योगिकी प्रोटोटाइप (MVP Demo) है। यह किसी वास्तविक सरकारी पोर्टल पर आवेदन नहीं भेजता और न ही किसी सरकारी संस्था से सीधे संबद्ध है। यहाँ प्रदर्शित सभी पंजीकरण केवल इंटरफ़ेस परीक्षण हेतु हैं।'
        : 'नाही. सेवावाणी हे एक तंत्रज्ञान प्रोटोटाइप (MVP Demo) आहे. याद्वारे प्रत्यक्ष सरकारी पोर्टलवर अर्ज पाठवला जात नाही. हे केवळ प्रात्यक्षिक चाचणीसाठी आहे.'
    },
    {
      q: language === 'hi' ? 'यदि मेरी आवाज़ समझ में न आए तो क्या होगा?' : (language === 'mr' ? 'माझा आवाज समजला नाही तर काय होते?' : 'What happens if my voice is not recognized?'),
      a: language === 'hi'
        ? 'सेवावाणी में 3-स्तरीय फॉलबैक व्यवस्था है: 1) आवाज़ से दोबारा पूछना, 2) ऑन-स्क्रीन कीबोर्ड इनपुट या विकल्प प्रस्तुत करना, 3) बार-बार त्रुटि होने पर मानव ऑपरेटर सहायता प्रकरण (Level 3 Handoff) तैयार करना।'
        : 'सेवावाणीमध्ये ३-स्तरीय फॉलबॅक प्रणाली आहे: १) आवाजाने पुन्हा विचारणे, २) स्क्रीनवर कीबोर्ड इनपुट देणे, ३) वारंवार अडचण आल्यास मानवी ऑपरेटर मदत प्रकरण तयार करणे.'
    },
    {
      q: language === 'hi' ? 'मेरी व्यक्तिगत जानकारी (आधार / मोबाइल) कैसे सुरक्षित रहती है?' : (language === 'mr' ? 'माझी वैयक्तिक माहिती कशी सुरक्षित राहते?' : 'How is my Aadhaar and mobile data protected?'),
      a: language === 'hi'
        ? 'हम नागरिकों की गोपनीयता को सर्वोच्च प्राथमिकता देते हैं। आधार संख्या और मोबाइल नंबर सिस्टम में सुरक्षित रूप से मास्क (XXXX-XXXX-1100) करके ही प्रदर्शित व संचित किए जाते हैं।'
        : 'नागरिकांची गोपनीयता ही आमची प्राथमिकता आहे. आधार क्रमांक आणि मोबाइल नंबर सिस्टीममध्ये सुरक्षितपणे मास्क (XXXX-XXXX-1100) करूनच ठेवले जातात.'
    },
    {
      q: language === 'hi' ? 'मानव ऑपरेटर सहायता कैसे प्राप्त करें?' : (language === 'mr' ? 'मानवी ऑपरेटरची मदत कशी मिळवावी?' : 'How do I reach a human operator?'),
      a: language === 'hi'
        ? 'सहायक के साथ बातचीत के दौरान आप कभी भी "मदद चाहिए" बोल सकते हैं, या नीचे दिए गए "मानव ऑपरेटर से सहायता मांगें" बटन पर क्लिक करके सहायता प्रकरण दर्ज कर सकते हैं।'
        : 'संवादादरम्यान तुम्ही कधीही "मदत हवी आहे" बोलू शकता किंवा खालील बटणावर क्लिक करून ऑपरेटरकडे प्रकरण पाठवू शकता.'
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
