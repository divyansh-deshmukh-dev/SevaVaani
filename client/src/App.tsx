import { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Send,
  RotateCcw,
  ArrowLeft,
  HelpCircle,
  CheckCircle,
  FileText,
  AlertTriangle,
  ExternalLink,
  Search,
  Activity,
  Info,
  Check,
  X,
  Edit2,
  ChevronRight,
  ShieldCheck,
  Wifi
} from 'lucide-react';
import { apiClient } from './api/client';
import { speechService } from './audio/speech';
import { getTranslation } from './i18n';
import type { LanguageCode, TurnResponse } from './types';

export function App() {
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [activeTab, setActiveTab] = useState<'assistant' | 'track' | 'operator' | 'eval' | 'about'>('assistant');
  const [turnResponse, setTurnResponse] = useState<TurnResponse | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  
  // Voice & Interaction states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [typedInput, setTypedInput] = useState<string>('');
  const [manualFieldValue, setManualFieldValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 2G Network Simulation toggle
  const [simulate2G, setSimulate2G] = useState<boolean>(false);

  // Status Tracker & Operator states
  const [searchAppId, setSearchAppId] = useState<string>('');
  const [searchedStatus, setSearchedStatus] = useState<any>(null);
  const [handoffRecord, setHandoffRecord] = useState<any>(null);

  // Evaluation Lab state
  const [refText, setRefText] = useState<string>('मेरा नाम रमेश कुमार है');
  const [hypText, setHypText] = useState<string>('मेरा नाम रमेश कुमार है');
  const [werResult, setWerResult] = useState<any>(null);
  const [metricsData, setMetricsData] = useState<any>(null);

  // Translation helper
  const t = (key: string, fallback?: string) => getTranslation(language, key, fallback);

  // Initialize Session on mount or restart
  useEffect(() => {
    initSession(language);
  }, []);

  const initSession = async (lang: LanguageCode) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await apiClient.createSession(lang);
      setSessionId(res.sessionId);
      setTurnResponse(res);
      // Auto-speak welcome
      speakMessage(res.assistantMessage[lang] || res.assistantMessage.hi, lang);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    if (sessionId) {
      apiClient.sendAction(sessionId, { action: 'SET_LANGUAGE', language: lang }).then((res) => {
        setTurnResponse(res);
        speakMessage(res.assistantMessage[lang] || res.assistantMessage.hi, lang);
      });
    }
  };

  const toggle2G = () => {
    const next = !simulate2G;
    setSimulate2G(next);
    apiClient.simulate2G = next;
  };

  const speakMessage = (text: string, lang: LanguageCode) => {
    speechService.speak(text, lang);
  };

  // Turn submission
  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim() || !sessionId) return;
    setIsLoading(true);
    setErrorMessage('');
    setLiveTranscript('');
    speechService.stopListening();
    speechService.cancelSpeech();

    try {
      const res = await apiClient.sendTurn(sessionId, {
        text: textToSend.trim(),
        language
      });
      setTurnResponse(res);
      setTypedInput('');
      speakMessage(res.assistantMessage[language] || res.assistantMessage.hi, language);
    } catch (err: any) {
      setErrorMessage(err.message || 'Request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: string, value?: any, fieldId?: string) => {
    if (!sessionId) return;
    setIsLoading(true);
    setErrorMessage('');
    speechService.stopListening();
    speechService.cancelSpeech();

    try {
      const res = await apiClient.sendAction(sessionId, {
        action,
        value,
        fieldId,
        language
      });
      setTurnResponse(res);
      setManualFieldValue('');
      speakMessage(res.assistantMessage[language] || res.assistantMessage.hi, language);

      // If handoff triggered, store it
      if (res.state === 'HANDOFF') {
        const h = await apiClient.getHandoff(sessionId);
        setHandoffRecord(h);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Action failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Recording trigger
  const handleToggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.cancelSpeech();
      setIsListening(true);
      setLiveTranscript('');
      setErrorMessage('');

      speechService.startListening(
        language,
        (transcript, isFinal) => {
          setLiveTranscript(transcript);
          if (isFinal) {
            setIsListening(false);
            handleSendText(transcript);
          }
        },
        (error) => {
          setIsListening(false);
          setErrorMessage(`Microphone error: ${error}. You can also type your answer.`);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  // Evaluation & Metrics Lab loader
  const loadMetricsAndWer = async () => {
    try {
      const m = await apiClient.getMetrics();
      setMetricsData(m);
      const w = await apiClient.calculateWer(refText, hypText, language);
      setWerResult(w);
    } catch (e) {}
  };

  useEffect(() => {
    if (activeTab === 'eval') {
      loadMetricsAndWer();
    }
  }, [activeTab]);

  const handleCalcWer = async () => {
    try {
      const w = await apiClient.calculateWer(refText, hypText, language);
      setWerResult(w);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  // Status Search
  const handleCheckStatus = async () => {
    if (!searchAppId.trim()) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const s = await apiClient.checkStatus('pm_kisan', searchAppId.trim());
      setSearchedStatus(s);
    } catch (e: any) {
      setErrorMessage('Application ID not found in demo records.');
      setSearchedStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner: Prototype Honesty Notice */}
      <div
        style={{
          backgroundColor: '#fef3c7',
          color: '#92400e',
          padding: '6px 16px',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #fde68a'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#d97706" />
          <span>{t('demoBadge')}: PM-Kisan Farmer Registration Demo. Real government submission is never faked.</span>
        </div>
        <button
          onClick={toggle2G}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: simulate2G ? '#ea580c' : '#ffffff',
            color: simulate2G ? '#ffffff' : '#92400e',
            border: '1px solid #f59e0b',
            borderRadius: '16px',
            padding: '3px 10px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <Wifi size={13} />
          {t('simulated2g')}: {simulate2G ? 'Active (800ms RTT)' : 'OFF'}
        </button>
      </div>

      {/* Main Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Logo & Tricolor Accent */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f97316 33%, #ffffff 33%, #ffffff 66%, #15803d 66%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #cbd5e1',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #1e3a8a' }}></div>
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)', lineHeight: 1.1 }}>
                {t('appName')}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('tagline')}</p>
            </div>
          </div>

          {/* Language Selector Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            <button
              onClick={() => handleLanguageChange('hi')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: language === 'hi' ? 'var(--primary)' : 'transparent',
                color: language === 'hi' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              हिंदी
            </button>
            <button
              onClick={() => handleLanguageChange('mr')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: language === 'mr' ? 'var(--primary)' : 'transparent',
                color: language === 'mr' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              मराठी
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: language === 'en' ? 'var(--primary)' : 'transparent',
                color: language === 'en' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              English
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="container" style={{ display: 'flex', gap: '8px', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px', overflowX: 'auto' }}>
          {[
            { id: 'assistant', label: t('navAssistant'), icon: Mic },
            { id: 'track', label: t('navTrack'), icon: Search },
            { id: 'operator', label: t('navHandoff'), icon: HelpCircle },
            { id: 'eval', label: t('navEval'), icon: Activity },
            { id: 'about', label: t('navAbout'), icon: Info }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  backgroundColor: active ? 'var(--primary-light)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '20px 0' }}>
        <div className="container">
          {/* Error Alert */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: 'var(--red-light)',
                color: 'var(--red)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #fecaca'
              }}
            >
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: CITIZEN ASSISTANT */}
          {activeTab === 'assistant' && (
            <div>
              {/* WELCOME / SERVICE DISCOVERY VIEW */}
              {(turnResponse?.state === 'WELCOME' || turnResponse?.state === 'SERVICE_DISCOVERY') && (
                <div style={{ textAlign: 'center', maxWidth: '680px', margin: '20px auto 0' }}>
                  <h2 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '8px' }}>
                    {t('welcomeQuestion')}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '32px' }}>
                    {t('welcomeSub')}
                  </p>

                  {/* Central Large Mic Button */}
                  <div style={{ marginBottom: '28px' }}>
                    <button
                      onClick={handleToggleListening}
                      className={isListening ? 'mic-active' : ''}
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--saffron)',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-lg)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s',
                        transform: isListening ? 'scale(1.05)' : 'scale(1)'
                      }}
                      title={t('micTapPrompt')}
                    >
                      {isListening ? <MicOff size={40} /> : <Mic size={40} />}
                    </button>
                    <div style={{ marginTop: '12px', fontWeight: 600, color: isListening ? 'var(--saffron)' : 'var(--text-muted)' }}>
                      {isListening ? t('listening') : t('micTapPrompt')}
                    </div>
                  </div>

                  {/* Live Transcript Preview */}
                  {liveTranscript && (
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        border: '1px dashed var(--saffron)',
                        marginBottom: '20px',
                        fontSize: '16px',
                        color: 'var(--text-main)'
                      }}
                    >
                      🗣️ "{liveTranscript}"
                    </div>
                  )}

                  {/* Text Input Fallback */}
                  <div style={{ display: 'flex', gap: '8px', maxWidth: '540px', margin: '0 auto 36px' }}>
                    <input
                      type="text"
                      placeholder={t('typeInstead')}
                      value={typedInput}
                      onChange={(e) => setTypedInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendText(typedInput)}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        fontSize: '15px'
                      }}
                    />
                    <button
                      onClick={() => handleSendText(typedInput)}
                      disabled={isLoading || !typedInput.trim()}
                      className="btn-primary"
                    >
                      <Send size={18} />
                      {t('send')}
                    </button>
                  </div>

                  {/* Suggestion Chips */}
                  <div style={{ textAlign: 'left', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                      {t('examplesTitle')}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {[
                        { text: t('example1'), val: 'PM-Kisan' },
                        { text: t('example2'), val: 'किसान हूँ मदद चाहिए' },
                        { text: t('example3'), val: 'राशन कार्ड' },
                        { text: t('example4'), val: 'वृद्धावस्था पेंशन' },
                        { text: t('example5'), val: 'छात्रवृत्ति' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendText(item.text)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '20px',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            border: '1px solid #bfdbfe',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>🌾</span>
                          {item.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICE RECOMMENDATION VIEW */}
              {turnResponse?.state === 'SERVICE_RECOMMENDATION' && (
                <div style={{ maxWidth: '640px', margin: '20px auto' }}>
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div className="badge badge-confirmed">
                        {turnResponse.service?.directApplicationSupported ? 'Direct Voice Form Ready' : 'Guidance Available'}
                      </div>
                      <span className="badge badge-demo">Demo Scheme</span>
                    </div>

                    <h3 style={{ fontSize: '22px', color: 'var(--primary)', marginBottom: '8px' }}>
                      {turnResponse.service?.name[language] || turnResponse.service?.name.en}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px' }}>
                      {turnResponse.service?.description[language] || turnResponse.service?.description.en}
                    </p>

                    <div style={{ backgroundColor: 'var(--primary-light)', padding: '14px', borderRadius: '8px', marginBottom: '20px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '14px', marginBottom: '4px' }}>
                        💡 {language === 'hi' ? 'सिफ़ारिश का कारण' : (language === 'mr' ? 'शिफारशीचे कारण' : 'Why this is recommended')}
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                        {turnResponse.assistantMessage[language] || turnResponse.assistantMessage.hi}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {turnResponse.service?.directApplicationSupported ? (
                        <button
                          onClick={() => handleAction('APPLY_NOW', turnResponse.service?.serviceId)}
                          className="btn-primary"
                          style={{ flex: 1 }}
                        >
                          <ChevronRight size={18} />
                          {t('applyNow')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSendText(turnResponse.service?.serviceId || '')}
                          className="btn-primary"
                          style={{ flex: 1 }}
                        >
                          <FileText size={18} />
                          {t('howToApply')}
                        </button>
                      )}
                      <button
                        onClick={() => handleAction('RESTART')}
                        className="btn-secondary"
                      >
                        <RotateCcw size={16} />
                        {language === 'hi' ? 'अन्य सेवा खोजें' : 'इतर सेवा शोधा'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* GUIDANCE MODE VIEW */}
              {turnResponse?.state === 'GUIDANCE' && turnResponse.guidanceInfo && (
                <div style={{ maxWidth: '680px', margin: '20px auto' }}>
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', marginBottom: '12px', fontWeight: 600 }}>
                      <AlertTriangle size={20} />
                      <span>{t('howToApply')}</span>
                    </div>

                    {(() => {
                      const guidance = turnResponse.guidanceInfo as any;
                      return (
                        <>
                          <h3 style={{ fontSize: '22px', color: 'var(--primary)', marginBottom: '8px' }}>
                            {String(guidance.title || '')}
                          </h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '20px' }}>
                            {String(guidance.description || '')}
                          </p>

                          {/* Required Documents */}
                          <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>
                              📋 {t('requiredDocs')}
                            </h4>
                            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8 }}>
                              {guidance.requiredDocuments?.map((doc: string, idx: number) => (
                                <li key={idx}>{doc}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Step by step process */}
                          <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '10px', color: 'var(--text-main)' }}>
                              🗺️ {language === 'hi' ? 'आवेदन के चरण' : (language === 'mr' ? 'अर्जाच्या पायऱ्या' : 'Application Steps')}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {guidance.applicationSteps?.map((st: any) => (
                                <div key={st.step} style={{ display: 'flex', gap: '12px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
                                    {st.step}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{st.title}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{st.details}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Official source reference */}
                          <div style={{ backgroundColor: '#f1f5f9', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                              <strong>{t('officialSource')}:</strong> {String(guidance.officialSource || 'Official State Portal')}
                            </div>
                            <ExternalLink size={16} color="var(--primary)" />
                          </div>

                          {/* Prototype disclaimer */}
                          <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginBottom: '20px' }}>
                            ℹ️ {String(guidance.disclaimer || '')}
                          </div>
                        </>
                      );
                    })()}

                    <button
                      onClick={() => handleAction('RESTART')}
                      className="btn-primary"
                      style={{ width: '100%' }}
                    >
                      <ArrowLeft size={16} />
                      {language === 'hi' ? 'मुख्य पृष्ठ पर लौटें' : 'मुख्य पानावर परत जा'}
                    </button>
                  </div>
                </div>
              )}

              {/* VOICE FORM COLLECTION & CONFIRMATION VIEW */}
              {(turnResponse?.state === 'ASK_FIELD' ||
                turnResponse?.state === 'AWAIT_ANSWER' ||
                turnResponse?.state === 'CONFIRM_FIELD' ||
                turnResponse?.state === 'FALLBACK_INPUT') && (
                <div style={{ maxWidth: '720px', margin: '20px auto' }}>
                  {/* Progress Header */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>
                        {t('step')} {turnResponse.fieldIndex + 1} {t('of')} {turnResponse.totalFields}: {turnResponse.currentField?.label[language]}
                      </span>
                      <span>{Math.round(((turnResponse.fieldIndex + (turnResponse.state === 'CONFIRM_FIELD' ? 1 : 0)) / turnResponse.totalFields) * 100)}%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${((turnResponse.fieldIndex + (turnResponse.state === 'CONFIRM_FIELD' ? 1 : 0)) / turnResponse.totalFields) * 100}%`,
                          backgroundColor: 'var(--primary)',
                          transition: 'width 0.3s'
                        }}
                      />
                    </div>
                  </div>

                  {/* Question Card */}
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-md)',
                      marginBottom: '20px'
                    }}
                  >
                    {/* Spoken message bubble */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
                      <button
                        onClick={() => speakMessage(turnResponse.assistantMessage[language] || turnResponse.assistantMessage.hi, language)}
                        style={{
                          backgroundColor: 'var(--primary-light)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '42px',
                          height: '42px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                        title={t('repeat')}
                      >
                        <Volume2 size={22} />
                      </button>
                      <div>
                        <h3 style={{ fontSize: '20px', color: 'var(--primary)', fontWeight: 600 }}>
                          {turnResponse.assistantMessage[language] || turnResponse.assistantMessage.hi}
                        </h3>
                        {turnResponse.currentField?.helpText && (
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            💡 {turnResponse.currentField.helpText[language]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CONFIRMATION STATE CONTROLS */}
                    {turnResponse.state === 'CONFIRM_FIELD' ? (
                      <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleAction('CONFIRM_YES')}
                            className="btn-success"
                            style={{ padding: '14px 28px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                          >
                            <Check size={20} />
                            {t('yesCorrect')}
                          </button>
                          <button
                            onClick={() => handleAction('CONFIRM_NO')}
                            className="btn-secondary"
                            style={{ padding: '14px 24px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                          >
                            <X size={20} />
                            {t('noChange')}
                          </button>
                        </div>
                      </div>
                    ) : turnResponse.state === 'FALLBACK_INPUT' ? (
                      /* LEVEL 2: MANUAL TYPED / FIELD-SPECIFIC INPUT */
                      <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', marginBottom: '16px' }}>
                        <div style={{ fontWeight: 600, color: '#92400e', marginBottom: '8px', fontSize: '14px' }}>
                          ⌨️ {language === 'hi' ? 'वैकल्पिक मैनुअल इनपुट' : (language === 'mr' ? 'पर्यायी मॅन्युअल इनपुट' : 'Direct Manual Input')}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type={turnResponse.currentField?.type === 'digits' ? 'tel' : 'text'}
                            placeholder={turnResponse.currentField?.placeholder?.[language] || 'Enter value'}
                            value={manualFieldValue}
                            onChange={(e) => setManualFieldValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAction('SUBMIT_MANUAL_FIELD', manualFieldValue, turnResponse.currentField?.id)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: '6px',
                              border: '1px solid #d97706',
                              fontSize: '16px'
                            }}
                          />
                          <button
                            onClick={() => handleAction('SUBMIT_MANUAL_FIELD', manualFieldValue, turnResponse.currentField?.id)}
                            className="btn-primary"
                          >
                            <Check size={18} />
                            {language === 'hi' ? 'दर्ज करें' : 'दाखल करा'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* NORMAL VOICE / LEVEL 1 COLLECTION */
                      <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <button
                          onClick={handleToggleListening}
                          className={isListening ? 'mic-active' : ''}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--saffron)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-lg)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isListening ? <MicOff size={36} /> : <Mic size={36} />}
                        </button>
                        <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: 600, color: isListening ? 'var(--saffron)' : 'var(--text-muted)' }}>
                          {isListening ? t('listening') : t('micTapPrompt')}
                        </div>

                        {/* Live Transcript / Subtitle */}
                        {liveTranscript && (
                          <div style={{ marginTop: '12px', padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: '6px', display: 'inline-block', fontStyle: 'italic' }}>
                            "{liveTranscript}"
                          </div>
                        )}

                        {/* Direct Typed Input option */}
                        <div style={{ display: 'flex', gap: '8px', maxWidth: '480px', margin: '20px auto 0' }}>
                          <input
                            type="text"
                            placeholder={t('typeInstead')}
                            value={typedInput}
                            onChange={(e) => setTypedInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendText(typedInput)}
                            style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                          />
                          <button onClick={() => handleSendText(typedInput)} className="btn-secondary">
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Controls: Repeat, Back, Help */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleAction('BACK')}
                          disabled={turnResponse.fieldIndex === 0}
                          className="btn-secondary"
                          style={{ padding: '8px 14px', fontSize: '13px' }}
                        >
                          <ArrowLeft size={14} />
                          {t('back')}
                        </button>
                        <button
                          onClick={() => handleAction('REPEAT')}
                          className="btn-secondary"
                          style={{ padding: '8px 14px', fontSize: '13px' }}
                        >
                          <RotateCcw size={14} />
                          {t('repeat')}
                        </button>
                      </div>

                      <button
                        onClick={() => handleAction('HELP')}
                        style={{
                          backgroundColor: '#fef2f2',
                          color: '#b91c1c',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          padding: '8px 14px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <HelpCircle size={14} />
                        {t('help')}
                      </button>
                    </div>
                  </div>

                  {/* Form Overview Sidebar / Panel */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      📋 {language === 'hi' ? 'फॉर्म की स्थिति' : (language === 'mr' ? 'अर्जाची स्थिती' : 'Form Progress')}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      {Object.entries(turnResponse.fieldStatuses).map(([fid, fstat]) => {
                        const val = turnResponse.formData[fid];
                        return (
                          <div
                            key={fid}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              backgroundColor: fstat === 'confirmed' ? 'var(--green-light)' : (fstat === 'captured' ? 'var(--primary-light)' : '#f8fafc'),
                              border: `1px solid ${fstat === 'confirmed' ? '#bbf7d0' : (fstat === 'captured' ? '#bfdbfe' : '#e2e8f0')}`,
                              fontSize: '13px'
                            }}
                          >
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{fid}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {val ? String(val) : '—'} ({fstat})
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* FINAL REVIEW VIEW */}
              {turnResponse?.state === 'FINAL_REVIEW' && (
                <div style={{ maxWidth: '680px', margin: '20px auto' }}>
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <CheckCircle size={36} color="var(--green)" />
                      <h3 style={{ fontSize: '22px', color: 'var(--primary)', marginTop: '8px' }}>
                        {t('finalReviewTitle')}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        {t('finalReviewSubtitle')}
                      </p>
                    </div>

                    {/* Table of collected fields with edit capability */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                      {Object.entries(turnResponse.formData).map(([k, v]) => {
                        // Mask Aadhaar/mobile for display
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
                              padding: '12px 16px',
                              backgroundColor: '#f8fafc',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                                {k.replace('_', ' ')}
                              </div>
                              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
                                {displayVal}
                              </div>
                            </div>
                            <button
                              onClick={() => handleAction('SUBMIT_MANUAL_FIELD', v, k)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '13px'
                              }}
                            >
                              <Edit2 size={14} />
                              {language === 'hi' ? 'बदलें' : 'बदला'}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleAction('CONFIRM_YES')}
                      disabled={isLoading}
                      className="btn-success"
                      style={{ width: '100%', padding: '14px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <Check size={20} />
                      {isLoading ? t('processing') : t('submit')}
                    </button>
                  </div>
                </div>
              )}

              {/* SUBMISSION RESULT / SUCCESS VIEW */}
              {turnResponse?.state === 'DONE' && (
                <div style={{ maxWidth: '640px', margin: '20px auto', textAlign: 'center' }}>
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '36px 24px',
                      border: '1px solid #bbf7d0',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--green-light)',
                        color: 'var(--green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                      }}
                    >
                      <CheckCircle size={44} />
                    </div>

                    <h2 style={{ fontSize: '24px', color: 'var(--green)', fontWeight: 700, marginBottom: '8px' }}>
                      {t('submittedSuccess')}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px' }}>
                      {turnResponse.assistantMessage[language] || turnResponse.assistantMessage.hi}
                    </p>

                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('appIdLabel')}</div>
                      <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px', margin: '4px 0' }}>
                        {turnResponse.submissionResult?.applicationId || 'DEMO-PMK-20261009-001'}
                      </div>
                      <div className="badge badge-demo" style={{ marginTop: '6px' }}>
                        {turnResponse.submissionResult?.status || 'SUBMITTED (DEMO)'}
                      </div>
                    </div>

                    <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', marginBottom: '28px', padding: '0 20px' }}>
                      🛡️ {t('demoDisclaimer')}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                        onClick={() => {
                          setSearchAppId(turnResponse.submissionResult?.applicationId || '');
                          setActiveTab('track');
                          handleCheckStatus();
                        }}
                        className="btn-primary"
                      >
                        <Search size={16} />
                        {t('trackStatus')}
                      </button>
                      <button
                        onClick={() => handleAction('RESTART')}
                        className="btn-secondary"
                      >
                        <RotateCcw size={16} />
                        {t('startNew')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* LEVEL 3 OPERATOR HANDOFF VIEW */}
              {turnResponse?.state === 'HANDOFF' && (
                <div style={{ maxWidth: '640px', margin: '20px auto' }}>
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid #fecaca',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626', marginBottom: '12px' }}>
                      <HelpCircle size={24} />
                      <h3 style={{ fontSize: '20px', fontWeight: 700 }}>
                        {language === 'hi' ? 'सहायता प्रकरण दर्ज किया गया' : (language === 'mr' ? 'मदत प्रकरण नोंदवले गेले' : 'Assistance Case Created')}
                      </h3>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '20px' }}>
                      {turnResponse.assistantMessage[language] || turnResponse.assistantMessage.hi}
                    </p>

                    <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '13px', color: '#991b1b' }}>Case Tracking ID:</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#b91c1c' }}>
                        {handoffRecord?.handoffId || `HO-${sessionId.slice(0, 8).toUpperCase()}`}
                      </div>
                      <div style={{ fontSize: '13px', color: '#7f1d1d', marginTop: '6px' }}>
                        Status: <strong>QUEUED_FOR_ASSISTANCE</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAction('RESTART')}
                      className="btn-primary"
                      style={{ width: '100%' }}
                    >
                      <RotateCcw size={16} />
                      {t('startNew')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STATUS TRACKER */}
          {activeTab === 'track' && (
            <div style={{ maxWidth: '600px', margin: '20px auto' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--primary)', marginBottom: '8px' }}>
                  {t('trackStatus')}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  {language === 'hi' ? 'अपने आवेदन की वर्तमान स्थिति जानने के लिए डेमो आवेदन क्रमांक दर्ज करें।' : 'आपल्या अर्जाची सद्यस्थिती तपासण्यासाठी डेमो अर्ज क्रमांक टाका.'}
                </p>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  <input
                    type="text"
                    placeholder={t('enterAppId')}
                    value={searchAppId}
                    onChange={(e) => setSearchAppId(e.target.value)}
                    style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '15px' }}
                  />
                  <button onClick={handleCheckStatus} disabled={isLoading} className="btn-primary">
                    <Search size={16} />
                    {t('check')}
                  </button>
                </div>

                {searchedStatus && (
                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{searchedStatus.serviceName}</span>
                      <span className="badge badge-confirmed">{searchedStatus.status}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                      <div>Application ID: <strong>{searchedStatus.applicationId}</strong></div>
                      <div>Submitted At: {searchedStatus.submittedAt}</div>
                      <div>Demo Mode: <strong>Active (Simulated Portal)</strong></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: OPERATOR HANDOFF */}
          {activeTab === 'operator' && (
            <div style={{ maxWidth: '680px', margin: '20px auto' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <HelpCircle size={22} color="var(--primary)" />
                  <h3 style={{ fontSize: '20px', color: 'var(--primary)' }}>Public Service Operator Cases</h3>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Level 3 handoff tickets created when citizens request operator assistance or encounter repeated validation hurdles.
                </p>

                {handoffRecord ? (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{handoffRecord.handoffId}</span>
                      <span className="badge badge-demo">{handoffRecord.status}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                      <div>Session ID: {handoffRecord.sessionId}</div>
                      <div>Citizen Language: <strong>{handoffRecord.language?.toUpperCase()}</strong></div>
                      <div>Handoff Reason: <em>{handoffRecord.reason}</em></div>
                      <div>Failing Field: <strong>{handoffRecord.failingField || 'N/A'}</strong></div>
                    </div>

                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                        Masked Form Data Snapshot:
                      </div>
                      <pre style={{ fontSize: '12px', background: '#ffffff', padding: '8px', borderRadius: '4px', overflowX: 'auto' }}>
                        {JSON.stringify(handoffRecord.formDataSnapshot, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    No active handoff cases yet. Try speaking "Help" or "मदद चाहिए" in the assistant to generate a ticket.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: EVALUATION & WER LAB */}
          {activeTab === 'eval' && (
            <div style={{ maxWidth: '780px', margin: '20px auto' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--primary)', marginBottom: '6px' }}>
                  {t('evalTitle')}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Calculates Word Error Rate using the Levenshtein dynamic programming alignment: <code>WER = (S + D + I) / N</code>
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      {t('refText')}
                    </label>
                    <textarea
                      rows={3}
                      value={refText}
                      onChange={(e) => setRefText(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      {t('hypText')}
                    </label>
                    <textarea
                      rows={3}
                      value={hypText}
                      onChange={(e) => setHypText(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <button onClick={handleCalcWer} className="btn-primary">
                    <Activity size={16} />
                    {t('calcWer')}
                  </button>
                  <button
                    onClick={() => {
                      setRefText('मला शेतकरी योजनेसाठी अर्ज करायचा आहे');
                      setHypText('मला शेतकरी योजना अर्ज करायचा आहे');
                    }}
                    className="btn-secondary"
                  >
                    Load Marathi Sample
                  </button>
                </div>

                {werResult && (
                  <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>{werResult.werPercentage}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Word Error Rate (WER)</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#dc2626' }}>{werResult.substitutions}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Substitutions (S)</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#ea580c' }}>{werResult.deletions}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Deletions (D)</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#0284c7' }}>{werResult.insertions}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Insertions (I)</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* System Metrics Cards */}
              {metricsData && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '18px', color: 'var(--primary)', marginBottom: '16px' }}>System Performance Metrics</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--primary-light)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>Total Sessions</div>
                      <div style={{ fontSize: '22px', fontWeight: 700 }}>{metricsData.totalSessions}</div>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--green-light)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600 }}>Completion Rate</div>
                      <div style={{ fontSize: '22px', fontWeight: 700 }}>{metricsData.completionRate}%</div>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#f1f5f9' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Turn Latency</div>
                      <div style={{ fontSize: '22px', fontWeight: 700 }}>{metricsData.averageLatencyMs} ms</div>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#fff7ed' }}>
                      <div style={{ fontSize: '12px', color: '#c2410c', fontWeight: 600 }}>Handoff Cases</div>
                      <div style={{ fontSize: '22px', fontWeight: 700 }}>{metricsData.handoffCount}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ARCHITECTURE ABOUT */}
          {activeTab === 'about' && (
            <div style={{ maxWidth: '720px', margin: '20px auto' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '22px', color: 'var(--primary)', marginBottom: '12px' }}>
                  SevaVaani Architecture & Design Tenets
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px' }}>
                  SevaVaani is an honest, voice-first public service assistant designed to bridge digital divides for Indian citizens through Hindi and Marathi voice interaction.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontWeight: 700, color: '#1e40af' }}>1. AI = Understanding</div>
                    <div style={{ fontSize: '13px', color: '#1e3a8a', marginTop: '4px' }}>
                      Language models extract intents and structured values. They never control business workflow state.
                    </div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontWeight: 700, color: '#166534' }}>2. Code = Control</div>
                    <div style={{ fontSize: '13px', color: '#14532d', marginTop: '4px' }}>
                      Deterministic 14-state state machine orchestrates conversation progression and error recovery.
                    </div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
                    <div style={{ fontWeight: 700, color: '#c2410c' }}>3. Rules = Validation</div>
                    <div style={{ fontSize: '13px', color: '#7c2d12', marginTop: '4px' }}>
                      Deterministic eligibility rules and validators prevent hallucinations and ensure safe dummy handling.
                    </div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#faf5ff', border: '1px solid #e9d5ff' }}>
                    <div style={{ fontWeight: 700, color: '#6b21a8' }}>4. Adapter = Submission</div>
                    <div style={{ fontSize: '13px', color: '#581c87', marginTop: '4px' }}>
                      Demo adapters provide simulated application IDs without faking live government submissions.
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  <div><strong>Fully Implemented Vertical Slice:</strong> PM-Kisan Farmer Registration (7 fields, voice confirmation, demo submission)</div>
                  <div><strong>Discovery & Guidance Schemes:</strong> Ration Card, Old Age Pension, Student Scholarship, PM-Awas Housing</div>
                  <div><strong>Zero-Dependency Mode:</strong> Complete functionality works in Mock Mode with zero external API requirements.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '16px 20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
        <div className="container">
          SevaVaani — Unified Multilingual Government Service Assistant Prototype | Built for Public Service Accessibility
        </div>
      </footer>
    </div>
  );
}

export default App;
