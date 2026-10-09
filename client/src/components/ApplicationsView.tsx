import { useState } from 'react';
import { Briefcase, Search, Mic, X, ShieldCheck } from 'lucide-react';
import type { LanguageCode, ApplicationRecord } from '../types';

interface ApplicationsViewProps {
  language: LanguageCode;
  applications: ApplicationRecord[];
  onTrackApp: (appId: string) => void;
  onResumeVoice: (serviceId: string) => void;
  onExploreServices: () => void;
  t: (key: string, fallback?: string) => string;
}

export function ApplicationsView({
  language: _language,
  applications,
  onTrackApp,
  onResumeVoice,
  onExploreServices,
  t
}: ApplicationsViewProps) {
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [searchId, setSearchId] = useState('');

  const getStatusBadge = (status: string) => {
    if (status.includes('SUBMITTED') || status.includes('APPROVED')) {
      return <span className="badge-gov badge-gov-green">✓ {status}</span>;
    }
    return <span className="badge-gov badge-gov-proto">⏳ {status}</span>;
  };

  return (
    <div className="gov-container" style={{ padding: '24px 0 48px' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#0d4436',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#ffffff',
          marginBottom: '24px',
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
          <Briefcase size={14} color="#f59e0b" />
          CITIZEN WORKFLOW AUDIT • नागरिक आवेदन
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          {t('myAppsTitle', 'मेरे आवेदन (My Applications)')}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#d1fae5', maxWidth: '720px', lineHeight: 1.5 }}>
          {t('myAppsSub', 'आपके द्वारा शुरू किए गए या जमा किए गए डिजिटल सेवा आवेदनों की सूची।')}
        </p>
      </div>

      {/* Application Status Search Box */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1.5px solid #cbd5e1',
          padding: '16px 20px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '13px' }} />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchId.trim() && onTrackApp(searchId.trim())}
            placeholder={t('enterAppIdTrack', 'आवेदन क्रमांक दर्ज करें (उदा. DEMO-PMK-20261009-001)...')}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
        <button
          onClick={() => searchId.trim() && onTrackApp(searchId.trim())}
          className="btn-gov-primary"
          style={{ padding: '10px 20px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Search size={15} />
          {t('trackBtn', 'स्थिति जांचें')}
        </button>
      </div>


      {applications.length === 0 ? (
        /* Empty State */
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px solid #cbd5e1'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#0d4436',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <Briefcase size={32} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            {t('emptyAppsTitle', 'अभी कोई आवेदन नहीं है')}
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '440px', margin: '0 auto 24px' }}>
            {t('emptyAppsDesc', 'किसी सेवा के लिए आवाज़ से आवेदन शुरू करें या उपलब्ध सरकारी योजनाएं देखें।')}
          </p>
          <button onClick={onExploreServices} className="btn-gov-primary">
            {t('exploreServices', 'सेवाएं देखें')}
          </button>
        </div>
      ) : (
        /* Applications List Cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {applications.map((app) => (
            <div
              key={app.applicationId}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1.5px solid #cbd5e1',
                padding: '20px 24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div style={{ minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0d4436' }}>
                    {app.serviceName}
                  </h3>
                  {getStatusBadge(app.status)}
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', flexWrap: 'wrap' }}>
                  <div>
                    {t('appIdLabel', 'आवेदन क्रमांक')}: <strong style={{ color: '#0f172a' }}>{app.applicationId}</strong>
                  </div>
                  <div>
                    {t('dateLabel', 'दिनांक')}: <strong>{app.date}</strong>
                  </div>
                  <div>
                    चरण: <strong>{app.step} of {app.totalSteps}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedApp(app)}
                  className="btn-gov-ghost"
                >
                  विवरण देखें
                </button>
                <button
                  onClick={() => onTrackApp(app.applicationId)}
                  className="btn-gov-primary"
                >
                  <Search size={15} />
                  {t('trackStatus', 'स्थिति ट्रैक करें')}
                </button>
                {app.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => onResumeVoice(app.serviceId)}
                    className="btn-gov-saffron"
                  >
                    <Mic size={15} />
                    {t('continueWithVoice', 'आवाज़ से जारी रखें')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                backgroundColor: '#0d4436',
                color: '#ffffff',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#a7f3d0" />
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>आवेदन विवरण (Application Details)</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>आवेदन क्रमांक</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0d4436' }}>{selectedApp.applicationId}</div>
                </div>
                <div>{getStatusBadge(selectedApp.status)}</div>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                सत्यापित प्रविष्टियां (Verified Entries):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto', marginBottom: '20px' }}>
                {Object.entries(selectedApp.formData || {}).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      fontSize: '13px'
                    }}
                  >
                    <span style={{ color: '#64748b', textTransform: 'capitalize' }}>{key.replace('_', ' ')}:</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{String(val)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    const id = selectedApp.applicationId;
                    setSelectedApp(null);
                    onTrackApp(id);
                  }}
                  className="btn-gov-primary"
                  style={{ flex: 1 }}
                >
                  <Search size={15} />
                  पूर्ण स्थिति ट्रैक करें
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="btn-gov-outline"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
