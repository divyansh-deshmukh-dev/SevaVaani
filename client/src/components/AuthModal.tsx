import { useState } from 'react';
import { X, ShieldCheck, User, Phone, KeyRound, CheckCircle, LogOut, PhoneCall, Building2, Lock } from 'lucide-react';
import type { CitizenUser, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CitizenUser;
  onUpdateUser: (user: CitizenUser) => void;
  onOperatorLoginSuccess?: () => void;
  t: (key: string, fallback?: string) => string;
}

export function AuthModal({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onOperatorLoginSuccess,
  t
}: AuthModalProps) {
  const [authRoleTab, setAuthRoleTab] = useState<UserRole>('citizen');

  // Citizen auth state
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Operator auth state
  const [operatorId, setOperatorId] = useState('OP-8821');
  const [operatorPin, setOperatorPin] = useState('8821');
  const [department, setDepartment] = useState('Jan Seva Kendra / Helpdesk');

  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Citizen handlers
  const handleSendOtp = () => {
    if (mobile.length < 10) {
      setError('कृपया मान्य 10-अंकीय मोबाइल नंबर दर्ज करें');
      return;
    }
    setError('');
    setOtpSent(true);
    setOtp('123456');
  };

  const handleVerifyOtp = () => {
    if (otp !== '123456') {
      setError('गलत OTP। कृपया डेमो OTP 123456 का उपयोग करें।');
      return;
    }
    setError('');
    onUpdateUser({
      name: 'Ramesh Kumar',
      mobile: mobile,
      maskedAadhaar: 'XXXX-XXXX-1100',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      village: 'Shivpur',
      isGuest: false,
      isAuthenticated: true,
      role: 'citizen'
    });
    onClose();
  };

  const handleQuickDemoCitizenLogin = () => {
    setError('');
    onUpdateUser({
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
    onClose();
  };

  const handleContinueAsGuest = () => {
    setError('');
    onUpdateUser({
      name: 'Guest Citizen',
      mobile: 'XXXXXXXXXX',
      maskedAadhaar: 'XXXX-XXXX-XXXX',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      village: 'Gram Panchayat',
      isGuest: true,
      isAuthenticated: true,
      role: 'citizen'
    });
    onClose();
  };

  // Operator handlers
  const handleOperatorLogin = () => {
    if (!operatorId.trim() || !operatorPin.trim()) {
      setError('कृपया ऑपरेटर आईडी एवं पिन दर्ज करें');
      return;
    }
    if (operatorPin.trim() !== '8821' && operatorPin.trim() !== '123456') {
      setError('अमान्य पिन। कृपया डेमो पिन 8821 दर्ज करें।');
      return;
    }

    setError('');
    onUpdateUser({
      name: 'Rajesh Sharma',
      mobile: '9811223344',
      maskedAadhaar: 'XXXX-XXXX-8821',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      village: 'District CSC Center',
      isGuest: false,
      isAuthenticated: true,
      role: 'operator',
      operatorId: operatorId.trim().toUpperCase(),
      department: department
    });
    onClose();
    if (onOperatorLoginSuccess) {
      onOperatorLoginSuccess();
    }
  };

  const handleQuickDemoOperatorLogin = () => {
    setError('');
    onUpdateUser({
      name: 'Rajesh Sharma',
      mobile: '9811223344',
      maskedAadhaar: 'XXXX-XXXX-8821',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      village: 'District CSC Center',
      isGuest: false,
      isAuthenticated: true,
      role: 'operator',
      operatorId: 'OP-8821',
      department: 'Jan Seva Kendra / Helpdesk Support'
    });
    onClose();
    if (onOperatorLoginSuccess) {
      onOperatorLoginSuccess();
    }
  };

  const handleSignOut = () => {
    onUpdateUser({
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
    setOtpSent(false);
    setOtp('');
    setError('');
    onClose();
  };

  return (
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
          width: '100%',
          maxWidth: '480px',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'subtle-fade-in 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: user.role === 'operator' && user.isAuthenticated ? '#78350f' : '#0d4436',
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user.role === 'operator' && user.isAuthenticated ? (
              <PhoneCall size={20} color="#fde047" />
            ) : (
              <User size={20} color="#a7f3d0" />
            )}
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
              {user.isAuthenticated
                ? (user.role === 'operator' ? 'ऑपरेटर प्रोफाइल (Operator Console)' : t('myProfileTitle', 'नागरिक प्रोफाइल'))
                : t('signIn', 'सुरक्षित लॉगिन (Sign In)')}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {user.isAuthenticated && !user.isGuest ? (
            /* Logged in User Summary Card (Citizen or Operator) */
            <div>
              {user.role === 'operator' ? (
                /* Operator Profile Display */
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    backgroundColor: '#fffbeb',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1.5px solid #fde68a',
                    marginBottom: '20px'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#92400e',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '16px'
                    }}
                  >
                    OP
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: '#78350f' }}>
                      {user.name} ({user.operatorId || 'OP-8821'})
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#b45309', fontWeight: 600 }}>
                      🎧 अधिकृत हेल्पडेस्क ऑपरेटर (Level 3 Escalation Desk)
                    </div>
                  </div>
                </div>
              ) : (
                /* Citizen Profile Display */
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    backgroundColor: '#ecfdf5',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #a7f3d0',
                    marginBottom: '20px'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#0d4436',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '18px'
                    }}
                  >
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: '#065f46' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#047857' }}>
                      सत्यापित नागरिक (Verified Citizen)
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>भूमिका (Role):</span>
                  <span style={{ fontWeight: 700, color: user.role === 'operator' ? '#b45309' : '#047857' }}>
                    {user.role === 'operator' ? 'हेल्पडेस्क ऑपरेटर (Operator)' : 'नागरिक (Citizen)'}
                  </span>
                </div>
                {user.role === 'operator' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>विभाग (Department):</span>
                    <span style={{ fontWeight: 600 }}>{user.department || 'CSC Helpdesk'}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>मोबाइल:</span>
                  <span style={{ fontWeight: 600 }}>{user.mobile}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>मास्क किया आधार:</span>
                  <span style={{ fontWeight: 600 }}>{user.maskedAadhaar}</span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="btn-gov-outline"
                style={{ width: '100%', color: '#b91c1c', borderColor: '#f87171', justifyContent: 'center' }}
              >
                <LogOut size={16} />
                {t('signOut', 'लॉग आउट (Sign Out)')}
              </button>
            </div>
          ) : (
            /* Role-Based Login Tabs: Citizen vs Operator */
            <div>
              {/* Role Selection Switcher */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  backgroundColor: '#f1f5f9',
                  padding: '4px',
                  borderRadius: '10px',
                  marginBottom: '20px'
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setAuthRoleTab('citizen');
                    setError('');
                  }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: authRoleTab === 'citizen' ? '#0d4436' : 'transparent',
                    color: authRoleTab === 'citizen' ? '#ffffff' : '#475569',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <User size={15} />
                  {t('loginCitizenTab', 'नागरिक लॉगिन')}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthRoleTab('operator');
                    setError('');
                  }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: authRoleTab === 'operator' ? '#92400e' : 'transparent',
                    color: authRoleTab === 'operator' ? '#ffffff' : '#475569',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <PhoneCall size={15} />
                  {t('loginOperatorTab', 'ऑपरेटर डेस्क')}
                </button>
              </div>

              {error && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '16px'
                  }}
                >
                  {error}
                </div>
              )}

              {/* TAB 1: CITIZEN AUTHENTICATION */}
              {authRoleTab === 'citizen' && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#fef3c7',
                      border: '1px solid #fde68a',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '12.5px',
                      color: '#92400e',
                      marginBottom: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <ShieldCheck size={18} color="#d97706" style={{ flexShrink: 0 }} />
                    <span>
                      डेमो नागरिक प्रमाणीकरण: <strong>OTP: 123456</strong> का उपयोग करें।
                    </span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      मोबाइल नंबर (Mobile Number)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        maxLength={10}
                        placeholder="10-अंकीय मोबाइल नंबर..."
                        style={{
                          width: '100%',
                          padding: '11px 12px 11px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '15px'
                        }}
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        6-अंकीय डेमो OTP (Use: 123456)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <KeyRound size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          placeholder="123456"
                          style={{
                            width: '100%',
                            padding: '11px 12px 11px 36px',
                            borderRadius: '8px',
                            border: '1.5px solid #0d4436',
                            fontSize: '17px',
                            fontWeight: 700,
                            letterSpacing: '3px'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {otpSent ? (
                      <button
                        onClick={handleVerifyOtp}
                        className="btn-gov-primary"
                        style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
                      >
                        <CheckCircle size={17} />
                        OTP सत्यापित करें और नागरिक लॉगिन करें
                      </button>
                    ) : (
                      <button
                        onClick={handleSendOtp}
                        className="btn-gov-primary"
                        style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
                      >
                        डेमो OTP प्राप्त करें
                      </button>
                    )}

                    <button
                      onClick={handleQuickDemoCitizenLogin}
                      className="btn-gov-outline"
                      style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '13px' }}
                    >
                      ✓ {t('demoCitizenLogin', 'डेमो नागरिक लॉगिन (1-Click)')}
                    </button>

                    <button
                      onClick={handleContinueAsGuest}
                      className="btn-gov-ghost"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      अतिथि नागरिक के रूप में जारी रखें (Guest)
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: OPERATOR AUTHENTICATION */}
              {authRoleTab === 'operator' && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#fffbeb',
                      border: '1.5px solid #fde68a',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '12.5px',
                      color: '#92400e',
                      marginBottom: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Lock size={18} color="#d97706" style={{ flexShrink: 0 }} />
                    <span>
                      अधिकृत ऑपरेटर कंसोल: <strong>ID: OP-8821</strong> | <strong>PIN: 8821</strong>
                    </span>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      {t('operatorIdLabel', 'ऑपरेटर पहचान क्रमांक (Operator ID)')}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                      <input
                        type="text"
                        value={operatorId}
                        onChange={(e) => setOperatorId(e.target.value)}
                        placeholder="OP-8821"
                        style={{
                          width: '100%',
                          padding: '11px 12px 11px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '14.5px',
                          fontWeight: 600
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      {t('operatorPinLabel', 'सुरक्षा पिन (PIN / Access Code)')}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                      <input
                        type="password"
                        value={operatorPin}
                        onChange={(e) => setOperatorPin(e.target.value)}
                        placeholder="8821"
                        style={{
                          width: '100%',
                          padding: '11px 12px 11px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '15px',
                          letterSpacing: '2px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      {t('operatorDeptLabel', 'विभाग / केंद्र (Department / Center)')}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building2 size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Jan Seva Kendra / Helpdesk"
                        style={{
                          width: '100%',
                          padding: '11px 12px 11px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13.5px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      onClick={handleOperatorLogin}
                      className="btn-gov-primary"
                      style={{
                        width: '100%',
                        padding: '12px',
                        justifyContent: 'center',
                        backgroundColor: '#92400e'
                      }}
                    >
                      <PhoneCall size={17} />
                      {t('loginAsOperator', 'ऑपरेटर डेस्क पर लॉगिन करें')}
                    </button>

                    <button
                      onClick={handleQuickDemoOperatorLogin}
                      className="btn-gov-outline"
                      style={{
                        width: '100%',
                        padding: '10px',
                        justifyContent: 'center',
                        fontSize: '13px',
                        borderColor: '#f59e0b',
                        color: '#92400e'
                      }}
                    >
                      🎧 {t('demoOperatorLogin', 'डेमो ऑपरेटर लॉगिन (1-Click)')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
