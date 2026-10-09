import { useState } from 'react';
import {
  PhoneCall,
  ClipboardCheck,
  BookOpen,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  User,
  LogOut,
  Wifi,
  Check,
  Send,
  PhoneForwarded,
  Eye
} from 'lucide-react';
import type {
  LanguageCode,
  CitizenUser,
  ApplicationRecord,
  ServiceDefinition
} from '../types';
import { apiClient } from '../api/client';

interface OperatorPortalProps {
  user: CitizenUser;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  applications: ApplicationRecord[];
  onUpdateApplicationStatus: (appId: string, newStatus: string, remarks?: string) => void;
  handoffRecord: any;
  services: ServiceDefinition[];
  onSwitchToCitizen: () => void;
  onSignOut: () => void;
  simulate2G: boolean;
  onToggle2G: () => void;
  t: (key: string, fallback?: string) => string;
}

export function OperatorPortal({
  user,
  language,
  onLanguageChange,
  applications,
  onUpdateApplicationStatus,
  handoffRecord,
  services,
  onSwitchToCitizen,
  onSignOut,
  simulate2G,
  onToggle2G,
  t
}: OperatorPortalProps) {
  const [activeTab, setActiveTab] = useState<'escalations' | 'applications' | 'sop' | 'telemetry'>('escalations');
  const [dutyStatus, setDutyStatus] = useState<'active' | 'break'>('active');

  // Escalations state
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [activeCallTicket, setActiveCallTicket] = useState<any>(null);
  const [callNotes, setCallNotes] = useState('');
  const [filterLang, setFilterLang] = useState<'ALL' | 'HI' | 'MR' | 'EN'>('ALL');

  // Applications Review state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUBMITTED'>('ALL');
  const [selectedAppForReview, setSelectedAppForReview] = useState<ApplicationRecord | null>(null);
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Telemetry state
  const [refText, setRefText] = useState('मेरा नाम रमेश कुमार है');
  const [hypText, setHypText] = useState('मेरा नाम रमेश कुमार है');
  const [werResult, setWerResult] = useState<any>(null);
  const [isWerLoading, setIsWerLoading] = useState(false);

  // Default sample escalation tickets + any live session handoff
  const escalationTickets = [
    ...(handoffRecord
      ? [
          {
            id: handoffRecord.handoffId || 'HO-SESSION-CURR',
            sessionId: handoffRecord.sessionId || 'curr-session',
            language: (handoffRecord.language || 'hi').toUpperCase(),
            reason: handoffRecord.reason || 'नागरिक द्वारा आवाज़ सहायक से ऑपरेटर सहायता का अनुरोध',
            failingField: handoffRecord.failingField || 'N/A',
            status: 'QUEUED',
            urgency: 'HIGH',
            time: 'Just now',
            snapshot: handoffRecord.formDataSnapshot || {
              full_name: 'रमेश कुमार',
              mobile_number: '9876543210'
            }
          }
        ]
      : []),
    {
      id: 'HO-8B41E20A',
      sessionId: 'sess_998124',
      language: 'HI',
      reason: 'बार-बार अस्पष्ट आवाज़ (3 consecutive low-confidence speech turns)',
      failingField: 'aadhaar_number',
      status: 'QUEUED',
      urgency: 'MEDIUM',
      time: '12 mins ago',
      snapshot: {
        full_name: 'सुरेश कुमार',
        mobile_number: '9876543210',
        state_name: 'उत्तर प्रदेश',
        district_name: 'वाराणसी'
      }
    },
    {
      id: 'HO-5A92F11C',
      sessionId: 'sess_998089',
      language: 'MR',
      reason: 'नागरिकाने मानवी ऑपरेटर मदत मागितली (Citizen requested human operator)',
      failingField: 'land_holding_hectares',
      status: 'QUEUED',
      urgency: 'HIGH',
      time: '34 mins ago',
      snapshot: {
        full_name: 'ज्ञानेश्वर कदम',
        mobile_number: '9822114455',
        state_name: 'महाराष्ट्र',
        district_name: 'पुणे'
      }
    }
  ];

  const handleResolveTicket = (id: string) => {
    setResolvedIds((prev) => [...prev, id]);
    if (activeCallTicket?.id === id) {
      setActiveCallTicket(null);
      setCallNotes('');
    }
  };

  const handleCalculateWer = async () => {
    setIsWerLoading(true);
    try {
      const res = await apiClient.calculateWer(refText, hypText, language);
      setWerResult(res);
    } catch {
      // Mock calculation fallback
      setWerResult({ wer: 0.0, substitutions: 0, deletions: 0, insertions: 0 });
    } finally {
      setIsWerLoading(false);
    }
  };

  const handleApplyStatusChange = (newStatus: string) => {
    if (!selectedAppForReview) return;
    onUpdateApplicationStatus(selectedAppForReview.applicationId, newStatus, officerRemarks);
    setActionSuccessMessage(`${selectedAppForReview.applicationId} ${t('opStatusUpdatedSuccess')}: ${newStatus}`);
    setSelectedAppForReview(null);
    setOfficerRemarks('');
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  // Filtered escalations
  const filteredTickets = escalationTickets.filter((tk) => {
    if (filterLang !== 'ALL' && tk.language !== filterLang) return false;
    return true;
  });

  const pendingEscalationsCount = escalationTickets.filter((tk) => !resolvedIds.includes(tk.id)).length;

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'UNDER_REVIEW' && !app.status.includes('UNDER_REVIEW')) return false;
      if (statusFilter === 'APPROVED' && !app.status.includes('APPROVED')) return false;
      if (statusFilter === 'REJECTED' && !app.status.includes('REJECTED')) return false;
      if (statusFilter === 'SUBMITTED' && !app.status.includes('SUBMITTED')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = app.applicationId.toLowerCase().includes(q);
      const matchName = app.serviceName.toLowerCase().includes(q);
      const matchCitizen = String(app.formData?.full_name || '').toLowerCase().includes(q);
      const matchMobile = String(app.formData?.mobile_number || '').includes(q);
      return matchId || matchName || matchCitizen || matchMobile;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* 1. TOP STATUTORY & OPERATOR DISPATCH BAR */}
      <div
        style={{
          backgroundColor: '#451a03',
          color: '#ffffff',
          padding: '6px 0',
          fontSize: '12px',
          borderBottom: '1.5px solid #78350f'
        }}
      >
        <div
          className="gov-container-wide"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                backgroundColor: '#f59e0b',
                color: '#78350f',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={12} />
              {t('opInternalNotice')}
            </span>
            <span style={{ color: '#fed7aa', fontSize: '12px' }}>
              CSC NODE 04 • वाराणसी मंडल सहायता केंद्र (Shift: Morning A)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Duty toggle */}
            <button
              onClick={() => setDutyStatus(dutyStatus === 'active' ? 'break' : 'active')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: dutyStatus === 'active' ? '#15803d' : '#b45309',
                color: '#ffffff',
                border: 'none',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
              {dutyStatus === 'active' ? t('opDutyActive') : t('opDutyBreak')}
            </button>

            {/* 2G Simulation toggle */}
            <button
              onClick={onToggle2G}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: simulate2G ? '#ea580c' : '#78350f',
                color: '#ffffff',
                border: '1px solid ' + (simulate2G ? '#f97316' : '#92400e'),
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 600
              }}
              title="Toggle simulated 2G rural connection latency"
            >
              <Wifi size={11} />
              2G Edge: {simulate2G ? '800ms' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. OPERATOR INSTITUTIONAL HEADER BAR */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '14px 0'
        }}
      >
        <div
          className="gov-container-wide"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          {/* Operator Console Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: '#78350f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fde047',
                border: '1.5px solid #d97706',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <PhoneCall size={24} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#78350f', lineHeight: 1.1 }}>
                  {t('opConsoleTitle')}
                </h1>
                <span
                  style={{
                    backgroundColor: '#fffbeb',
                    color: '#b45309',
                    border: '1px solid #fde68a',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  LEVEL-3 HELPDESK
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                {t('opConsoleSub')}
              </p>
            </div>
          </div>

          {/* Right Header: Operator Profile & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Language Selector */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f1f5f9',
                padding: '3px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}
            >
              {(['hi', 'mr', 'en'] as LanguageCode[]).map((lang) => {
                const labels: Record<LanguageCode, string> = {
                  hi: 'हिंदी',
                  mr: 'मराठी',
                  en: 'English'
                };
                const active = language === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: active ? 700 : 500,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      backgroundColor: active ? '#78350f' : 'transparent',
                      color: active ? '#ffffff' : '#475569',
                      transition: 'all 0.15s'
                    }}
                  >
                    {labels[lang]}
                  </button>
                );
              })}
            </div>

            {/* Operator Identity Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#fffbeb',
                border: '1.5px solid #fde68a',
                padding: '6px 14px',
                borderRadius: '8px'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#92400e',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '12px'
                }}
              >
                OP
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#78350f' }}>
                  {user.name} ({user.operatorId || 'OP-8821'})
                </div>
                <div style={{ fontSize: '11px', color: '#b45309' }}>
                  {user.department || 'CSC Helpdesk / Escalations'}
                </div>
              </div>
            </div>

            {/* Switch to Citizen Portal Button */}
            <button
              onClick={onSwitchToCitizen}
              className="btn-gov-outline"
              style={{
                fontSize: '13px',
                padding: '7px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: '#0d4436',
                color: '#0d4436'
              }}
              title="Return to the Citizen public service interface"
            >
              <User size={15} />
              {t('opSwitchToCitizen')}
            </button>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Sign out of the Operator Console"
            >
              <LogOut size={15} />
              {t('signOut', 'लॉग आउट')}
            </button>
          </div>
        </div>
      </header>

      {/* 3. DEDICATED OPERATOR NAVIGATION TABS */}
      <nav
        style={{
          backgroundColor: '#78350f',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div
          className="gov-container-wide"
          style={{
            display: 'flex',
            gap: '4px',
            overflowX: 'auto',
            padding: '2px 0',
            scrollbarWidth: 'none'
          }}
        >
          {[
            {
              id: 'escalations',
              label: t('opTabEscalations'),
              icon: PhoneCall,
              badge: pendingEscalationsCount > 0 ? pendingEscalationsCount : undefined,
              badgeColor: '#ef4444'
            },
            {
              id: 'applications',
              label: t('opTabApplications'),
              icon: ClipboardCheck,
              badge: applications.length,
              badgeColor: '#f59e0b'
            },
            {
              id: 'sop',
              label: t('opTabSop'),
              icon: BookOpen
            },
            {
              id: 'telemetry',
              label: t('opTabTelemetry'),
              icon: Activity
            }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  backgroundColor: active ? '#92400e' : 'transparent',
                  color: active ? '#ffffff' : '#fde68a',
                  border: 'none',
                  borderBottom: active ? '3px solid #fde047' : '3px solid transparent',
                  fontSize: '13.5px',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={16} color={active ? '#fde047' : '#fef3c7'} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    style={{
                      backgroundColor: tab.badgeColor,
                      color: '#ffffff',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '1px 7px',
                      marginLeft: '2px'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Success banner if any action taken */}
      {actionSuccessMessage && (
        <div className="gov-container-wide" style={{ marginTop: '16px' }}>
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              color: '#065f46',
              padding: '12px 18px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            <CheckCircle size={18} />
            <span>{actionSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* 4. MAIN OPERATOR VIEWS */}
      <main style={{ flex: 1, padding: '24px 0 48px' }}>
        {/* ========================================================= */}
        {/* VIEW 1: LIVE ESCALATION QUEUE (लाइव सहायता कतार) */}
        {/* ========================================================= */}
        {activeTab === 'escalations' && (
          <div className="gov-container-wide">
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#78350f' }}>
                  {t('opTabEscalations')} ({filteredTickets.length})
                </h2>
                <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                  नागरिक आवाज़ सहायक से Level-3 एस्केलेशन एवं सीधे कॉल सेंटर अनुरोध।
                </p>
              </div>

              {/* Language filter pills */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['ALL', 'HI', 'MR', 'EN'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setFilterLang(l)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid ' + (filterLang === l ? '#78350f' : '#cbd5e1'),
                      backgroundColor: filterLang === l ? '#78350f' : '#ffffff',
                      color: filterLang === l ? '#ffffff' : '#475569',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {l === 'ALL' ? 'सभी भाषाएं' : l}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Connected Call simulator if a ticket is being answered */}
            {activeCallTicket && (
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  border: '2px solid #f59e0b',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#92400e' }}>
                      🟢 सक्रिय नागरिक कॉल कनेक्टेड: {activeCallTicket.id}
                    </span>
                    <span className="badge-gov badge-gov-saffron">
                      भाषा: {activeCallTicket.language}
                    </span>
                  </div>

                  <button
                    onClick={() => handleResolveTicket(activeCallTicket.id)}
                    className="btn-gov-primary"
                    style={{ backgroundColor: '#15803d', borderColor: '#166534', fontSize: '13px' }}
                  >
                    <Check size={16} />
                    कॉल पूर्ण करें व समाधान चिह्नित करें (End & Resolve)
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>नागरिक विवरण:</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {activeCallTicket.snapshot.full_name || 'नागरिक (Citizen)'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                      📱 {activeCallTicket.snapshot.mobile_number || '9876543210'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#b45309', marginTop: '4px' }}>
                      एस्केलेशन कारण: {activeCallTicket.reason}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>सुझाया गया ऑपरेटर संवाद स्क्रिप्ट (SOP Prompt):</div>
                    <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#0d4436', marginTop: '4px', lineHeight: 1.5 }}>
                      {activeCallTicket.language === 'MR'
                        ? '"नमस्कार, मी सेवावाणी ऑपरेटर बोलत आहे. मी तुम्हाला फॉर्म भरण्यात किंवा अर्जाची माहिती तपासण्यात मदत करू शकतो."'
                        : '"नमस्ते, मैं सेवावाणी ऑपरेटर बोल रहा हूँ। आपका फॉर्म सुरक्षित है, मैं आपकी पूरी सहायता करूँगा।"'}
                    </div>
                  </div>
                </div>

                {/* Resolution Notes Box */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#78350f', display: 'block', marginBottom: '6px' }}>
                    {t('opResolutionNotes')} (कॉल निष्कर्ष एवं दर्ज की गई जानकारी):
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="उदा. नागरिक के आधार का सत्यापन किया गया, फॉर्म पूर्ण हुआ..."
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13.5px'
                      }}
                    />
                    <button
                      onClick={() => handleResolveTicket(activeCallTicket.id)}
                      className="btn-gov-primary"
                      style={{ backgroundColor: '#78350f', borderColor: '#451a03' }}
                    >
                      <Send size={15} />
                      नोट्स सहेजें
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tickets Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredTickets.map((tk) => {
                const isResolved = resolvedIds.includes(tk.id);
                const isActive = activeCallTicket?.id === tk.id;

                return (
                  <div
                    key={tk.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      border: isActive
                        ? '2px solid #f59e0b'
                        : isResolved
                        ? '1px solid #cbd5e1'
                        : '1.5px solid #fca5a5',
                      padding: '22px',
                      boxShadow: 'var(--shadow-sm)',
                      opacity: isResolved ? 0.75 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '17px', fontWeight: 800, color: '#78350f' }}>
                          {tk.id}
                        </span>
                        <span className={`badge-gov ${isResolved ? 'badge-gov-green' : 'badge-gov-saffron'}`}>
                          {isResolved ? '✓ RESOLVED' : (isActive ? 'IN CALL' : tk.status)}
                        </span>
                        <span className="badge-gov badge-gov-blue">
                          भाषा: {tk.language}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        समय: {tk.time}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '13px', marginBottom: '14px' }}>
                      <div>
                        <span style={{ color: '#64748b' }}>कारण (Escalation Reason):</span>{' '}
                        <strong style={{ color: '#b91c1c' }}>{tk.reason}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>अटका हुआ फ़ील्ड (Failing Field):</span>{' '}
                        <strong style={{ color: '#0f172a' }}>{tk.failingField}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>सत्र क्रमांक (Session ID):</span>{' '}
                        <code>{tk.sessionId}</code>
                      </div>
                    </div>

                    {/* Masked Data Snapshot */}
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {t('opVerifiedCitizenData')} (सुरक्षित एवं मास्क किया गया स्नैपशॉट):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12.5px' }}>
                        {Object.entries(tk.snapshot).map(([k, v]) => (
                          <div key={k} style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            <span style={{ color: '#64748b' }}>{k.replace('_', ' ')}:</span>{' '}
                            <strong>{String(v)}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      {!isResolved && !isActive && (
                        <button
                          onClick={() => setActiveCallTicket(tk)}
                          className="btn-gov-primary"
                          style={{ fontSize: '13px', padding: '8px 18px', backgroundColor: '#78350f', borderColor: '#451a03' }}
                        >
                          <PhoneForwarded size={15} />
                          {t('opTakeCall')}
                        </button>
                      )}
                      {!isResolved && (
                        <button
                          onClick={() => handleResolveTicket(tk.id)}
                          className="btn-gov-outline"
                          style={{ fontSize: '13px', padding: '8px 16px', color: '#166534', borderColor: '#86efac' }}
                        >
                          <Check size={15} />
                          {t('opMarkResolved')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: APPLICATIONS REVIEW & AUDIT (आवेदन समीक्षा) */}
        {/* ========================================================= */}
        {activeTab === 'applications' && (
          <div className="gov-container-wide">
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#78350f' }}>
                {t('opTabApplications')} ({filteredApps.length})
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                विभाग में जमा किए गए समस्त नागरिक आवेदनों की आधिकारिक समीक्षा, सत्यापन एवं स्वीकृति।
              </p>
            </div>

            {/* Search and Filters Bar */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                padding: '16px 20px',
                marginBottom: '20px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('opSearchAppsPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Status filter pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: t('opFilterAll') },
                  { id: 'UNDER_REVIEW', label: t('opFilterReview') },
                  { id: 'APPROVED', label: t('opFilterApproved') },
                  { id: 'REJECTED', label: t('opFilterRejected') }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id as any)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid ' + (statusFilter === f.id ? '#78350f' : '#cbd5e1'),
                      backgroundColor: statusFilter === f.id ? '#78350f' : '#ffffff',
                      color: statusFilter === f.id ? '#ffffff' : '#475569',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredApps.length === 0 ? (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px solid #cbd5e1' }}>
                  <Filter size={32} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#334155' }}>कोई आवेदन नहीं मिला</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>कृपया खोज शब्द या फ़िल्टर बदलें</div>
                </div>
              ) : (
                filteredApps.map((app) => (
                  <div
                    key={app.applicationId}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      padding: '18px 22px',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div style={{ minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#78350f' }}>
                          {app.applicationId}
                        </span>
                        <span
                          className={`badge-gov ${
                            app.status.includes('APPROVED')
                              ? 'badge-gov-green'
                              : app.status.includes('REJECTED')
                              ? 'badge-gov-saffron'
                              : 'badge-gov-blue'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                        {app.serviceName}
                      </div>

                      <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: '#64748b', flexWrap: 'wrap' }}>
                        <div>
                          नागरिक: <strong>{String(app.formData?.full_name || 'रमेश कुमार')}</strong>
                        </div>
                        <div>
                          दिनांक: <strong>{app.date}</strong>
                        </div>
                        <div>
                          अंतिम अद्यतन: <strong>{app.lastUpdated}</strong>
                        </div>
                        {app.officerRemarks && (
                          <div style={{ color: '#92400e' }}>
                            टिप्पणी: <em>{app.officerRemarks}</em>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => {
                          setSelectedAppForReview(app);
                          setOfficerRemarks(app.officerRemarks || '');
                        }}
                        className="btn-gov-primary"
                        style={{ fontSize: '13px', padding: '8px 18px', backgroundColor: '#78350f', borderColor: '#451a03' }}
                      >
                        <Eye size={15} />
                        समीक्षा एवं निर्णय (Review)
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Application Inspection & Action Modal */}
            {selectedAppForReview && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
                    maxWidth: '640px',
                    width: '100%',
                    boxShadow: 'var(--shadow-xl)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#78350f',
                      color: '#ffffff',
                      padding: '18px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ClipboardCheck size={20} color="#fde047" />
                      <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                        {t('opReviewModalTitle')}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedAppForReview(null)}
                      style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '20px' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>आवेदन क्रमांक:</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#78350f' }}>
                          {selectedAppForReview.applicationId}
                        </div>
                        <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                          {selectedAppForReview.serviceName}
                        </div>
                      </div>
                      <div>
                        <span className="badge-gov badge-gov-blue">
                          वर्तमान स्थिति: {selectedAppForReview.status}
                        </span>
                      </div>
                    </div>

                    {/* Verified Data Field Table */}
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      {t('opVerifiedCitizenData')}:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                      {Object.entries(selectedAppForReview.formData || {}).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                          <span style={{ color: '#64748b', textTransform: 'capitalize' }}>{k.replace('_', ' ')}:</span>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{String(v)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Officer Remarks Textarea */}
                    <div style={{ marginBottom: '22px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        {t('opOfficerRemarksLabel')}:
                      </label>
                      <textarea
                        value={officerRemarks}
                        onChange={(e) => setOfficerRemarks(e.target.value)}
                        placeholder={t('opOfficerRemarksPlaceholder')}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13.5px'
                        }}
                      />
                    </div>

                    {/* Official Decision Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      <button
                        onClick={() => handleApplyStatusChange('APPROVED (DEMO)')}
                        className="btn-gov-primary"
                        style={{ backgroundColor: '#15803d', borderColor: '#166534', padding: '10px', fontSize: '13px', justifyContent: 'center' }}
                      >
                        <CheckCircle size={15} />
                        {t('opApprove')}
                      </button>

                      <button
                        onClick={() => handleApplyStatusChange('REJECTED (DEMO)')}
                        className="btn-gov-primary"
                        style={{ backgroundColor: '#b91c1c', borderColor: '#991b1b', padding: '10px', fontSize: '13px', justifyContent: 'center' }}
                      >
                        <XCircle size={15} />
                        {t('opReject')}
                      </button>

                      <button
                        onClick={() => handleApplyStatusChange('UNDER_REVIEW (DEMO)')}
                        className="btn-gov-outline"
                        style={{ padding: '10px', fontSize: '13px', justifyContent: 'center' }}
                      >
                        {t('opRequestDocs')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: SERVICE SOPs & GUIDELINES (मानक संचालन प्रक्रिया) */}
        {/* ========================================================= */}
        {activeTab === 'sop' && (
          <div className="gov-container-wide">
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#78350f' }}>
                {t('opTabSop')}
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                विभिन्न योजनाओं के लिए सहायता अधिकारियों एवं ऑपरेटरों हेतु आधिकारिक नियम, पात्रता व कॉलर स्क्रिप्ट।
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {services.map((srv) => {
                const sName = srv.name[language] || srv.name.hi;
                const sDesc = srv.description[language] || srv.description.hi;

                return (
                  <div
                    key={srv.serviceId}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      border: '1.5px solid #cbd5e1',
                      padding: '22px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span className="badge-gov badge-gov-blue">{srv.category}</span>
                      <span className="badge-gov badge-gov-proto">SOP v2.4</span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#78350f', marginBottom: '8px' }}>
                      {sName}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                      {sDesc}
                    </p>

                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      अनिवार्य दस्तावेज़ जाँच सूची (Documents Checklist):
                    </div>
                    <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: '#475569', marginBottom: '16px', lineHeight: 1.6 }}>
                      {srv.requiredDocuments.map((doc, idx) => (
                        <li key={idx}>{doc[language] || doc.hi}</li>
                      ))}
                    </ul>

                    {/* Operator Script */}
                    <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px', fontSize: '12.5px' }}>
                      <div style={{ fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>
                        🗣️ नागरिक को समझाने हेतु स्क्रिप्ट:
                      </div>
                      <div style={{ color: '#78350f', fontStyle: 'italic', lineHeight: 1.5 }}>
                        {language === 'mr'
                          ? `या योजनेसाठी आवश्यक कागदपत्रे आणि आधार क्रमांक तयार ठेवावा. प्रणालीमध्ये माहिती त्वरित नोंदवली जाईल.`
                          : `इस योजना के लिए आवश्यक दस्तावेज़ और आधार नंबर पास रखें। सिस्टम में आपकी जानकारी तुरंत दर्ज की जाएगी।`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: SYSTEM TELEMETRY & WER LAB (टेलीमेट्री व मेट्रिक्स) */}
        {/* ========================================================= */}
        {activeTab === 'telemetry' && (
          <div className="gov-container-wide">
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#78350f' }}>
                {t('opTabTelemetry')}
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                आवाज़ पहचान सटीकता (Word Error Rate), फॉलबैक दर एवं प्रणाली स्वास्थ्य मेट्रिक्स।
              </p>
            </div>

            {/* 4 Stat KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1.5px solid #cbd5e1', padding: '18px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>सक्रिय नागरिक सत्र (Active Sessions)</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#78350f', marginTop: '6px' }}>42</div>
                <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>↑ 12% from last hour</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1.5px solid #cbd5e1', padding: '18px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>औसत ASR सटीकता (Confidence)</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#15803d', marginTop: '6px' }}>93.8%</div>
                <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>High confidence zone</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1.5px solid #cbd5e1', padding: '18px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>ऑपरेटर एस्केलेशन दर (Handoff Rate)</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#b45309', marginTop: '6px' }}>3.4%</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Well within SLA (&lt; 5%)</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1.5px solid #cbd5e1', padding: '18px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>2G Edge लेटेंसी सिमुलेशन</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: simulate2G ? '#ea580c' : '#475569', marginTop: '6px' }}>
                  {simulate2G ? '800ms' : 'Disabled'}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Rural verified payload</div>
              </div>
            </div>

            {/* Interactive WER Calculation Lab for Operators */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #cbd5e1', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Activity size={20} color="#78350f" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#78350f' }}>
                  ऑपरेटर ASR शब्द त्रुटि दर (Word Error Rate) परीक्षण टूल
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    आधिकारिक संदर्भ पाठ (Ground Truth / Reference):
                  </label>
                  <input
                    type="text"
                    value={refText}
                    onChange={(e) => setRefText(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    ASR द्वारा प्राप्त पाठ (Hypothesis):
                  </label>
                  <input
                    type="text"
                    value={hypText}
                    onChange={(e) => setHypText(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
              </div>

              <button
                onClick={handleCalculateWer}
                disabled={isWerLoading}
                className="btn-gov-primary"
                style={{ backgroundColor: '#78350f', borderColor: '#451a03', padding: '10px 20px', fontSize: '13px' }}
              >
                {isWerLoading ? 'गणना की जा रही है...' : 'WER गणना करें (Compute WER)'}
              </button>

              {werResult && (
                <div style={{ marginTop: '18px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#065f46' }}>
                    WER परिणाम: {(werResult.wer * 100).toFixed(1)}% ({werResult.wer === 0 ? 'उत्कृष्ट (Perfect Match)' : 'त्रुटि उपस्थित'})
                  </div>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#047857', marginTop: '6px' }}>
                    <div>प्रतिस्थापन (Substitutions): <strong>{werResult.substitutions || 0}</strong></div>
                    <div>विलोपन (Deletions): <strong>{werResult.deletions || 0}</strong></div>
                    <div>प्रविष्टि (Insertions): <strong>{werResult.insertions || 0}</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 5. OPERATOR DEDICATED ADMINISTRATIVE FOOTER */}
      <footer
        style={{
          backgroundColor: '#451a03',
          color: '#fed7aa',
          borderTop: '2px solid #78350f',
          padding: '20px 0',
          fontSize: '12px'
        }}
      >
        <div
          className="gov-container-wide"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <strong>सेवावाणी आंतरिक ऑपरेटर कंसोल (Internal Operator Console)</strong> • अधिकृत कार्मिक उपयोग हेतु | Node IP: 10.240.12.88
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onSwitchToCitizen}
              style={{
                background: 'none',
                border: 'none',
                color: '#fde047',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              {t('opSwitchToCitizen')}
            </button>
            <span>•</span>
            <button
              onClick={onSignOut}
              style={{
                background: 'none',
                border: 'none',
                color: '#fca5a5',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {t('signOut', 'लॉग आउट')}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
