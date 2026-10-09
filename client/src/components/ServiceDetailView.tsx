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
  ListOrdered,
  MapPin,
  Info
} from 'lucide-react';
import type { LanguageCode, ServiceDefinition } from '../types';

interface ServiceDetailViewProps {
  service: ServiceDefinition;
  language: LanguageCode;
  onBack: () => void;
  onApplyService: (serviceId: string) => void;
  t: (key: string, fallback?: string) => string;
}

// Defensive string extractor for localized strings, objects, or raw strings
function getLoc(val: any, lang: LanguageCode, fallback = ''): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    return val[lang] || val.hi || val.en || val.mr || fallback;
  }
  return fallback;
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

  const name = getLoc(service.name, language, service.serviceId);
  const desc = getLoc(service.description, language, '');
  const whoIsItFor = getLoc(guidance.whoIsItFor, language, '');
  const disclaimer = getLoc(guidance.disclaimer, language, '');
  const deptName = getLoc(meta.department, language, '');
  const portalUrl = meta.url || meta.portalUrl || (typeof service.officialSource === 'string' && service.officialSource.startsWith('http') ? service.officialSource.split(' ')[0] : '');
  const portalName = meta.portalName || (portalUrl ? portalUrl.replace(/^https?:\/\//, '') : t('officialSource', 'आधिकारिक संदर्भ पोर्टल'));

  // Normalize steps safely
  const rawSteps = guidance.steps || [];
  const steps = rawSteps.map((st: any, idx: number) => ({
    stepNumber: st.stepNumber || st.step || idx + 1,
    title: getLoc(st.title, language, `${t('step', 'चरण')} ${idx + 1}`),
    description: getLoc(st.details || st.description, language, '')
  }));

  // Normalize FAQs safely
  const rawFaqs = guidance.faqs || [];
  const faqs = rawFaqs.map((faq: any) => ({
    question: getLoc(faq.question, language, ''),
    answer: getLoc(faq.answer, language, '')
  }));

  // Normalize Required Documents safely
  const rawDocs = service.requiredDocuments || guidance.requiredDocuments || [];
  const docs = rawDocs.map((doc: any) => getLoc(doc, language, ''));

  // Normalize Eligibility Criteria safely
  const rawCriteria = guidance.eligibilityCriteria || [];
  const criteria = rawCriteria.map((crit: any) => getLoc(crit, language, ''));

  const isAadhaarService = service.serviceId === 'aadhaar_service';

  return (
    <div className="gov-container" style={{ padding: '24px 0 54px' }}>
      {/* Top Back Navigation Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={onBack}
          className="btn-gov-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', fontSize: '14px', fontWeight: 600 }}
        >
          <ArrowLeft size={16} />
          {t('backToCatalog', '← सेवा सूची पर वापस जाएं')}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`badge-gov ${isDirect ? 'badge-gov-green' : 'badge-gov-blue'}`}>
            {isDirect ? `✓ ${t('onlineDemoAvailable', 'ऑनलाइन डेमो उपलब्ध')}` : t('guidanceAvailable', 'मार्गदर्शन उपलब्ध')}
          </span>
          <span className="badge-gov badge-gov-proto">
            {t('prototypeBadge', 'प्रोटोटाइप')}
          </span>
        </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {service.category && (
              <span
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {service.category.replace(/_/g, ' ')}
              </span>
            )}
            <span
              style={{
                backgroundColor: isDirect ? '#ecfdf5' : '#eff6ff',
                color: isDirect ? '#065f46' : '#1e40af',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              {isDirect ? t('directDemoNotice', 'सीधा डेमो आवेदन') : t('guidanceOnly', 'नागरिक मार्गदर्शन')}
            </span>
          </div>

          {isDirect && (
            <button
              onClick={() => onApplyService(service.serviceId)}
              className="btn-gov-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', fontSize: '15px' }}
            >
              <Mic size={17} />
              {t('applyNow', 'आवेदन करें (आवाज़ से)')}
            </button>
          )}
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0d4436', marginBottom: '12px', lineHeight: 1.3 }}>
          {name}
        </h1>

        <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, maxWidth: '840px', marginBottom: '20px' }}>
          {desc}
        </p>

        {/* Prototype Demo / Guidance Status Banner */}
        <div
          style={{
            backgroundColor: isDirect ? '#ecfdf5' : '#fffbeb',
            border: isDirect ? '1.5px solid #a7f3d0' : '1.5px solid #fde68a',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}
        >
          {isDirect ? (
            <ShieldCheck size={22} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <AlertCircle size={22} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          )}
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: isDirect ? '#065f46' : '#92400e', marginBottom: '4px' }}>
              {t('demoStatusNotice', 'प्रोटोटाइप डेमो स्थिति')}
            </div>
            <div style={{ fontSize: '13.5px', color: isDirect ? '#047857' : '#78350f', lineHeight: 1.55 }}>
              {isDirect
                ? t('directDemoNotice', 'इस सेवा का ऑनलाइन डेमो आवेदन इस प्रोटोटाइप में उपलब्ध है। आप अभी आवाज़ या फॉर्म के माध्यम से आवेदन कर सकते हैं।')
                : (disclaimer || t('guidanceOnlyDisclaimer', 'इस प्रोटोटाइप में इस सेवा का सीधा आवेदन उपलब्ध नहीं है। कृपया नीचे दिए गए चरणों का पालन करें और आधिकारिक पोर्टल के माध्यम से आवेदन करें।'))}
            </div>
          </div>
        </div>

        {/* Prominent Callout Specifically for In-Person Biometric / Guidance Services (like Aadhaar) */}
        {!isDirect && (
          <div
            style={{
              marginTop: '16px',
              backgroundColor: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}
          >
            <MapPin size={22} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af', marginBottom: '4px' }}>
                {isAadhaarService
                  ? (language === 'en'
                      ? 'In-Person Enrollment & Biometrics Required'
                      : language === 'mr'
                      ? 'प्रत्यक्ष उपस्थिती व बायोमेट्रिक नोंदणी आवश्यक'
                      : 'भौतिक उपस्थिति एवं बायोमेट्रिक अनिवार्य')
                  : (language === 'en'
                      ? 'Official Channel Submission Required'
                      : language === 'mr'
                      ? 'अधिकृत यंत्रणेद्वारे अर्ज प्रक्रिया आवश्यक'
                      : 'अधिकृत माध्यम से प्रक्रिया आवश्यक')}
              </div>
              <div style={{ fontSize: '13px', color: '#1d4ed8', lineHeight: 1.55 }}>
                {isAadhaarService
                  ? (language === 'en'
                      ? 'Aadhaar enrollment and biometric updates require visiting an authorized UIDAI Aadhaar Seva Kendra, designated post office, or bank branch in person. Direct application is intentionally not collected online in this prototype.'
                      : language === 'mr'
                      ? 'आधार नोंदणी आणि बायोमेट्रिक अद्ययावत करण्यासाठी अधिकृत UIDAI आधार सेवा केंद्र, पोस्ट ऑफिस किंवा बँकेला प्रत्यक्ष भेट देणे आवश्यक आहे. या प्रोटोटाइपमध्ये थेट ऑनलाइन अर्ज स्वीकारला जात नाही.'
                      : 'आधार नामांकन और बायोमेट्रिक सुधार के लिए अधिकृत यूआईडीएआई आधार सेवा केंद्र, डाकघर या बैंक शाखा पर व्यक्तिगत रूप से उपस्थित होना अनिवार्य है। इस प्रोटोटाइप में सीधा ऑनलाइन आवेदन नहीं लिया जाता है।')
                  : (language === 'en'
                      ? 'This service requires following the step-by-step guidance below and completing formalities through authorized government offices or portals.'
                      : language === 'mr'
                      ? 'या सेवेसाठी खालील टप्प्यांचे पालन करून अधिकृत शासकीय पोर्टल किंवा कार्यालयामार्फत प्रक्रिया पूर्ण करावी.'
                      : 'इस सेवा हेतु नीचे दिए गए चरणों का पालन कर अधिकृत सरकारी कार्यालय अथवा पोर्टल के माध्यम से औपचारिकताएं पूर्ण करें।')}
              </div>
              {portalUrl && (
                <div style={{ marginTop: '10px' }}>
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gov-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12.5px',
                      padding: '6px 14px',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{portalName}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Two-Column Responsive Grid */}
      <div className="detail-two-column-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Guidance Details & Steps */}
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
          {criteria.length > 0 && (
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
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {criteria.map((crit, idx) => (
                  <li key={idx} style={{ fontSize: '14px', color: '#334155', lineHeight: 1.55 }}>
                    {crit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Step-by-Step Guidance */}
          {steps.length > 0 && (
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
                {steps.map((st, idx) => (
                  <div
                    key={st.stepNumber || idx}
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
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: '#0d4436',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        flexShrink: 0
                      }}
                    >
                      {st.stepNumber}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0d4436', marginBottom: '4px' }}>
                        {st.title}
                      </div>
                      <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55 }}>
                        {st.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {faqs.length > 0 && (
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
                {faqs.map((faq, idx) => (
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
                      Q: {faq.question}
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55 }}>
                      A: {faq.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Required Documents & Official Portals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action Box Card on the Right (if direct demo) */}
          {isDirect && (
            <div
              style={{
                backgroundColor: '#0d4436',
                borderRadius: '14px',
                padding: '22px',
                color: '#ffffff',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
                {t('applyNow', 'आवेदन शुरू करें')}
              </h4>
              <p style={{ fontSize: '13px', color: '#a7f3d0', lineHeight: 1.5, marginBottom: '16px' }}>
                {language === 'en'
                  ? 'Speak your details naturally in Hindi, Marathi, or English.'
                  : language === 'mr'
                  ? 'हिंदी, मराठी किंवा इंग्रजीत सहजपणे आवाजाद्वारे माहिती सांगा.'
                  : 'हिंदी, मराठी या अंग्रेजी में बोलकर अपनी जानकारी दर्ज करें।'}
              </p>
              <button
                onClick={() => onApplyService(service.serviceId)}
                className="btn-gov-accent"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  fontWeight: 700
                }}
              >
                <Mic size={17} />
                {t('applyNow', 'आवेदन करें (आवाज़ से)')}
              </button>
            </div>
          )}

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
              {docs.length > 0 ? (
                docs.map((doc, idx) => (
                  <li key={idx} style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                    {doc}
                  </li>
                ))
              ) : (
                <li style={{ fontSize: '13px', color: '#64748b' }}>
                  {language === 'hi' ? 'दस्तावेज़ विवरण उपलब्ध नहीं है।' : 'Documents specifications not specified.'}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {deptName && (
                <div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                    {t('deptMinistry', 'मंत्रालय / विभाग')}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 600, marginTop: '2px', lineHeight: 1.4 }}>
                    {deptName}
                  </div>
                </div>
              )}

              {portalUrl && (
                <div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                    {t('officialWebsite', 'आधिकारिक वेबसाइट')}
                  </div>
                  <a
                    href={portalUrl}
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
                      marginTop: '3px',
                      wordBreak: 'break-all'
                    }}
                  >
                    <span>{portalName}</span>
                    <ExternalLink size={13} style={{ flexShrink: 0 }} />
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
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} />
                    {t('lastVerifiedOn', 'अंतिम सत्यापन')}: {meta.lastVerified}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prototype Notice Callout */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}
          >
            <Info size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
              {language === 'en'
                ? 'Information sourced from official Union & State Government public domain portals. For statutory submissions, refer to authorized government channels.'
                : language === 'mr'
                ? 'माहिती केंद्र व राज्य शासनाच्या अधिकृत सार्वजनिक संकेतस्थळांवरून घेतलेली आहे. वैधानिक प्रक्रियेसाठी अधिकृत पोर्टलचा संदर्भ घ्यावा.'
                : 'जानकारी केंद्र एवं राज्य सरकार के अधिकृत सार्वजनिक पोर्टल्स से संकलित है। वैधानिक प्रक्रियाओं के लिए आधिकारिक पोर्टल का संदर्भ लें।'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Back Button & Actions */}
      <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <button
          onClick={onBack}
          className="btn-gov-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14.5px' }}
        >
          <ArrowLeft size={16} />
          {t('backToCatalog', '← सेवा सूची पर वापस जाएं')}
        </button>

        {isDirect && (
          <button
            onClick={() => onApplyService(service.serviceId)}
            className="btn-gov-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14.5px' }}
          >
            <Mic size={16} />
            {t('applyNow', 'आवेदन करें (आवाज़ से)')}
          </button>
        )}
      </div>
    </div>
  );
}
