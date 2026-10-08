import {
  Mic,
  MicOff,
  Volume2,
  Send,
  RotateCcw,
  ArrowLeft,
  HelpCircle,
  CheckCircle,
  Check,
  X,
  Edit2,
  ChevronRight,
  FileText,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import type { LanguageCode, TurnResponse, VoiceState } from '../types';

interface VoiceAssistantWidgetProps {
  language: LanguageCode;
  turnResponse: TurnResponse | null;
  sessionId: string;
  isListening: boolean;
  liveTranscript: string;
  typedInput: string;
  manualFieldValue: string;
  isLoading: boolean;
  voiceState: VoiceState;
  onToggleListening: () => void;
  onSendText: (text: string) => void;
  onAction: (action: string, value?: unknown, fieldId?: string) => void;
  onSpeakMessage: (text: string, lang: LanguageCode) => void;
  onSetTypedInput: (text: string) => void;
  onSetManualFieldValue: (text: string) => void;
  onStartTracking: (appId: string) => void;
  t: (key: string, fallback?: string) => string;
}

export function VoiceAssistantWidget({
  language,
  turnResponse,
  sessionId,
  isListening,
  liveTranscript,
  typedInput,
  manualFieldValue,
  isLoading,
  voiceState,
  onToggleListening,
  onSendText,
  onAction,
  onSpeakMessage,
  onSetTypedInput,
  onSetManualFieldValue,
  onStartTracking,
  t
}: VoiceAssistantWidgetProps) {
  const currentMessage = turnResponse
    ? turnResponse.assistantMessage[language] || turnResponse.assistantMessage.hi
    : t('ready', 'सहायक तैयार है');

  const getVoiceStateBadge = () => {
    switch (voiceState) {
      case 'LISTENING':
        return { label: t('listening', 'सुन रहा हूँ...'), bg: '#fff7ed', border: '#fdba74', color: '#c2410c' };
      case 'PROCESSING':
        return { label: t('processing', 'प्रक्रिया जारी है...'), bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' };
      case 'SPEAKING':
        return { label: t('speaking', 'सहायक बोल रहा है...'), bg: '#ecfdf5', border: '#a7f3d0', color: '#047857' };
      case 'ERROR':
        return { label: 'त्रुटि (Error)', bg: '#fef2f2', border: '#fecaca', color: '#b91c1c' };
      case 'IDLE':
      default:
        return { label: t('ready', 'सहायक तैयार है'), bg: '#f1f5f9', border: '#cbd5e1', color: '#475569' };
    }
  };

  const badge = getVoiceStateBadge();

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid #cbd5e1',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. WIDGET TOP STATUS BAR */}
      <div
        style={{
          backgroundColor: '#0d4436',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isListening ? '#f97316' : '#22c55e',
              boxShadow: isListening ? '0 0 8px #f97316' : '0 0 6px #22c55e'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.3px' }}>
            आवाज़ सहायक (VOICE ASSISTANT)
          </span>
        </div>

        {/* Dynamic Soundwave Equalizer Bars */}
        <div className={`soundwave ${voiceState !== 'IDLE' ? 'active' : ''}`}>
          <div className="soundwave-bar" />
          <div className="soundwave-bar" />
          <div className="soundwave-bar" />
          <div className="soundwave-bar" />
          <div className="soundwave-bar" />
        </div>

        {/* State Pill */}
        <div
          style={{
            backgroundColor: badge.bg,
            border: `1px solid ${badge.border}`,
            color: badge.color,
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 700
          }}
        >
          {badge.label}
        </div>
      </div>

      {/* 2. MAIN CONVERSATIONAL CARD BODY */}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Assistant Speech Bubble */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            marginBottom: '20px'
          }}
        >
          <button
            onClick={() => onSpeakMessage(currentMessage, language)}
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0d4436',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.15s'
            }}
            title={t('repeat', 'दोबारा बोलें')}
          >
            <Volume2 size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#0d4436', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
              सेवावाणी सहायक:
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', lineHeight: 1.45 }}>
              {currentMessage}
            </div>
            {turnResponse?.currentField?.helpText && (
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} color="#f59e0b" />
                <span>{turnResponse.currentField.helpText[language]}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. DYNAMIC CONTENT BASED ON STATE MACHINE */}

        {/* A. FORM QUESTIONS (ASK_FIELD, AWAIT_ANSWER, CONFIRM_FIELD, FALLBACK_INPUT) */}
        {(turnResponse?.state === 'ASK_FIELD' ||
          turnResponse?.state === 'AWAIT_ANSWER' ||
          turnResponse?.state === 'CONFIRM_FIELD' ||
          turnResponse?.state === 'FALLBACK_INPUT') && (
          <div style={{ marginBottom: '20px' }}>
            {/* Step Progress Bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                <span>
                  {t('step', 'चरण')} {turnResponse.fieldIndex + 1} {t('of', 'का')} {turnResponse.totalFields}:{' '}
                  <span style={{ color: '#0d4436' }}>
                    {turnResponse.currentField?.label[language]}
                  </span>
                </span>
                <span>
                  {Math.round(((turnResponse.fieldIndex + (turnResponse.state === 'CONFIRM_FIELD' ? 1 : 0)) / turnResponse.totalFields) * 100)}%
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${((turnResponse.fieldIndex + (turnResponse.state === 'CONFIRM_FIELD' ? 1 : 0)) / turnResponse.totalFields) * 100}%`,
                    backgroundColor: '#0d4436',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>
            </div>

            {/* CONFIRMATION CONTROLS (CONFIRM_FIELD) */}
            {turnResponse.state === 'CONFIRM_FIELD' && (
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#166534', marginBottom: '14px' }}>
                  नागरिक पुष्टि: क्या दर्ज किया गया विवरण सही है?
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onAction('CONFIRM_YES')}
                    className="btn-gov-primary"
                    style={{ padding: '12px 28px', fontSize: '15px', backgroundColor: '#15803d' }}
                  >
                    <Check size={18} />
                    {t('yesCorrect', 'हाँ, सही है')}
                  </button>
                  <button
                    onClick={() => onAction('CONFIRM_NO')}
                    className="btn-gov-outline"
                    style={{ padding: '12px 24px', fontSize: '15px', color: '#b91c1c', borderColor: '#f87171' }}
                  >
                    <X size={18} />
                    {t('noChange', 'नहीं, बदलो')}
                  </button>
                </div>
              </div>
            )}

            {/* LEVEL 2 FALLBACK INPUT (FALLBACK_INPUT) */}
            {turnResponse.state === 'FALLBACK_INPUT' && (
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  border: '1.5px solid #fde68a',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} />
                  वैकल्पिक कीबोर्ड प्रविष्टि (Level 2 Manual Input):
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type={turnResponse.currentField?.type === 'digits' ? 'tel' : 'text'}
                    placeholder={turnResponse.currentField?.placeholder?.[language] || 'यहाँ उत्तर टाइप करें...'}
                    value={manualFieldValue}
                    onChange={(e) => onSetManualFieldValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onAction('SUBMIT_MANUAL_FIELD', manualFieldValue, turnResponse.currentField?.id)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #d97706',
                      fontSize: '15px'
                    }}
                  />
                  <button
                    onClick={() => onAction('SUBMIT_MANUAL_FIELD', manualFieldValue, turnResponse.currentField?.id)}
                    className="btn-gov-saffron"
                    style={{ padding: '10px 18px' }}
                  >
                    <Check size={17} />
                    दर्ज करें
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Form Action Buttons (Repeat, Back, Help) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onAction('BACK')}
                  disabled={turnResponse.fieldIndex === 0}
                  className="btn-gov-ghost"
                  style={{ opacity: turnResponse.fieldIndex === 0 ? 0.4 : 1 }}
                >
                  <ArrowLeft size={14} />
                  {t('back', 'पीछे')}
                </button>
                <button
                  onClick={() => onAction('REPEAT')}
                  className="btn-gov-ghost"
                >
                  <RotateCcw size={14} />
                  {t('repeat', 'दोबारा बोलें')}
                </button>
              </div>

              <button
                onClick={() => onAction('HELP')}
                style={{
                  backgroundColor: '#fef2f2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <HelpCircle size={14} />
                {t('help', 'मदद चाहिए')}
              </button>
            </div>
          </div>
        )}

        {/* B. SERVICE RECOMMENDATION VIEW */}
        {turnResponse?.state === 'SERVICE_RECOMMENDATION' && (
          <div
            style={{
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              padding: '20px',
              border: '1.5px solid #86efac',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="badge-gov badge-gov-green">
                {turnResponse.service?.directApplicationSupported ? 'ऑनलाइन डेमो फॉर्म तैयार' : 'मार्गदर्शन उपलब्ध'}
              </span>
              <span className="badge-gov badge-gov-proto">डेमो योजना</span>
            </div>
            <h4 style={{ fontSize: '19px', fontWeight: 700, color: '#0d4436', marginBottom: '6px' }}>
              {turnResponse.service?.name[language] || turnResponse.service?.name.hi}
            </h4>
            <p style={{ fontSize: '14px', color: '#334155', marginBottom: '16px' }}>
              {turnResponse.service?.description[language] || turnResponse.service?.description.hi}
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {turnResponse.service?.directApplicationSupported ? (
                <button
                  onClick={() => onAction('APPLY_NOW', turnResponse.service?.serviceId)}
                  className="btn-gov-primary"
                  style={{ flex: 1 }}
                >
                  <ChevronRight size={17} />
                  {t('applyNow', 'आवेदन करें')}
                </button>
              ) : (
                <button
                  onClick={() => onSendText(turnResponse.service?.serviceId || '')}
                  className="btn-gov-primary"
                  style={{ flex: 1 }}
                >
                  <FileText size={17} />
                  {t('howToApply', 'आवेदन कैसे करें')}
                </button>
              )}
              <button
                onClick={() => onAction('RESTART')}
                className="btn-gov-ghost"
              >
                <RotateCcw size={15} />
                अन्य सेवा खोजें
              </button>
            </div>
          </div>
        )}

        {/* C. GUIDANCE MODE VIEW */}
        {turnResponse?.state === 'GUIDANCE' && turnResponse.guidanceInfo && (
          <div
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #cbd5e1',
              marginBottom: '20px'
            }}
          >
            {(() => {
              const guidance = turnResponse.guidanceInfo as {
                title?: string;
                description?: string;
                requiredDocuments?: string[];
                officialSource?: string;
              };
              return (
                <>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#0d4436', marginBottom: '8px' }}>
                    {guidance.title}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#475569', marginBottom: '16px' }}>
                    {guidance.description}
                  </p>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      📋 आवश्यक कागजात (Required Documents):
                    </div>
                    <ul style={{ paddingLeft: '18px', fontSize: '13px', color: '#334155', lineHeight: 1.7 }}>
                      {guidance.requiredDocuments?.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span>आधिकारिक संदर्भ: <strong>{guidance.officialSource}</strong></span>
                    <ExternalLink size={15} color="#0d4436" />
                  </div>

                  <button
                    onClick={() => onAction('RESTART')}
                    className="btn-gov-primary"
                    style={{ width: '100%' }}
                  >
                    <ArrowLeft size={16} />
                    मुख्य पृष्ठ पर लौटें
                  </button>
                </>
              );
            })()}
          </div>
        )}

        {/* D. FINAL REVIEW VIEW */}
        {turnResponse?.state === 'FINAL_REVIEW' && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              border: '1.5px solid #cbd5e1',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0d4436' }}>
              <CheckCircle size={22} color="#15803d" />
              <h4 style={{ fontSize: '18px', fontWeight: 700 }}>
                {t('finalReviewTitle', 'आवेदन की समीक्षा करें')}
              </h4>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              {t('finalReviewSubtitle', 'कृपया सबमिट करने से पहले अपने सभी विवरण जाँच लें।')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {Object.entries(turnResponse.formData).map(([k, v]) => {
                let displayVal = String(v);
                if (k === 'aadhaar' && displayVal.length === 12) {
                  displayVal = 'XXXX-XXXX-' + displayVal.slice(-4);
                } else if (k === 'mobile' && displayVal.length === 10) {
                  displayVal = displayVal.slice(0, 2) + 'XXXXXX' + displayVal.slice(-2);
                }

                return (
                  <div
                    key={k}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13.5px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>
                        {k.replace('_', ' ')}
                      </div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{displayVal}</div>
                    </div>
                    <button
                      onClick={() => onAction('SUBMIT_MANUAL_FIELD', v, k)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0d4436',
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 600
                      }}
                    >
                      <Edit2 size={13} />
                      बदलें
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onAction('CONFIRM_YES')}
              disabled={isLoading}
              className="btn-gov-primary"
              style={{ width: '100%', padding: '14px', fontSize: '16px', backgroundColor: '#15803d' }}
            >
              <Check size={18} />
              {isLoading ? t('processing') : t('submit', 'आवेदन जमा करें (डेमो)')}
            </button>
          </div>
        )}

        {/* E. SUBMISSION SUCCESS VIEW (DONE) */}
        {turnResponse?.state === 'DONE' && (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #86efac',
              textAlign: 'center',
              marginBottom: '20px'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#d1fae5',
                color: '#047857',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}
            >
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontSize: '21px', fontWeight: 800, color: '#065f46', marginBottom: '6px' }}>
              {t('submittedSuccess', 'आवेदन सफलतापूर्वक जमा हुआ (डेमो)')}
            </h3>
            <p style={{ fontSize: '14px', color: '#334155', marginBottom: '18px' }}>
              {turnResponse.assistantMessage[language] || turnResponse.assistantMessage.hi}
            </p>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0', marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{t('appIdLabel', 'आवेदन क्रमांक')}</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0d4436', letterSpacing: '1px', margin: '4px 0' }}>
                {turnResponse.submissionResult?.applicationId || 'DEMO-PMK-20261009-001'}
              </div>
              <span className="badge-gov badge-gov-green" style={{ marginTop: '4px' }}>
                {turnResponse.submissionResult?.status || 'SUBMITTED (DEMO)'}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginBottom: '20px' }}>
              🛡️ {t('demoDisclaimer')}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => onStartTracking(turnResponse.submissionResult?.applicationId || '')}
                className="btn-gov-primary"
              >
                {t('trackStatus', 'स्थिति ट्रैक करें')}
              </button>
              <button
                onClick={() => onAction('RESTART')}
                className="btn-gov-outline"
              >
                <RotateCcw size={15} />
                {t('startNew', 'नया आवेदन शुरू करें')}
              </button>
            </div>
          </div>
        )}

        {/* F. OPERATOR HANDOFF VIEW (HANDOFF) */}
        {turnResponse?.state === 'HANDOFF' && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              borderRadius: '14px',
              padding: '24px',
              border: '2px solid #fca5a5',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c', marginBottom: '10px' }}>
              <ShieldAlert size={26} />
              <h4 style={{ fontSize: '19px', fontWeight: 800 }}>
                सहायता प्रकरण दर्ज किया गया (Operator Handoff)
              </h4>
            </div>
            <p style={{ fontSize: '14px', color: '#334155', marginBottom: '18px' }}>
              {turnResponse.assistantMessage[language] || turnResponse.assistantMessage.hi}
            </p>

            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', color: '#991b1b' }}>Case Tracking ID:</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#b91c1c' }}>
                HO-{sessionId.slice(0, 8).toUpperCase()}
              </div>
              <div style={{ fontSize: '12.5px', color: '#7f1d1d', marginTop: '4px' }}>
                Status: <strong>QUEUED_FOR_ASSISTANCE</strong> (ऑपरेटर कतार में)
              </div>
            </div>

            <button
              onClick={() => onAction('RESTART')}
              className="btn-gov-primary"
              style={{ width: '100%' }}
            >
              <RotateCcw size={15} />
              {t('startNew', 'नया आवेदन शुरू करें')}
            </button>
          </div>
        )}

        {/* 4. CENTRAL VOICE & MICROPHONE INTERACTION AREA (Default for welcome / discovery / questions) */}
        {turnResponse?.state !== 'DONE' &&
          turnResponse?.state !== 'HANDOFF' &&
          turnResponse?.state !== 'FINAL_REVIEW' &&
          turnResponse?.state !== 'CONFIRM_FIELD' && (
            <div style={{ textAlign: 'center', margin: '14px 0 20px' }}>
              {/* Big Mic Button */}
              <button
                onClick={onToggleListening}
                className={isListening ? 'mic-active' : ''}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  backgroundColor: '#ea580c',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  transform: isListening ? 'scale(1.06)' : 'scale(1)'
                }}
                title={t('micTapPrompt', 'बोलने के लिए माइक दबाएँ')}
              >
                {isListening ? <MicOff size={38} /> : <Mic size={38} />}
              </button>

              <div
                style={{
                  marginTop: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: isListening ? '#ea580c' : '#475569'
                }}
              >
                {isListening ? t('listening') : t('micTapPrompt')}
              </div>

              {/* Real-time Speech Recognition Subtitle Bubble */}
              {liveTranscript && (
                <div
                  style={{
                    backgroundColor: '#fff7ed',
                    border: '1.5px dashed #ea580c',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    margin: '12px auto 0',
                    maxWidth: '480px',
                    fontSize: '15px',
                    color: '#9a3412',
                    fontWeight: 600
                  }}
                >
                  🗣️ "{liveTranscript}"
                </div>
              )}
            </div>
          )}

        {/* 5. TEXT INPUT FALLBACK BAR */}
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <input
            type="text"
            placeholder={t('typeInstead', 'या यहाँ अपनी समस्या / सेवा का नाम टाइप करें...')}
            value={typedInput}
            onChange={(e) => onSetTypedInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendText(typedInput)}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={() => onSendText(typedInput)}
            disabled={isLoading || !typedInput.trim()}
            className="btn-gov-primary"
            style={{ padding: '10px 18px' }}
          >
            <Send size={16} />
            {t('send', 'भेजें')}
          </button>
        </div>

        {/* 6. POPULAR VOICE EXAMPLE CHIPS (Visible in welcome / discovery state) */}
        {(turnResponse?.state === 'WELCOME' || turnResponse?.state === 'SERVICE_DISCOVERY') && (
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
              💡 {language === 'hi' ? 'बोलने या चुनने के लिए टैप करें:' : (language === 'mr' ? 'बोलण्यासाठी किंवा निवडण्यासाठी टॅप करा:' : 'Try speaking or tapping these examples:')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { label: 'PM-Kisan आवेदन', query: 'PM-Kisan' },
                { label: 'किसान हूँ मदद चाहिए', query: 'किसान हूँ मदद चाहिए' },
                { label: 'राशन कार्ड सहायता', query: 'राशन कार्ड' },
                { label: 'वृद्धावस्था पेंशन', query: 'वृद्धावस्था पेंशन' },
                { label: 'छात्रवृत्ति', query: 'छात्रवृत्ति' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendText(chip.query)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '16px',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#0d4436',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  🌾 {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
