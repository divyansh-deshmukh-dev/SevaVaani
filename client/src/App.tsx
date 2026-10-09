import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Search,
  Layers,
  FileText,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { apiClient } from './api/client';
import { speechService } from './audio/speech';
import { getTranslation } from './i18n';
import type {
  LanguageCode,
  TurnResponse,
  CitizenUser,
  ApplicationRecord,
  NotificationItem,
  AccessibilitySettings,
  ServiceDefinition,
  VoiceState
} from './types';

// Component imports
import { Header } from './components/Header';
import { VoiceAssistantWidget } from './components/VoiceAssistantWidget';
import { AuthModal } from './components/AuthModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { AccessibilityModal } from './components/AccessibilityModal';
import { ServicesView } from './components/ServicesView';
import { ApplicationLauncherView } from './components/ApplicationLauncherView';
import { ServiceDetailView } from './components/ServiceDetailView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FALLBACK_SERVICES } from './data/fallbackServices';
import { ApplicationsView } from './components/ApplicationsView';
import { TrackStatusView } from './components/TrackStatusView';
import { DocumentsView } from './components/DocumentsView';
import { HelpView } from './components/HelpView';
import { OperatorView } from './components/OperatorView';
import { OperatorPortal } from './components/OperatorPortal';
import { EvalLabView } from './components/EvalLabView';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';

export function App() {
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [activeTab, setActiveTab] = useState<
    'assistant' | 'services' | 'launcher' | 'service_detail' | 'applications' | 'track' | 'docs' | 'help' | 'operator' | 'eval' | 'about'
  >('assistant');
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceDefinition | null>(null);


  // Session & Voice Engine state
  const [turnResponse, setTurnResponse] = useState<TurnResponse | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [typedInput, setTypedInput] = useState<string>('');
  const [manualFieldValue, setManualFieldValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isTurnInFlightRef = useRef<boolean>(false);

  // Status Tracker & Operator states
  const [searchAppId, setSearchAppId] = useState<string>('DEMO-PMK-20261009-001');
  const [searchedStatus, setSearchedStatus] = useState<any>(null);
  const [handoffRecord, setHandoffRecord] = useState<any>(null);

  // Evaluation Lab state
  const [refText, setRefText] = useState<string>('मेरा नाम रमेश कुमार है');
  const [hypText, setHypText] = useState<string>('मेरा नाम रमेश कुमार है');
  const [werResult, setWerResult] = useState<any>(null);
  const [metricsData, setMetricsData] = useState<any>(null);

  // Services Catalog
  const [services, setServices] = useState<ServiceDefinition[]>(FALLBACK_SERVICES);

  // User Profile
  const [user, setUser] = useState<CitizenUser>({
    name: 'Ramesh Kumar',
    mobile: '9876543210',
    maskedAadhaar: 'XXXX-XXXX-1100',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    village: 'Shivpur',
    isGuest: false,
    isAuthenticated: true,
    role: 'citizen'
  });

  // Applications List
  const [applications, setApplications] = useState<ApplicationRecord[]>([
    {
      applicationId: 'DEMO-PMK-20261009-001',
      serviceId: 'pm_kisan',
      serviceName: 'पीएम-किसान सम्मान निधि किसान पंजीकरण',
      date: '2026-10-09',
      status: 'UNDER_REVIEW (DEMO)',
      step: 7,
      totalSteps: 7,
      isDemo: true,
      formData: {
        full_name: 'रमेश कुमार',
        aadhaar_number: 'XXXX-XXXX-1100',
        mobile_number: '9876543210',
        state_name: 'उत्तर प्रदेश',
        district_name: 'वाराणसी',
        land_holding_hectares: '1.5',
        bank_account_digits: '123456'
      },
      lastUpdated: '10:30 AM'
    }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'डिजिटल पब्लिक सर्विस प्रोटोटाइप सक्रिय',
      message: 'सेवावाणी प्रोटोटाइप एमवीपी डेमो मोड में संचालित हो रहा है।',
      timestamp: 'Today',
      type: 'demo',
      read: false
    },
    {
      id: 'notif-2',
      title: 'आवेदन अद्यतन (PM-Kisan)',
      message: 'डेमो आवेदन DEMO-PMK-20261009-001 वर्तमान में विभागीय समीक्षा में है।',
      timestamp: 'Today',
      type: 'info',
      read: false
    },
    {
      id: 'notif-3',
      title: 'बहुभाषी आवाज़ सहायता सक्रिय',
      message: 'हिंदी, मराठी और अंग्रेजी तीनों भाषाओं में 100% आवाज़ मार्गदर्शन उपलब्ध है।',
      timestamp: 'Today',
      type: 'info',
      read: true
    }
  ]);

  // Accessibility Settings
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    textSize: 'normal',
    highContrast: false,
    reducedMotion: false,
    voiceSpeed: 'normal'
  });

  // Modal Open states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  // Translation helper
  const t = (key: string, fallback?: string) => getTranslation(language, key, fallback);

  // Synchronize Accessibility Classes on Body
  useEffect(() => {
    document.body.classList.remove('font-large', 'font-xlarge', 'high-contrast', 'reduced-motion');
    if (accessibility.textSize === 'large') document.body.classList.add('font-large');
    if (accessibility.textSize === 'xlarge') document.body.classList.add('font-xlarge');
    if (accessibility.highContrast) document.body.classList.add('high-contrast');
    if (accessibility.reducedMotion) document.body.classList.add('reduced-motion');
  }, [accessibility]);

  // Synchronize Tab Title with Selected Language
  useEffect(() => {
    if (language === 'en') {
      document.title = 'SevaVaani - Unified Multilingual Government Service Assistant';
    } else if (language === 'mr') {
      document.title = 'सेवावाणी - एकीकृत बहुभाषिक सरकारी सेवा सहाय्यक';
    } else {
      document.title = 'सेवावाणी - एकीकृत बहुभाषी सरकारी सेवा सहायक';
    }
  }, [language]);

  // Initialize Session and Catalog on mount
  useEffect(() => {
    initSession(language);
    loadServicesCatalog();
  }, []);

  const loadServicesCatalog = async () => {
    try {
      const data = await apiClient.getServices();
      if (Array.isArray(data) && data.length > 0) {
        setServices(data);
      }
    } catch {
      // Fallback catalog remains active if backend is offline or delayed
    }
  };

  const initSession = async (lang: LanguageCode) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await apiClient.createSession(lang);
      setSessionId(res.sessionId);
      setTurnResponse(res);
      // Speak welcome message
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

  // URL Hash Routing and Browser History Synchronizer
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#service/')) {
        const sId = decodeURIComponent(hash.replace('#service/', '').trim());
        const found =
          services.find((s) => s.serviceId === sId || s.id === sId) ||
          FALLBACK_SERVICES.find((s) => s.serviceId === sId || s.id === sId);
        if (found) {
          setSelectedServiceForDetail(found);
          setActiveTab('service_detail');
        } else {
          setActiveTab('service_detail');
          setSelectedServiceForDetail(null);
        }
      } else if (hash === '#services') {
        setActiveTab('services');
        setSelectedServiceForDetail(null);
      } else if (hash === '#launcher') {
        setActiveTab('launcher');
        setSelectedServiceForDetail(null);
      } else if (hash === '#applications') {
        setActiveTab('applications');
        setSelectedServiceForDetail(null);
      } else if (hash === '#track') {
        setActiveTab('track');
        setSelectedServiceForDetail(null);
      } else if (hash === '#docs') {
        setActiveTab('docs');
        setSelectedServiceForDetail(null);
      } else if (hash === '#help') {
        setActiveTab('help');
        setSelectedServiceForDetail(null);
      } else if (hash === '#eval') {
        setActiveTab('eval');
        setSelectedServiceForDetail(null);
      } else if (hash === '#about') {
        setActiveTab('about');
        setSelectedServiceForDetail(null);
      } else if (hash === '#operator') {
        setActiveTab('operator');
        setSelectedServiceForDetail(null);
      } else if (hash === '#assistant' || hash === '' || hash === '#') {
        setActiveTab('assistant');
        setSelectedServiceForDetail(null);
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    window.addEventListener('popstate', handleHashSync);
    return () => {
      window.removeEventListener('hashchange', handleHashSync);
      window.removeEventListener('popstate', handleHashSync);
    };
  }, [services]);

  const navigateToTab = (tab: any) => {
    setActiveTab(tab);
    setErrorMessage('');
    if (tab === 'services') window.location.hash = '#services';
    else if (tab === 'assistant') window.location.hash = '#assistant';
    else if (tab === 'launcher') window.location.hash = '#launcher';
    else if (tab === 'applications') window.location.hash = '#applications';
    else if (tab === 'track') window.location.hash = '#track';
    else if (tab === 'docs') window.location.hash = '#docs';
    else if (tab === 'help') window.location.hash = '#help';
    else if (tab === 'eval') window.location.hash = '#eval';
    else if (tab === 'about') window.location.hash = '#about';
    else if (tab === 'operator') window.location.hash = '#operator';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenServiceDetail = (service: ServiceDefinition) => {
    setSelectedServiceForDetail(service);
    setActiveTab('service_detail');
    setErrorMessage('');
    const sId = service.serviceId || service.id;
    if (sId) {
      window.location.hash = `#service/${sId}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setSelectedServiceForDetail(null);
    setActiveTab('services');
    window.location.hash = '#services';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyService = (serviceId: string) => {
    setActiveTab('assistant');
    window.location.hash = '#assistant';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleAction('APPLY_NOW', serviceId);
  };

  const speakMessage = async (text: string, lang: LanguageCode) => {
    setVoiceState('SPEAKING');
    const result = await speechService.speak(
      text,
      lang,
      () => {
        setVoiceState('IDLE');
      },
      () => {
        setVoiceState('IDLE');
      }
    );

    if (!result.spoken) {
      setVoiceState('IDLE');
      if (result.reason === 'no_voice') {
        const noticeKey =
          lang === 'mr'
            ? 'ttsVoiceUnavailableMr'
            : lang === 'hi'
            ? 'ttsVoiceUnavailable'
            : 'ttsVoiceUnavailableGeneric';
        setErrorMessage(t(noticeKey));
      }
    }
  };

  // Turn submission
  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim() || isTurnInFlightRef.current || isLoading) return;
    isTurnInFlightRef.current = true;
    setIsLoading(true);
    setVoiceState('PROCESSING');
    setErrorMessage('');
    setLiveTranscript('');
    speechService.stopListening();
    speechService.cancelSpeech();

    try {
      let activeSid = sessionId;
      if (!activeSid) {
        const initRes = await apiClient.createSession(language);
        activeSid = initRes.sessionId;
        setSessionId(initRes.sessionId);
      }

      let res: TurnResponse;
      try {
        res = await apiClient.sendTurn(activeSid, {
          text: textToSend.trim(),
          language
        });
      } catch (err: any) {
        if (err.message?.includes('Not Found') || err.message?.includes('404')) {
          // Auto-heal session after server restart
          const newSession = await apiClient.createSession(language);
          activeSid = newSession.sessionId;
          setSessionId(newSession.sessionId);
          res = await apiClient.sendTurn(activeSid, {
            text: textToSend.trim(),
            language
          });
        } else {
          throw err;
        }
      }

      setTurnResponse(res);
      setTypedInput('');
      handlePostTurnEffects(res);
      speakMessage(res.assistantMessage[language] || res.assistantMessage.hi, language);
    } catch (err: any) {
      setVoiceState('ERROR');
      setErrorMessage(err.message || 'Request failed. Please try again.');
    } finally {
      setIsLoading(false);
      isTurnInFlightRef.current = false;
    }
  };

  const handleAction = async (action: string, value?: unknown, fieldId?: string) => {
    setIsLoading(true);
    setVoiceState('PROCESSING');
    setErrorMessage('');
    speechService.stopListening();
    speechService.cancelSpeech();

    try {
      let activeSid = sessionId;
      if (!activeSid) {
        const initRes = await apiClient.createSession(language);
        activeSid = initRes.sessionId;
        setSessionId(initRes.sessionId);
      }

      let res: TurnResponse;
      try {
        res = await apiClient.sendAction(activeSid, {
          action,
          value,
          fieldId,
          language
        });
      } catch (err: any) {
        if (err.message?.includes('Not Found') || err.message?.includes('404')) {
          // Auto-heal session after server restart
          const newSession = await apiClient.createSession(language);
          activeSid = newSession.sessionId;
          setSessionId(newSession.sessionId);
          res = await apiClient.sendAction(activeSid, {
            action,
            value,
            fieldId,
            language
          });
        } else {
          throw err;
        }
      }

      setTurnResponse(res);
      setManualFieldValue('');
      handlePostTurnEffects(res);
      speakMessage(res.assistantMessage[language] || res.assistantMessage.hi, language);

      // If handoff triggered, record it
      if (res.state === 'HANDOFF') {
        const h = await apiClient.getHandoff(activeSid);
        setHandoffRecord(h);
      }
    } catch (err: any) {
      setVoiceState('ERROR');
      setErrorMessage(err.message || 'Action failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update application records and notifications upon final submission
  const handlePostTurnEffects = (res: TurnResponse) => {
    if (res.state === 'DONE' && res.submissionResult?.success) {
      const newApp: ApplicationRecord = {
        applicationId: res.submissionResult.applicationId,
        serviceId: res.service?.serviceId || 'pm_kisan',
        serviceName: res.service?.name[language] || 'PM-Kisan Samman Nidhi',
        date: new Date().toISOString().split('T')[0],
        status: 'SUBMITTED (DEMO)',
        step: 7,
        totalSteps: 7,
        isDemo: true,
        formData: res.formData,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setApplications((prev) => [newApp, ...prev.filter((a) => a.applicationId !== newApp.applicationId)]);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'आवेदन सफलतापूर्वक जमा हुआ (डेमो)',
        message: `आपका आवेदन क्रमांक ${newApp.applicationId} सफलतापूर्वक दर्ज किया गया।`,
        timestamp: 'Just now',
        type: 'success',
        read: false
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Voice Recording trigger
  const handleToggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      setVoiceState('IDLE');
    } else {
      speechService.cancelSpeech();
      setIsListening(true);
      setVoiceState('LISTENING');
      setLiveTranscript('');
      setErrorMessage('');

      speechService.startListening(
        language,
        (transcript, isFinal) => {
          setLiveTranscript(transcript);
          if (isFinal) {
            setIsListening(false);
            if (!isTurnInFlightRef.current && !isLoading) {
              handleSendText(transcript);
            }
          }
        },
        (error) => {
          setIsListening(false);
          setVoiceState('ERROR');
          let errorKey = 'sttGenericError';
          switch (error.code) {
            case 'not-supported':
              errorKey = 'sttNotSupported';
              break;
            case 'not-allowed':
              errorKey = 'sttPermissionDenied';
              break;
            case 'no-speech':
              errorKey = 'sttNoSpeech';
              break;
            case 'network':
              errorKey = 'sttNetwork';
              break;
            case 'audio-capture':
              errorKey = 'sttAudioCapture';
              break;
            default:
              errorKey = 'sttGenericError';
          }
          setErrorMessage(t(errorKey));
        },
        () => {
          setIsListening(false);
          if (voiceState === 'LISTENING') setVoiceState('IDLE');
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
    } catch {}
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
    } catch {
      // Look up in local application list if not found in server mock
      const localMatch = applications.find((a) => a.applicationId.toLowerCase() === searchAppId.trim().toLowerCase());
      if (localMatch) {
        setSearchedStatus({
          applicationId: localMatch.applicationId,
          serviceId: localMatch.serviceId,
          serviceName: localMatch.serviceName,
          status: localMatch.status,
          submittedAt: localMatch.date,
          isDemo: true
        });
      } else {
        setErrorMessage('Application ID not found in demo records.');
        setSearchedStatus(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateApplicationStatus = (appId: string, newStatus: string, remarks?: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.applicationId === appId
          ? {
              ...app,
              status: newStatus as any,
              officerRemarks: remarks,
              reviewer: user.name,
              lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : app
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Dedicated Operator Portal Return for authenticated operators
  if (user.role === 'operator' && user.isAuthenticated) {
    return (
      <OperatorPortal
        user={user}
        language={language}
        onLanguageChange={handleLanguageChange}
        applications={applications}
        onUpdateApplicationStatus={handleUpdateApplicationStatus}
        handoffRecord={handoffRecord}
        services={services}
        onSwitchToCitizen={() => {
          setUser({
            name: 'Ramesh Kumar',
            mobile: '9876543210',
            maskedAadhaar: 'XXXX-XXXX-1100',
            state: 'Uttar Pradesh',
            district: 'Varanasi',
            village: 'Shivpur',
            isGuest: false,
            isAuthenticated: true,
            role: 'citizen'
          });
          setActiveTab('assistant');
        }}
        onSignOut={() => {
          setUser({
            name: 'Guest Citizen',
            mobile: '',
            maskedAadhaar: '',
            state: '',
            district: '',
            village: '',
            isGuest: true,
            isAuthenticated: false,
            role: 'citizen'
          });
          setActiveTab('assistant');
        }}
        t={t}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header with Statutory Notice & Navigation */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onTabChange={(tab) => {
          navigateToTab(tab);
        }}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        unreadCount={unreadCount}
        t={t}
      />

      {/* 2. Global Error Banner */}
      {errorMessage && (
        <div className="gov-container-wide" style={{ marginTop: '12px' }}>
          <div
            style={{
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              padding: '12px 18px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '1.5px solid #fecaca',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            <AlertTriangle size={18} />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* 3. Main Content Views */}
      <main style={{ flex: 1 }}>
        <ErrorBoundary onReset={handleBackFromDetail}>
          {/* VIEW 1: HOME & CITIZEN ASSISTANT */}
          {activeTab === 'assistant' && (
          <div>
            {/* HERO SECTION WITH EMBEDDED VOICE ASSISTANT */}
            <section className="hero-section">
              <div className="gov-container-wide">
                {/* Mobile Voice Hero Header (Visible only on mobile <= 880px) */}
                <div className="show-on-mobile hero-mobile-intro">
                  <h2 className="hero-mobile-title">
                    {t('heroMobileTitle', 'सरकारी सेवाएं, आपकी अपनी आवाज़ में।')}
                  </h2>
                  <p className="hero-mobile-sub">
                    {t('heroMobileSub', 'सेवा बताएं या अपनी समस्या साझा करें।')}
                  </p>
                </div>

                <div className="hero-grid">
                  {/* Left Column: Hero Headlines & Value Props (Visible on desktop) */}
                  <div className="hero-text-col hide-on-mobile">
                    {/* Badge */}
                    <div className="hero-badge">
                      <span className="hero-badge-dot" />
                      <span>{t('heroBadge')}</span>
                    </div>

                    {/* Dual-script title */}
                    <h2 className="hero-title">
                      {t('heroTitle', 'सशक्त नागरिक, पारदर्शी भारत।')}
                    </h2>

                    <h3 className="hero-subtitle">
                      {t('heroSubtitle', 'आपकी अपनी आवाज़ में, सरल और सुगम सरकारी सेवाएं।')}
                    </h3>

                    <p className="hero-desc">
                      {t('heroDesc')}
                    </p>

                    {/* 3 KPI Feature Stat Cards */}
                    <div className="kpi-grid">
                      <div className="kpi-card">
                        <div className="kpi-card-title">
                          {t('kpiVoiceFactual', 'आवाज़-निर्देशित सहायता')}
                        </div>
                        <div className="kpi-card-sub">
                          {t('kpiVoiceSubFactual', 'चरणबद्ध फॉर्म व मार्गदर्शन')}
                        </div>
                      </div>

                      <div className="kpi-card">
                        <div className="kpi-card-title">
                          {t('kpiLangs', '3 भाषाएं उपलब्ध')}
                        </div>
                        <div className="kpi-card-sub">
                          {t('kpiLangsSub', 'हिंदी • मराठी • English')}
                        </div>
                      </div>

                      <div className="kpi-card">
                        <div className="kpi-card-title">
                          {t('kpiHonestFactual', 'पारदर्शी प्रोटोटाइप')}
                        </div>
                        <div className="kpi-card-sub">
                          {t('kpiHonestSubFactual', 'डेमो सत्यापन प्रणाली')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Embedded Voice Assistant Widget (Voice-first on mobile) */}
                  <div className="hero-voice-col">
                    <VoiceAssistantWidget
                      language={language}
                      turnResponse={turnResponse}
                      sessionId={sessionId}
                      isListening={isListening}
                      liveTranscript={liveTranscript}
                      typedInput={typedInput}
                      manualFieldValue={manualFieldValue}
                      isLoading={isLoading}
                      voiceState={voiceState}
                      onToggleListening={handleToggleListening}
                      onSendText={handleSendText}
                      onAction={handleAction}
                      onSpeakMessage={speakMessage}
                      onSetTypedInput={setTypedInput}
                      onSetManualFieldValue={setManualFieldValue}
                      onStartTracking={(appId) => {
                        setSearchAppId(appId);
                        setActiveTab('track');
                        handleCheckStatus();
                      }}
                      onOpenServiceDetail={handleOpenServiceDetail}
                      t={t}
                    />

                    {/* Compact Factual KPI Row on Mobile */}
                    <div className="kpi-mobile-row">
                      <span className="kpi-mobile-badge">
                        🎤 {t('kpiVoiceFactual', 'आवाज़-निर्देशित सहायता')}
                      </span>
                      <span className="kpi-mobile-badge">
                        🌐 {t('kpiLangs', '3 भाषाएं')}
                      </span>
                      <span className="kpi-mobile-badge">
                        🛡️ {t('kpiHonestFactual', 'पारदर्शी प्रोटोटाइप')}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* QUICK ACTIONS SECTION */}
            <section style={{ padding: '36px 0', backgroundColor: '#f8fafc' }}>
              <div className="gov-container-wide">
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0d4436', marginBottom: '16px' }}>
                  {t('quickActionsTitle', 'आप क्या करना चाहते हैं?')}
                </h3>

                <div className="quick-actions-grid">
                  {[
                    {
                      title: t('qaSearchTitle', 'सेवा खोजें'),
                      desc: t('qaSearchDesc', 'सरकारी योजनाएं खोजें'),
                      icon: Layers,
                      color: '#0d4436',
                      bg: '#ecfdf5',
                      border: '#a7f3d0',
                      action: () => setActiveTab('services')
                    },
                    {
                      title: t('qaApplyTitle', 'आवेदन करें'),
                      desc: t('qaApplyDesc', 'ऑनलाइन आवेदन शुरू करें'),
                      icon: Mic,
                      color: '#c2410c',
                      bg: '#fff7ed',
                      border: '#fed7aa',
                      action: () => setActiveTab('launcher')
                    },
                    {
                      title: t('qaStatusTitle', 'आवेदन की स्थिति'),
                      desc: t('qaStatusDesc', 'क्रमांक डालकर स्थिति देखें'),
                      icon: Search,
                      color: '#1e40af',
                      bg: '#eff6ff',
                      border: '#bfdbfe',
                      action: () => setActiveTab('applications')
                    },
                    {
                      title: t('qaDocsTitle', 'जरूरी दस्तावेज़'),
                      desc: t('qaDocsDesc', 'आवश्यक कागजात सूची'),
                      icon: FileText,
                      color: '#065f46',
                      bg: '#f0fdf4',
                      border: '#bbf7d0',
                      action: () => setActiveTab('docs')
                    },
                    {
                      title: t('qaHelpTitle', 'सहायता पाएं'),
                      desc: t('qaHelpDesc', 'ऑपरेटर सहायता व सवाल'),
                      icon: HelpCircle,
                      color: '#7c2d12',
                      bg: '#fef2f2',
                      border: '#fecaca',
                      action: () => setActiveTab('help')
                    }
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={idx}
                        onClick={card.action}
                        style={{
                          backgroundColor: '#ffffff',
                          border: `1.5px solid ${card.border}`,
                          borderRadius: '12px',
                          padding: '18px 16px',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-xs)',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            backgroundColor: card.bg,
                            color: card.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '12px'
                          }}
                        >
                          <Icon size={20} />
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>
                          {card.title}
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                          {card.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* KEY WELFARE SCHEMES DIRECTORY (SUMMARY PREVIEW) */}
            <section style={{ padding: '36px 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
              <div className="gov-container-wide">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0d4436' }}>
                      {t('popularServicesTitle', 'लोकप्रिय सरकारी सेवाएं')}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                      {t('popularServicesSub', 'उपलब्ध जन कल्याणकारी योजनाएं एवं ऑनलाइन डेमो सुविधाएं')}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('services')}
                    className="btn-gov-ghost"
                    style={{ fontSize: '13px' }}
                  >
                    {t('viewAllServices', 'सभी सेवाएं देखें')} <ArrowRight size={14} />
                  </button>
                </div>

                <div className="popular-services-grid">
                  {services.slice(0, 3).map((service) => {
                    const isDirect = service.applicationMode === 'direct-demo' || service.directApplicationSupported === true;
                    const serviceName = service.name[language] || service.name.hi;
                    const serviceDesc = service.description[language] || service.description.hi;

                    return (
                      <div
                        key={service.serviceId}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '14px',
                          border: isDirect ? '2px solid #86efac' : '1px solid #cbd5e1',
                          boxShadow: 'var(--shadow-sm)',
                          padding: '22px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span className={`badge-gov ${isDirect ? 'badge-gov-green' : 'badge-gov-blue'}`}>
                              {isDirect ? `✓ ${t('onlineDemoAvailable', 'ऑनलाइन डेमो आवेदन उपलब्ध')}` : t('guidanceAvailable', 'मार्गदर्शन उपलब्ध')}
                            </span>
                            <span className="badge-gov badge-gov-proto">
                              {t('prototypeBadge', 'डेमो')}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0d4436', marginBottom: '6px' }}>
                            {serviceName}
                          </h4>
                          <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                            {serviceDesc}
                          </p>
                        </div>
                        {isDirect ? (
                          <button
                            onClick={() => handleApplyService(service.serviceId)}
                            className="btn-gov-primary"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                          >
                            <Mic size={16} />
                            {t('applyNow', 'आवेदन करें (आवाज़ से)')}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenServiceDetail(service)}
                            className="btn-gov-outline"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                          >
                            <FileText size={16} />
                            {t('howToApply', 'आवेदन मार्गदर्शन')}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* HOW SEVAVAANI WORKS (4-STEP WORKFLOW) */}
            <section style={{ padding: '44px 0', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border-light)' }}>
              <div className="gov-container-wide">
                <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0d4436', marginBottom: '6px' }}>
                    {t('howItWorksTitle', 'सेवावाणी कैसे काम करती है?')}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>
                    {t('hiwSubtitle', 'सरल भाषा में, आपकी अपनी आवाज़ में — 4 आसान चरणों में सहायता')}
                  </p>
                </div>

                <div className="how-it-works-grid">
                  {[
                    {
                      step: '01',
                      title: t('hiwStep1Title', 'अपनी जरूरत बताएं'),
                      desc: t('hiwStep1Desc', 'माइक दबाकर बोलें या लिखें कि आपको क्या चाहिए।')
                    },
                    {
                      step: '02',
                      title: t('hiwStep2Title', 'सही सेवा खोजें'),
                      desc: t('hiwStep2Desc', 'सहायक तुरंत सही योजना और विवरण प्रस्तुत करेगा।')
                    },
                    {
                      step: '03',
                      title: t('hiwStep3Title', 'पात्रता समझें'),
                      desc: t('hiwStep3Desc', 'नियम-आधारित सुरक्षित व्यवस्था से पात्रता जानें।')
                    },
                    {
                      step: '04',
                      title: t('hiwStep4Title', 'आवेदन पूरा करें'),
                      desc: t('hiwStep4Desc', 'आवाज़ से एक-एक सवाल का उत्तर देकर फॉर्म भरें।')
                    }
                  ].map((st) => (
                    <div
                      key={st.step}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '14px',
                        padding: '24px 20px',
                        position: 'relative'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '32px',
                          fontWeight: 900,
                          color: '#e2e8f0',
                          lineHeight: 1,
                          marginBottom: '8px'
                        }}
                      >
                        {st.step}
                      </div>
                      <h4 style={{ fontSize: '16.5px', fontWeight: 700, color: '#0d4436', marginBottom: '6px' }}>
                        {st.title}
                      </h4>
                      <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>
                        {st.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TRUST & RADICAL TRANSPARENCY SECTION */}
            <section style={{ padding: '44px 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
              <div className="gov-container-wide">
                <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0d4436', marginBottom: '6px' }}>
                    {t('trustTitle', 'आपकी जानकारी और पारदर्शिता हमारी प्राथमिकता है')}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>
                    {t('trustSub', 'नागरिकों के विश्वास और गोपनीयता के उच्च मानकों पर निर्मित')}
                  </p>
                </div>

                <div className="trust-grid">
                  {[
                    {
                      title: t('trust1Title', 'सुरक्षित एवं मास्क की गई जानकारी'),
                      desc: t('trust1Desc')
                    },
                    {
                      title: t('trust2Title', 'बहुभाषी समानता'),
                      desc: t('trust2Desc')
                    },
                    {
                      title: t('trust3Title', 'स्पष्ट नागरिक पुष्टि'),
                      desc: t('trust3Desc')
                    },
                    {
                      title: t('trust4Title', 'पारदर्शी और ईमानदार व्यवस्था'),
                      desc: t('trust4Desc')
                    }
                  ].map((tr, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '20px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <ShieldCheck size={18} color="#0d4436" />
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                          {tr.title}
                        </h4>
                      </div>
                      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                        {tr.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SERVICES CATALOG */}
        {activeTab === 'services' && (
          <ServicesView
            language={language}
            services={services}
            onSelectService={handleOpenServiceDetail}
            onApplyService={handleApplyService}
            t={t}
          />
        )}

        {/* VIEW: APPLICATION LAUNCHER */}
        {activeTab === 'launcher' && (
          <ApplicationLauncherView
            language={language}
            services={services}
            onApplyService={handleApplyService}
            onViewGuidance={handleOpenServiceDetail}
            onExploreAllServices={() => setActiveTab('services')}
            t={t}
          />
        )}

        {/* VIEW: SERVICE DETAIL & GUIDANCE */}
        {activeTab === 'service_detail' && (() => {
          const serviceToRender =
            selectedServiceForDetail ||
            (() => {
              const hash = window.location.hash || '';
              const match = hash.match(/^#service\/([a-zA-Z0-9_-]+)/);
              if (match) {
                const sId = decodeURIComponent(match[1]);
                return (
                  services.find((s) => s.serviceId === sId || s.id === sId) ||
                  FALLBACK_SERVICES.find((s) => s.serviceId === sId || s.id === sId) ||
                  null
                );
              }
              return null;
            })();

          if (serviceToRender) {
            return (
              <ServiceDetailView
                service={serviceToRender}
                language={language}
                onBack={handleBackFromDetail}
                onApplyService={handleApplyService}
                t={t}
              />
            );
          }

          return (
            <div className="gov-container" style={{ padding: '48px 16px', textAlign: 'center' }}>
              <div
                style={{
                  maxWidth: '560px',
                  margin: '0 auto',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1.5px solid #cbd5e1',
                  padding: '36px 28px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <Search size={28} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0d4436', marginBottom: '8px' }}>
                  {language === 'en'
                    ? 'Service Details Not Found'
                    : language === 'mr'
                    ? 'सेवा तपशील सापडला नाही'
                    : 'सेवा विवरण उपलब्ध नहीं है'}
                </h2>
                <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
                  {language === 'en'
                    ? 'The requested government service could not be located. Please choose from the active service directory.'
                    : language === 'mr'
                    ? 'विनंती केलेली सरकारी सेवा सापडली नाही. कृपया सेवा सूचीमधून योग्य सेवा निवडा.'
                    : 'अनुरोधित सरकारी सेवा नहीं मिल सकी। कृपया उपलब्ध सेवा निर्देशिका से उपयुक्त सेवा का चयन करें।'}
                </p>
                <button
                  onClick={handleBackFromDetail}
                  className="btn-gov-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
                >
                  <ArrowRight size={16} />
                  {t('backToCatalog', '← सेवा सूची पर वापस जाएं')}
                </button>
              </div>
            </div>
          );
        })()}


        {/* VIEW 3: MY APPLICATIONS */}
        {activeTab === 'applications' && (
          <ApplicationsView
            language={language}
            applications={applications}
            onTrackApp={(appId) => {
              setSearchAppId(appId);
              setActiveTab('track');
              handleCheckStatus();
            }}
            onResumeVoice={(srvId) => {
              handleAction('APPLY_NOW', srvId);
              setActiveTab('assistant');
            }}
            onExploreServices={() => setActiveTab('services')}
            t={t}
          />
        )}

        {/* VIEW 4: TRACK STATUS */}
        {activeTab === 'track' && (
          <TrackStatusView
            language={language}
            searchAppId={searchAppId}
            onSetSearchAppId={setSearchAppId}
            searchedStatus={searchedStatus}
            isLoading={isLoading}
            onCheckStatus={handleCheckStatus}
            t={t}
          />
        )}

        {/* VIEW 5: DOCUMENTS & GUIDELINES */}
        {activeTab === 'docs' && (
          <DocumentsView
            language={language}
            t={t}
          />
        )}

        {/* VIEW 6: HELP & SUPPORT */}
        {activeTab === 'help' && (
          <HelpView
            language={language}
            onEscalateToOperator={() => {
              handleAction('HELP');
              setActiveTab('assistant');
            }}
            t={t}
          />
        )}

        {/* VIEW 7: OPERATOR PORTAL (ROLE-BASED ACCESS CONTROL) */}
        {activeTab === 'operator' && (
          user.role === 'operator' ? (
            <OperatorView
              language={language}
              handoffRecord={handoffRecord}
              t={t}
            />
          ) : (
            <div className="gov-container" style={{ padding: '60px 16px', maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #fed7aa',
                  borderRadius: '16px',
                  padding: '40px 28px',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#fff7ed',
                    color: '#c2410c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 18px',
                    border: '1px solid #fed7aa'
                  }}
                >
                  <ShieldCheck size={32} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#9a3412', marginBottom: '10px' }}>
                  {t('accessRestrictedTitle', 'अभिगम प्रतिबंधित (Access Restricted)')}
                </h3>
                <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.6, marginBottom: '28px' }}>
                  {t(
                    'accessRestrictedDesc',
                    'ऑपरेटर सहायता पोर्टल केवल अधिकृत जन सेवा केंद्र / हेल्पडेस्क ऑपरेटरों के लिए आरक्षित है। नागरिक कृपया नागरिक सहायक का उपयोग करें।'
                  )}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActiveTab('assistant')}
                    className="btn-gov-outline"
                    style={{ padding: '10px 20px' }}
                  >
                    {t('navHome', 'नागरिक सहायक')}
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn-gov-primary"
                    style={{ backgroundColor: '#92400e', borderColor: '#78350f', padding: '10px 22px' }}
                  >
                    {t('loginAsOperator', 'ऑपरेटर के रूप में लॉगिन करें')}
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {/* VIEW 8: EVALUATION & WER LAB */}
        {activeTab === 'eval' && (
          <EvalLabView
            language={language}
            refText={refText}
            hypText={hypText}
            onSetRefText={setRefText}
            onSetHypText={setHypText}
            werResult={werResult}
            metricsData={metricsData}
            onCalcWer={handleCalcWer}
            t={t}
          />
        )}

        {/* VIEW 9: ABOUT ARCHITECTURE */}
        {activeTab === 'about' && (
          <AboutView
            language={language}
            t={t}
          />
        )}
        </ErrorBoundary>
      </main>

      {/* 4. Multi-column Public Service Footer */}
      <Footer
        language={language}
        onTabChange={(tab) => {
          navigateToTab(tab);
        }}
        t={t}
      />

      {/* 5. Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onUpdateUser={(updatedUser) => {
          setUser(updatedUser);
          if (updatedUser.role !== 'operator' && activeTab === 'operator') {
            setActiveTab('assistant');
          }
        }}
        onOperatorLoginSuccess={() => setActiveTab('operator')}
        t={t}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications(notifications.map((n) => ({ ...n, read: true })));
        }}
        onClearAll={() => setNotifications([])}
        onSelectNotification={(item) => {
          setNotifications(
            notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n))
          );
        }}
        t={t}
      />

      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={accessibility}
        onUpdateSettings={setAccessibility}
        t={t}
      />
    </div>
  );
}

export default App;
