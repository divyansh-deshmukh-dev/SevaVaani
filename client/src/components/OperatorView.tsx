import { useState } from 'react';
import { PhoneCall, UserCheck } from 'lucide-react';
import type { LanguageCode } from '../types';

interface OperatorViewProps {
  language: LanguageCode;
  handoffRecord: any;
  onResolveTicket?: (id: string) => void;
  t: (key: string, fallback?: string) => string;
}

export function OperatorView({ language: _language, handoffRecord, t }: OperatorViewProps) {
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  // Default sample ticket + any active session handoff
  const tickets = [
    ...(handoffRecord
      ? [
          {
            id: handoffRecord.handoffId || 'HO-SESSION-CURR',
            sessionId: handoffRecord.sessionId || 'curr-session',
            language: (handoffRecord.language || 'hi').toUpperCase(),
            reason: handoffRecord.reason || 'नागरिक द्वारा ऑपरेटर सहायता का अनुरोध',
            failingField: handoffRecord.failingField || 'N/A',
            status: 'QUEUED_FOR_ASSISTANCE',
            time: 'Just now',
            snapshot: handoffRecord.formDataSnapshot || {}
          }
        ]
      : []),
    {
      id: 'HO-8B41E20A',
      sessionId: 'sess_998124',
      language: 'HI',
      reason: 'बार-बार अस्पष्ट आवाज़ (3 consecutive low-confidence turns)',
      failingField: 'aadhaar_number',
      status: 'QUEUED_FOR_ASSISTANCE',
      time: '12 mins ago',
      snapshot: { full_name: 'सुरेश कुमार', mobile_number: '9876543210', state_name: 'उत्तर प्रदेश' }
    },
    {
      id: 'HO-5A92F11C',
      sessionId: 'sess_998089',
      language: 'MR',
      reason: 'नागरिकाने मानवी ऑपरेटर मदत मागितली',
      failingField: 'land_holding_hectares',
      status: 'QUEUED_FOR_ASSISTANCE',
      time: '34 mins ago',
      snapshot: { full_name: 'ज्ञानेश्वर कदम', mobile_number: '9822114455', state_name: 'महाराष्ट्र' }
    }
  ];

  const handleResolve = (id: string) => {
    setResolvedIds([...resolvedIds, id]);
  };

  return (
    <div className="gov-container" style={{ padding: '24px 0' }}>
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
          <PhoneCall size={14} color="#f59e0b" />
          OPERATOR ESCALATION CONSOLE • ऑपरेटर पोर्टल
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          {t('navOperator', 'लोक सेवा ऑपरेटर सहायता पोर्टल')}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#d1fae5', maxWidth: '720px', lineHeight: 1.5 }}>
          जब नागरिक सहायता मांगते हैं या लगातार सत्यापन में कठिनाई आती है, तब Level 3 ऑपरेटर टिकट यहाँ प्रदर्शित होते हैं।
        </p>
      </div>

      {/* Tickets Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tickets.map((tk) => {
          const isResolved = resolvedIds.includes(tk.id);
          return (
            <div
              key={tk.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: isResolved ? '1px solid #cbd5e1' : '1.5px solid #fca5a5',
                padding: '22px',
                boxShadow: 'var(--shadow-sm)',
                opacity: isResolved ? 0.75 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0d4436' }}>
                    {tk.id}
                  </span>
                  <span className={`badge-gov ${isResolved ? 'badge-gov-green' : 'badge-gov-saffron'}`}>
                    {isResolved ? '✓ RESOLVED' : tk.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  प्रस्तुति समय: {tk.time}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px', marginBottom: '16px' }}>
                <div>
                  <span style={{ color: '#64748b' }}>नागरिक भाषा:</span>{' '}
                  <strong style={{ color: '#0f172a' }}>{tk.language}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>कारण (Reason):</span>{' '}
                  <strong style={{ color: '#b91c1c' }}>{tk.reason}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>संबंधित फ़ील्ड:</span>{' '}
                  <strong style={{ color: '#0f172a' }}>{tk.failingField}</strong>
                </div>
              </div>

              {/* Masked Form Snapshot */}
              <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  सुरक्षित एवं मास्क किया गया डेटा स्नैपशॉट:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
                  {Object.entries(tk.snapshot).map(([k, v]) => (
                    <div key={k} style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                      <span style={{ color: '#64748b' }}>{k}:</span> <strong>{String(v)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                {!isResolved && (
                  <button
                    onClick={() => handleResolve(tk.id)}
                    className="btn-gov-primary"
                    style={{ fontSize: '13px', padding: '8px 18px' }}
                  >
                    <UserCheck size={15} />
                    समाधान चिह्नित करें (Mark Resolved)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
