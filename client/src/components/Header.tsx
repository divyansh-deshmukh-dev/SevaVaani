import { useState } from 'react';
import {
  Mic,
  HelpCircle,
  Activity,
  Info,
  Bell,
  Sliders,
  User,
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
  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-light)' }}>
      {/* 1. TOP STATUTORY ANNOUNCEMENT BAR */}
      <div
        className="top-statutory-bar"
        style={{
          backgroundColor: '#092c22',
          color: '#ffffff',
          padding: '4px 0',
          fontSize: '11.5px',
          borderBottom: '1px solid #165b49'
        }}
      >
        <div
          className="gov-container-wide"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          {/* Statutory alert badge & notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
            <span
              style={{
                backgroundColor: '#f59e0b',
                color: '#78350f',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={11} />
              <span className="hide-on-mobile">{alertBadgeText}</span>
              <span className="show-on-mobile">डेमो</span>
            </span>
            <span className="hide-on-mobile" style={{ color: '#d1fae5', fontWeight: 500, fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t('statutoryNotice')}
            </span>
            <span className="show-on-mobile" style={{ color: '#d1fae5', fontWeight: 500, fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t('statutoryNoticeShort', 'सेवावाणी एक प्रोटोटाइप है। वास्तविक सरकारी आवेदन नहीं भेजे जाते।')}
            </span>
          </div>

          {/* Helpdesk Toll-Free (Desktop only) */}
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a7f3d0', fontSize: '11.5px' }}>
              <PhoneCall size={12} color="#f59e0b" />
              <span>{helpdeskText}</span>
            </div>
          </div>
        </div>
      </div>


      {/* 2. MAIN INSTITUTIONAL HEADER BAR */}
      <div className="mobile-header-bar" style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
        <div
          className="gov-container-wide"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          {/* Logo & Portal Identity */}
          <div
            onClick={() => onTabChange('assistant')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', minWidth: 0, flexShrink: 0 }}
          >
            {/* SevaVaani Official Logo */}
            <img
              src="/logo.png"
              alt={language === 'en' ? 'SevaVaani Logo' : 'सेवावाणी लोगो'}
              className="mobile-logo-img"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
                flexShrink: 0
              }}
            />

            <div style={{ minWidth: 0 }}>
              <h1 className="mobile-brand-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0d4436', lineHeight: 1.1, letterSpacing: '-0.3px', margin: 0, whiteSpace: 'nowrap' }}>
                {t('appName')}
              </h1>
              <p className="hide-on-mobile" style={{ fontSize: '12.5px', color: '#475569', marginTop: '2px' }}>
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Language Selector Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f1f5f9',
                padding: '2px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}
            >
              {(['hi', 'mr', 'en'] as LanguageCode[]).map((lang) => {
                const labelsDesktop: Record<LanguageCode, string> = {
                  hi: 'हिंदी',
                  mr: 'मराठी',
                  en: 'English'
                };
                const labelsMobile: Record<LanguageCode, string> = {
                  hi: 'हि',
                  mr: 'म',
                  en: 'EN'
                };
                const active = language === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: active ? 700 : 500,
                      fontSize: '12px',
                      cursor: 'pointer',
                      backgroundColor: active ? '#0d4436' : 'transparent',
                      color: active ? '#ffffff' : '#475569',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span className="hide-on-mobile">{labelsDesktop[lang]}</span>
                    <span className="show-on-mobile">{labelsMobile[lang]}</span>
                  </button>
                );
              })}
            </div>

            {/* Accessibility Button (Desktop only on main bar) */}
            <button
              onClick={onOpenAccessibility}
              className="hide-on-mobile"
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

            {/* Notifications Bell (Desktop only on main bar) */}
            <button
              onClick={onOpenNotifications}
              className="hide-on-mobile"
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

            {/* User Profile / Sign In Pill (Desktop only on main bar) */}
            <button
              onClick={onOpenAuth}
              className="hide-on-mobile"
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

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: mobileMenuOpen ? '#0d4436' : '#f1f5f9',
                color: mobileMenuOpen ? '#ffffff' : '#0d4436',
                border: '1px solid #cbd5e1',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              className="mobile-nav-toggle"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-DOWN DRAWER MENU (Visible when hamburger is toggled) */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '3px solid #0d4436',
            boxShadow: 'var(--shadow-lg)',
            padding: '16px 20px',
            animation: 'subtle-fade-in 0.2s ease-out'
          }}
        >
          {/* Mobile Profile & Tools Row */}
          <div
            style={{
              paddingBottom: '12px',
              marginBottom: '12px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}
          >
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: user.role === 'operator' && user.isAuthenticated
                  ? '#fffbeb'
                  : (user.isAuthenticated ? '#ecfdf5' : '#f8fafc'),
                border: user.role === 'operator' && user.isAuthenticated
                  ? '1.5px solid #f59e0b'
                  : ('1.5px solid ' + (user.isAuthenticated ? '#10b981' : '#cbd5e1')),
                padding: '7px 12px',
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

            {/* Accessibility & Notifications */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  onOpenAccessibility();
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer'
                }}
                title="Accessibility Settings"
              >
                <Sliders size={14} color="#0d4436" />
                <span>Aa</span>
              </button>

              <button
                onClick={() => {
                  onOpenNotifications();
                  setMobileMenuOpen(false);
                }}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                title={t('notifications')}
              >
                <Bell size={15} color="#334155" />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      backgroundColor: '#ea580c',
                      color: '#ffffff',
                      borderRadius: '50%',
                      fontSize: '9px',
                      fontWeight: 700,
                      width: '16px',
                      height: '16px',
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
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    backgroundColor: active ? '#ecfdf5' : 'transparent',
                    color: active ? '#0d4436' : '#334155',
                    border: active ? '1.5px solid #a7f3d0' : '1px solid transparent',
                    fontWeight: active ? 700 : 500,
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  <Icon size={18} color={active ? '#059669' : '#64748b'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              paddingTop: '12px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              📞 टोल-फ्री: <strong>1800-000-DEMO</strong>
            </div>
          </div>
        </div>
      )}

      {/* 4. DEEP INSTITUTIONAL NAVIGATION BAR (Desktop only, hidden on mobile) */}
      <nav
        className="hide-on-mobile"
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
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
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
