import { useState } from 'react';
import {
  Mic,
  HelpCircle,
  Activity,
  Info,
  Bell,
  Sliders,
  User,
  Wifi,
  ShieldCheck,
  PhoneCall,
  FileText,
  Briefcase,
  Layers,
  Menu,
  X
} from 'lucide-react';
import type { LanguageCode, CitizenUser } from '../types';

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeTab: string;
  onTabChange: (tab: any) => void;
  user: CitizenUser;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenAccessibility: () => void;
  unreadCount: number;
  simulate2G: boolean;
  onToggle2G: () => void;
  t: (key: string, fallback?: string) => string;
}

export function Header({
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  user,
  onOpenAuth,
  onOpenNotifications,
  onOpenAccessibility,
  unreadCount,
  simulate2G,
  onToggle2G,
  t
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'assistant', label: t('navHome', 'Citizen Assistant'), icon: Mic },
    { id: 'services', label: t('navServices', 'Services Catalog'), icon: Layers },
    { id: 'launcher', label: t('navLauncher', 'Apply Online'), icon: Briefcase },
    { id: 'applications', label: t('navApplications', 'My Applications'), icon: FileText },
    { id: 'docs', label: t('navDocs', 'Documents'), icon: FileText },
    { id: 'help', label: t('navHelp', 'Help & Support'), icon: HelpCircle },
    { id: 'eval', label: t('navMetrics', 'Metrics & Lab'), icon: Activity },
    { id: 'about', label: t('navAbout', 'About Project'), icon: Info }
  ];


  const alertBadgeText = language === 'hi' ? 'सांविधिक सूचना' : (language === 'mr' ? 'वैधानिक सूचना' : 'STATUTORY ALERT');
  const helpdeskText = language === 'hi'
    ? 'नागरिक सहायता: 1800-000-DEMO (निशुल्क)'
    : (language === 'mr' ? 'नागरिक मदत कक्ष: 1800-000-DEMO (विनामूल्य)' : 'Citizen Helpdesk: 1800-000-DEMO (Toll-Free)');
  const net2gLabel = language === 'hi'
    ? `2G नेटवर्क: ${simulate2G ? 'सक्रिय (800ms)' : 'बंद'}`
    : (language === 'mr' ? `2G नेटवर्क: ${simulate2G ? 'सक्रिय (800ms)' : 'बंद'}` : `2G Edge Network: ${simulate2G ? 'Active (800ms)' : 'OFF'}`);

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-light)' }}>
      {/* 1. TOP STATUTORY ANNOUNCEMENT BAR */}
      <div
        style={{
          backgroundColor: '#092c22',
          color: '#ffffff',
          padding: '6px 0',
          fontSize: '12px',
          borderBottom: '1px solid #165b49'
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
          {/* Statutory alert badge & notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
            <span
              style={{
                backgroundColor: '#f59e0b',
                color: '#78350f',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={12} />
              {alertBadgeText}
            </span>
            <span style={{ color: '#d1fae5', fontWeight: 500, fontSize: '12px' }}>
              {t('statutoryNotice')}
            </span>
          </div>

          {/* Helpdesk Toll-Free and 2G Simulation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a7f3d0', fontSize: '12px' }}>
              <PhoneCall size={13} color="#f59e0b" />
              <span>{helpdeskText}</span>
            </div>

            <button
              onClick={onToggle2G}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: simulate2G ? '#ea580c' : '#165b49',
                color: '#ffffff',
                border: '1px solid ' + (simulate2G ? '#f97316' : '#22c55e'),
                borderRadius: '16px',
                padding: '2px 10px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              title="Simulates 2G edge network latency (800ms) for realistic rural verification"
            >
              <Wifi size={12} />
              {net2gLabel}
            </button>
          </div>
        </div>
      </div>


      {/* 2. MAIN INSTITUTIONAL HEADER BAR */}
      <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
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
          {/* Logo & Portal Identity */}
          <div
            onClick={() => onTabChange('assistant')}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          >
            {/* Ashoka Chakra & Tricolor Emblem Motif */}
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f97316 33%, #ffffff 33%, #ffffff 66%, #15803d 66%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #cbd5e1',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '2px solid #1e3a8a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#1e3a8a' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0d4436', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
                  {t('appName')}
                </h1>
                <span
                  style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    border: '1px solid #fde68a',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {language === 'hi' ? 'प्रोटोटाइप एमवीपी' : (language === 'mr' ? 'प्रोटोटाइप एमव्हीपी' : 'PROTOTYPE MVP')}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Language Selector Pills */}
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
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: active ? 700 : 500,
                      fontSize: '13px',
                      cursor: 'pointer',
                      backgroundColor: active ? '#0d4436' : 'transparent',
                      color: active ? '#ffffff' : '#475569',
                      transition: 'all 0.15s'
                    }}
                  >
                    {labels[lang]}
                  </button>
                );
              })}
            </div>

            {/* Accessibility Button */}
            <button
              onClick={onOpenAccessibility}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
              title="Accessibility Settings (Font size, contrast, voice speed)"
            >
              <Sliders size={15} color="#0d4436" />
              <span>Aa</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              title={t('notifications')}
            >
              <Bell size={17} color="#334155" />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    borderRadius: '50%',
                    fontSize: '10px',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile / Sign In Pill (Role-Aware) */}
            <button
              onClick={onOpenAuth}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: user.role === 'operator' && user.isAuthenticated
                  ? '#fffbeb'
                  : (user.isAuthenticated ? '#ecfdf5' : '#ffffff'),
                border: user.role === 'operator' && user.isAuthenticated
                  ? '1.5px solid #f59e0b'
                  : ('1.5px solid ' + (user.isAuthenticated ? '#10b981' : '#cbd5e1')),
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: user.role === 'operator' && user.isAuthenticated
                  ? '#92400e'
                  : (user.isAuthenticated ? '#065f46' : '#334155'),
                cursor: 'pointer'
              }}
            >
              {user.role === 'operator' && user.isAuthenticated ? (
                <PhoneCall size={15} color="#d97706" />
              ) : (
                <User size={15} color={user.isAuthenticated ? '#059669' : '#64748b'} />
              )}
              <span>
                {user.isAuthenticated
                  ? (user.role === 'operator'
                    ? `🎧 ${user.operatorId || 'OP-8821'}`
                    : (user.isGuest ? t('guestUser') : user.name))
                  : t('signIn')}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f1f5f9',
                border: 'none',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              className="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. DEEP INSTITUTIONAL NAVIGATION BAR */}
      <nav
        style={{
          backgroundColor: '#0d4436',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div
          className="gov-container-wide"
          style={{
            display: 'flex',
            gap: '2px',
            overflowX: 'auto',
            padding: '2px 0',
            scrollbarWidth: 'none'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 16px',
                  backgroundColor: active ? '#165b49' : 'transparent',
                  color: active ? '#ffffff' : '#d1fae5',
                  border: 'none',
                  borderBottom: active ? '3px solid #f59e0b' : '3px solid transparent',
                  fontSize: '13.5px',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={16} color={active ? '#f59e0b' : '#a7f3d0'} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
