import { ShieldCheck, Cpu, Code2, CheckCircle2, Server, Globe2, Lock } from 'lucide-react';
import type { LanguageCode } from '../types';

interface AboutViewProps {
  language: LanguageCode;
  t: (key: string, fallback?: string) => string;
}

export function AboutView({ language: _language, t: _t }: AboutViewProps) {
  return (
    <div className="gov-container" style={{ padding: '24px 0', maxWidth: '880px' }}>
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
          SYSTEM ARCHITECTURE & ETHICS • प्रोजेक्ट परिचय
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          सेवावाणी (SevaVaani) आर्किटेक्चर एवं दर्शन
        </h2>
        <p style={{ fontSize: '14.5px', color: '#d1fae5', lineHeight: 1.5 }}>
          भारत के करोड़ों नागरिकों के लिए डिजिटल सार्वजनिक सेवाओं को अपनी मातृभाषा में सुलभ बनाने का एक पारदर्शी शोध एवं विकास प्रोटोटाइप।
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
          चार आधारभूत सिद्धांत (4 Core Architectural Tenets)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {/* Tenet 1 */}
          <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Cpu size={20} color="#1d4ed8" />
              <div style={{ fontWeight: 800, color: '#1e40af', fontSize: '15px' }}>
                1. AI = Understanding
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#1e3a8a', lineHeight: 1.5 }}>
              भाषा मॉडल केवल नागरिकों की बोली से इरादा (intent) और आवश्यक मान (entities) निकालते हैं। AI कभी भी व्यावसायिक वर्कफ़्लो या राज्य का नियंत्रण नहीं करता।
            </p>
          </div>

          {/* Tenet 2 */}
          <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Code2 size={20} color="#059669" />
              <div style={{ fontWeight: 800, color: '#065f46', fontSize: '15px' }}>
                2. Code = Control
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#047857', lineHeight: 1.5 }}>
              एक कठोर और पूर्वानुमेय 14-चरणीय स्टेट मशीन (Deterministic Finite State Machine) बातचीत की प्रगति, पुष्टि और त्रुटि निवारण का संचालन करती है।
            </p>
          </div>

          {/* Tenet 3 */}
          <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={20} color="#ea580c" />
              <div style={{ fontWeight: 800, color: '#9a3412', fontSize: '15px' }}>
                3. Rules = Validation
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#7c2d12', lineHeight: 1.5 }}>
              आधार एल्गोरिदम, मोबाइल फॉर्मेट और भूमि आकार की जांच नियम-आधारित वैलिडेटर्स द्वारा की जाती है, जिससे AI की भ्रम (Hallucination) की संभावना शून्य हो जाती है।
            </p>
          </div>

          {/* Tenet 4 */}
          <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#faf5ff', border: '1px solid #e9d5ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Server size={20} color="#9333ea" />
              <div style={{ fontWeight: 800, color: '#6b21a8', fontSize: '15px' }}>
                4. Adapter = Submission
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#581c87', lineHeight: 1.5 }}>
              डेमो एडेप्टर वास्तविक सरकारी API के स्थान पर सुरक्षित, अनुकरणीय प्रतिक्रिया (Simulated Application ID) उत्पन्न करते हैं, और कभी झूठा सरकारी दावा नहीं करते।
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
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0d4436', marginBottom: '16px' }}>
          इंजीनियरिंग प्रतिबद्धताएं (Engineering Guarantees)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px', color: '#334155' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Globe2 size={20} color="#0d4436" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>समान त्रिभाषी क्षमता (Linguistic Parity):</strong> हिंदी, मराठी और अंग्रेज़ी तीनों भाषाओं में संपूर्ण आवाज मार्गदर्शन, ऑडियो प्लेबैक और सत्यापन एकसमान गुणवत्ता के साथ उपलब्ध है।
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Lock size={20} color="#0d4436" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>सुरक्षित डेटा मास्किंग (Zero PII Leakage):</strong> आधार संख्या (XXXX-XXXX-1234) और फोन नंबर सिस्टम में केवल मास्क करके प्रस्तुत किए जाते हैं। कोई वास्तविक संवेदनशील डेटा संग्रहीत नहीं होता।
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <ShieldCheck size={20} color="#0d4436" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>पूर्ण पारदर्शी प्रोटोटाइप प्रकटीकरण (Radical Honesty):</strong> यह प्रणाली किसी भी प्रकार से वास्तविक सरकारी पोर्टल के रूप में प्रतिरूपित नहीं होती।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
