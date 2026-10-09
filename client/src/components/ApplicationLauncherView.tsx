import { Mic, ArrowRight, ShieldCheck, FileText, CheckCircle2, Info } from 'lucide-react';
import type { LanguageCode, ServiceDefinition } from '../types';

interface ApplicationLauncherViewProps {
  language: LanguageCode;
  services: ServiceDefinition[];
  onApplyService: (serviceId: string) => void;
  onViewGuidance: (service: ServiceDefinition) => void;
  onExploreAllServices: () => void;
  t: (key: string, fallback?: string) => string;
}

export function ApplicationLauncherView({
  language,
  services,
  onApplyService,
  onViewGuidance,
  onExploreAllServices,
  t
}: ApplicationLauncherViewProps) {
  // Only services configured for direct application in the prototype
  const directServices = services.filter(
    (s) => s.applicationMode === 'direct-demo' || s.directApplicationSupported === true
  );

  return (
    <div className="gov-container" style={{ padding: '28px 0 48px' }}>
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: '#0d4436',
          borderRadius: '16px',
          padding: '30px 32px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
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
              gap: '6px'
            }}
          >
            <ShieldCheck size={14} color="#f59e0b" />
            {t('launcherBadge', 'सीधा आवेदन उपलब्ध')}
          </span>
          <span className="badge-gov badge-gov-proto">
            {t('prototypeBadge', 'प्रोटोटाइप • डेमो')}
          </span>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
          {t('launcherTitle', 'ऑनलाइन आवेदन केंद्र (Application Launcher)')}
        </h2>
        <p style={{ fontSize: '15px', color: '#d1fae5', maxWidth: '720px', lineHeight: 1.5, marginBottom: '16px' }}>
          {t('launcherSubtitle', 'उपलब्ध सेवाओं के लिए सीधा आवाज़-सक्रिय डेमो आवेदन शुरू करें')}
        </p>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            color: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Info size={18} color="#fcd34d" style={{ flexShrink: 0 }} />
          <span>{t('launcherNotice', 'यह प्रोटोटाइप आपको सीधे आवाज़ और फॉर्म के माध्यम से आवेदन प्रक्रिया का अनुभव प्रदान करता है।')}</span>
        </div>
      </div>

      {/* Grid of Direct Application Services */}
      {directServices.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '40px 24px',
            textAlign: 'center',
            border: '1px solid #cbd5e1'
          }}
        >
          <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '16px' }}>
            {t('launcherEmpty', 'वर्तमान में कोई सेवा सीधे ऑनलाइन आवेदन के लिए उपलब्ध नहीं है।')}
          </p>
          <button onClick={onExploreAllServices} className="btn-gov-primary">
            {t('exploreServices', 'सेवाएं देखें')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {directServices.map((service) => {
            const serviceName = service.name[language] || service.name.hi;
            const serviceDesc = service.description[language] || service.description.hi;

            return (
              <div
                key={service.serviceId}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '2px solid #86efac',
                  boxShadow: 'var(--shadow-md)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  {/* Status header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="badge-gov badge-gov-green" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <CheckCircle2 size={13} />
                      {t('onlineDemoAvailable', 'ऑनलाइन डेमो आवेदन उपलब्ध')}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                      {t('estimatedTime', '2-3 मिनट')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0d4436', marginBottom: '8px', lineHeight: 1.3 }}>
                    {serviceName}
                  </h3>

                  {/* Description */}
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.55, marginBottom: '18px' }}>
                    {serviceDesc}
                  </p>

                  {/* Required Documents Checklist preview */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '20px'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FileText size={14} color="#0d4436" />
                      {t('requiredDocuments', 'आवश्यक दस्तावेज़')}:
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
                      {service.requiredDocuments?.map((d) => d[language] || d.hi).join(' • ')}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div>
                  <button
                    onClick={() => onApplyService(service.serviceId)}
                    className="btn-gov-primary"
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      fontSize: '15px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '10px'
                    }}
                  >
                    <Mic size={18} />
                    {t('startApplicationVoice', 'आवाज़ से आवेदन शुरू करें')}
                  </button>

                  <button
                    onClick={() => onViewGuidance(service)}
                    className="btn-gov-outline"
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={14} />
                    {t('howToApply', 'आवेदन मार्गदर्शन व पात्रता देखें')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful bottom callout */}
      <div
        style={{
          marginTop: '36px',
          backgroundColor: '#eff6ff',
          border: '1.5px solid #bfdbfe',
          borderRadius: '12px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1e40af', marginBottom: '4px' }}>
            {t('popularServicesTitle', 'अन्य सरकारी सेवाएं व मार्गदर्शन')}
          </h4>
          <p style={{ fontSize: '13.5px', color: '#3b82f6', margin: 0 }}>
            {t('guidanceSubtitle', 'आधार कार्ड, राशन कार्ड, पेंशन, छात्रवृत्ति आदि के लिए चरणबद्ध मार्गदर्शन देखें।')}
          </p>
        </div>
        <button
          onClick={onExploreAllServices}
          className="btn-gov-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          {t('viewAllServices', 'सभी सेवाएं देखें')}
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
