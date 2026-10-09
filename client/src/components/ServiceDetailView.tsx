import {
  FileText,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Phone,
  Calendar,
  Building2,
  HelpCircle,
  Mic,
  ListOrdered
} from 'lucide-react';
import type { LanguageCode, ServiceDefinition } from '../types';

interface ServiceDetailViewProps {
  service: ServiceDefinition;
  language: LanguageCode;
  onBack: () => void;
  onApplyService: (serviceId: string) => void;
  t: (key: string, fallback?: string) => string;
}

export function ServiceDetailView({
  service,
  language,
  onBack,
  onApplyService,
  t
}: ServiceDetailViewProps) {
  const isDirect = service.applicationMode === 'direct-demo' || service.directApplicationSupported === true;
  const guidance = service.guidance || {};
  const meta = service.officialSourceMetadata || {};

  const name = service.name[language] || service.name.hi;
  const desc = service.description[language] || service.description.hi;
  const whoIsItFor = guidance.whoIsItFor ? (guidance.whoIsItFor[language] || guidance.whoIsItFor.hi) : null;
  const disclaimer = guidance.disclaimer ? (guidance.disclaimer[language] || guidance.disclaimer.hi) : null;

  return (
    <div className="gov-container" style={{ padding: '24px 0 48px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '18px' }}>
        <button
          onClick={onBack}
          className="btn-gov-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
        >
          <ArrowLeft size={16} />
          {t('backToCatalog', '← सेवा सूची पर वापस जाएं')}
        </button>
      </div>

      {/* Hero Header Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #cbd5e1',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`badge-gov ${isDirect ? 'badge-gov-green' : 'badge-gov-blue'}`}>
              {isDirect ? `✓ ${t('onlineDemoAvailable', 'ऑनलाइन डेमो उपलब्ध')}` : t('guidanceAvailable', 'मार्गदर्शन उपलब्ध')}
            </span>
            <span className="badge-gov badge-gov-proto">
              {t('prototypeBadge', 'प्रोटोटाइप')}
            </span>
            {service.category && (
              <span
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11.5px',
                  fontWeight: 600
                }}
              >
                {service.category.toUpperCase()}
              </span>
            )}
          </div>

          {isDirect && (
            <button
              onClick={() => onApplyService(service.serviceId)}
              className="btn-gov-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px' }}
            >
              <Mic size={16} />
              {t('applyNow', 'आवेदन करें (आवाज़ से)')}
            </button>
          )}
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0d4436', marginBottom: '10px', lineHeight: 1.3 }}>
          {name}
        </h1>

        <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, maxWidth: '820px', marginBottom: '18px' }}>
          {desc}
        </p>

        {/* Prototype Demo Status Banner */}
        <div
          style={{
            backgroundColor: isDirect ? '#ecfdf5' : '#fffbeb',
            border: isDirect ? '1.5px solid #a7f3d0' : '1.5px solid #fde68a',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          {isDirect ? (
            <ShieldCheck size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <AlertCircle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          )}
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: isDirect ? '#065f46' : '#92400e', marginBottom: '3px' }}>
              {t('demoStatusNotice', 'प्रोटोटाइप डेमो स्थिति')}
            </div>
            <div style={{ fontSize: '13px', color: isDirect ? '#047857' : '#78350f', lineHeight: 1.5 }}>
              {isDirect
                ? t('directDemoNotice', 'इस सेवा का ऑनलाइन डेमो आवेदन इस प्रोटोटाइप में उपलब्ध है। आप अभी आवाज़ या फॉर्म के माध्यम से आवेदन कर सकते हैं।')
                : (disclaimer || t('guidanceOnlyDisclaimer', 'इस प्रोटोटाइप में इस सेवा का सीधा आवेदन उपलब्ध नहीं है। कृपया नीचे दिए गए चरणों का पालन करें और आधिकारिक पोर्टल के माध्यम से आवेदन करें।'))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Two-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1.1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Guidance Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Who Is It For */}
          {whoIsItFor && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0d4436', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} color="#0d4436" />
                {t('whoIsItFor', 'यह सेवा किसके लिए है?')}
              </h3>
              <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.6 }}>
                {whoIsItFor}
              </p>
            </div>
          )}

          {/* Eligibility Criteria */}
          {guidance.eligibilityCriteria && guidance.eligibilityCriteria.length > 0 && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0d4436', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} color="#059669" />
                {t('eligibilityCriteria', 'पात्रता की शर्तें')}
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {guidance.eligibilityCriteria.map((crit, idx) => (
                  <li key={idx} style={{ fontSize: '14px', color: '#334155', lineHeight: 1.55 }}>
                    {crit[language] || crit.hi}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Step-by-Step Guidance */}
          {guidance.steps && guidance.steps.length > 0 && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0d4436', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ListOrdered size={18} color="#0d4436" />
                {t('stepByStepProcess', 'चरणबद्ध आवेदन प्रक्रिया')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {guidance.steps.map((st) => (
                  <div
                    key={st.stepNumber}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'flex-start',
                      backgroundColor: '#f8fafc',
                      padding: '16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#0d4436',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                        flexShrink: 0
                      }}
                    >
                      {st.stepNumber}
                    </div>
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0d4436', marginBottom: '4px' }}>
                        {st.title[language] || st.title.hi}
                      </div>
                      <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>
                        {st.description[language] || st.description.hi}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {guidance.faqs && guidance.faqs.length > 0 && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0d4436', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} color="#0d4436" />
                {t('faqsTitle', 'अक्सर पूछे जाने वाले सवाल (FAQs)')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {guidance.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '16px'
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      Q: {faq.question[language] || faq.question.hi}
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55 }}>
                      A: {faq.answer[language] || faq.answer.hi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Required Documents & Official Sources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Required Documents Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '22px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0d4436', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={17} color="#0d4436" />
              {t('requiredDocuments', 'आवश्यक दस्तावेज़')}
            </h3>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {service.requiredDocuments && service.requiredDocuments.length > 0 ? (
                service.requiredDocuments.map((doc, idx) => (
                  <li key={idx} style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                    {doc[language] || doc.hi}
                  </li>
                ))
              ) : (
                <li style={{ fontSize: '13px', color: '#64748b' }}>
                  {language === 'hi' ? 'दस्तावेज़ विनिर्देश प्रोटोटाइप में लोड हो रहे हैं।' : 'Documents specifications loading in prototype.'}
                </li>
              )}
            </ul>
          </div>

          {/* Official Department & Portal Information */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '22px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0d4436', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={17} color="#0d4436" />
              {t('officialPortalInfo', 'आधिकारिक सरकारी पोर्टल एवं विभाग')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {meta.department && (
                <div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                    {t('deptMinistry', 'मंत्रालय / विभाग')}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>
                    {meta.department}
                  </div>
                </div>
              )}

              {meta.portalUrl && (
                <div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                    {t('officialWebsite', 'आधिकारिक वेबसाइट')}
                  </div>
                  <a
                    href={meta.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#0284c7',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      marginTop: '3px'
                    }}
                  >
                    <span>{meta.portalName || meta.portalUrl}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}

              {meta.tollFree && (
                <div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={12} />
                    {t('helplineNumber', 'हेल्पलाइन नंबर')}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>
                    {meta.tollFree}
                  </div>
                </div>
              )}

              {meta.lastVerified && (
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} />
                    {t('lastVerifiedOn', 'अंतिम सत्यापन')}: {meta.lastVerified}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
