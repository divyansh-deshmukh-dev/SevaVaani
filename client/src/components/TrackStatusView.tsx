import { Search, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import type { LanguageCode } from '../types';

interface TrackStatusViewProps {
  language: LanguageCode;
  searchAppId: string;
  onSetSearchAppId: (val: string) => void;
  searchedStatus: any;
  isLoading: boolean;
  onCheckStatus: () => void;
  t: (key: string, fallback?: string) => string;
}

export function TrackStatusView({
  language,
  searchAppId,
  onSetSearchAppId,
  searchedStatus,
  isLoading,
  onCheckStatus,
  t
}: TrackStatusViewProps) {
  const milestones = [
    { step: 1, title: 'आवेदन पंजीकरण (Initiated)', desc: 'नागरिक द्वारा आवाज़ से विवरण दर्ज', completed: true },
    { step: 2, title: 'आवाज़ सत्यापन (Field Verified)', desc: '7 अनिवार्य प्रश्नों की पुष्टि संपन्न', completed: true },
    { step: 3, title: 'दस्तावेज़ मिलान (Document Check)', desc: 'आधार एवं भूमि अभिलेख स्थानीय मिलान', completed: true },
    { step: 4, title: 'विभागीय समीक्षा (Institutional Review)', desc: 'प्रोटोटाइप समीक्षक द्वारा जांच जारी', completed: true, current: true },
    { step: 5, title: 'स्वीकृति एवं अंतरण (Final Disbursal)', desc: 'अंतिम लाभ राशि हस्तांतरण', completed: false }
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
          <Search size={14} color="#f59e0b" />
          VERIFIED STATUS AUDIT • आवेदन स्थिति
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          {t('trackStatusTitle', 'आवेदन की स्थिति जाँचें')}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#d1fae5', lineHeight: 1.5 }}>
          {t('trackStatusSub', 'अपने आवेदन का वर्तमान चरण, समीक्षा विवरण और सत्यापन स्थिति देखें।')}
        </p>
      </div>

      {/* Search Box */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1.5px solid #cbd5e1',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px'
        }}
      >
        <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
          {t('enterAppId', 'आवेदन क्रमांक (Application ID)')}
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="उदा. DEMO-PMK-20261009-001..."
            value={searchAppId}
            onChange={(e) => onSetSearchAppId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onCheckStatus()}
            style={{
              flex: 1,
              minWidth: '260px',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '15px'
            }}
          />
          <button
            onClick={onCheckStatus}
            disabled={isLoading || !searchAppId.trim()}
            className="btn-gov-primary"
            style={{ padding: '12px 24px' }}
          >
            <Search size={16} />
            {isLoading ? 'जांच जारी...' : t('check', 'स्थिति जांचें')}
          </button>
        </div>

        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12.5px', color: '#64748b' }}>
          <span>परीक्षण हेतु डेमो क्रमांक:</span>
          <button
            onClick={() => {
              onSetSearchAppId('DEMO-PMK-20261009-001');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0d4436',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            DEMO-PMK-20261009-001
          </button>
        </div>
      </div>

      {/* Results & Milestone Progress */}
      {searchedStatus && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #86efac',
            padding: '28px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {/* Top Result Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '20px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <span className="badge-gov badge-gov-green" style={{ marginBottom: '8px' }}>
                {searchedStatus.status}
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0d4436' }}>
                {searchedStatus.serviceName}
              </h3>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                क्रमांक: <strong style={{ color: '#0f172a' }}>{searchedStatus.applicationId}</strong> • जमा दिनांक: {searchedStatus.submittedAt}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="badge-gov badge-gov-proto">डेमो रिकॉर्ड</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>सिम्युलेटेड पोर्टल डेटा</div>
            </div>
          </div>

          {/* 5-Step Visual Timeline */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#334155', marginBottom: '16px' }}>
              प्रगति समयरेखा (Application Milestones):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '8px' }}>
              {milestones.map((m, idx) => (
                <div key={m.step} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                  {/* Vertical line connecting nodes */}
                  {idx < milestones.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '15px',
                        top: '32px',
                        bottom: '-16px',
                        width: '2px',
                        backgroundColor: m.completed ? '#10b981' : '#e2e8f0'
                      }}
                    />
                  )}

                  {/* Icon Node */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: m.completed ? (m.current ? '#f59e0b' : '#10b981') : '#f1f5f9',
                      color: m.completed ? '#ffffff' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: '13px',
                      border: m.current ? '3px solid #fef3c7' : 'none'
                    }}
                  >
                    {m.completed ? (m.current ? <Clock size={16} /> : <CheckCircle size={16} />) : m.step}
                  </div>

                  {/* Text details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: m.completed ? '#0f172a' : '#64748b' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                      {m.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prototype Honesty Notice Box */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '12.5px',
              color: '#64748b',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ShieldCheck size={16} color="#0d4436" />
            <span>
              {language === 'en'
                ? 'Citizen Notice: This status is simulated from the SevaVaani research prototype database. No real applications are forwarded to live government servers.'
                : (language === 'mr'
                ? 'नागरिक सूचना: ही स्थिती सेवावाणी संशोधन प्रोटोटाइप डेटाबेसमधून दर्शवण्यात आली आहे. प्रत्यक्ष सरकारी पोर्टलवर अर्ज पाठवला जात नाही.'
                : 'नागरिक सूचना: यह स्थिति सेवावाणी शोध प्रोटोटाइप डेटाबेस द्वारा उत्पन्न की गई है। किसी वास्तविक सरकारी पोर्टल पर आवेदन अग्रसारित नहीं किया जाता।')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
