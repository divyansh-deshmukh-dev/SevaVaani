import { useState } from 'react';
import { X, ShieldCheck, User, Phone, KeyRound, CheckCircle, LogOut } from 'lucide-react';
import type { CitizenUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CitizenUser;
  onUpdateUser: (user: CitizenUser) => void;
  t: (key: string, fallback?: string) => string;
}

export function AuthModal({ isOpen, onClose, user, onUpdateUser, t }: AuthModalProps) {
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (mobile.length < 10) {
      setError('कृपया मान्य 10-अंकीय मोबाइल नंबर दर्ज करें');
      return;
    }
    setError('');
    setOtpSent(true);
    setOtp('123456'); // Pre-fill or highlight demo OTP
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
      isAuthenticated: true
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
      isAuthenticated: true
    });
    onClose();
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
      isAuthenticated: false
    });
    setOtpSent(false);
    setOtp('');
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
          maxWidth: '460px',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'subtle-fade-in 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#0d4436',
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="#a7f3d0" />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
              {user.isAuthenticated ? t('myProfileTitle', 'नागरिक प्रोफाइल') : t('signIn', 'नागरिक प्रवेश (Sign In)')}
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
            /* Logged in citizen profile summary */
            <div>
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
                  RK
                </div>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: '#065f46' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#047857' }}>
                    सत्यापित नागरिक (Verified Demo Citizen)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>मोबाइल:</span>
                  <span style={{ fontWeight: 600 }}>{user.mobile}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>मास्क किया आधार:</span>
                  <span style={{ fontWeight: 600 }}>{user.maskedAadhaar}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>स्थान (Location):</span>
                  <span style={{ fontWeight: 600 }}>{user.village}, {user.district}, {user.state}</span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="btn-gov-outline"
                style={{ width: '100%', color: '#b91c1c', borderColor: '#f87171' }}
              >
                <LogOut size={16} />
                {t('signOut', 'लॉग आउट')}
              </button>
            </div>
          ) : (
            /* Sign In / OTP Verification Flow */
            <div>
              <div
                style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '12.5px',
                  color: '#92400e',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ShieldCheck size={18} color="#d97706" />
                <span>
                  डेमो प्रमाणीकरण: <strong>OTP: 123456</strong> का उपयोग करें। कोई वास्तविक एसएमएस नहीं भेजा जाता।
                </span>
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

              {otpSent ? (
                <div style={{ marginBottom: '20px' }}>
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
                  <div style={{ fontSize: '12px', color: '#059669', marginTop: '6px', fontWeight: 600 }}>
                    ✓ डेमो OTP स्वतः भरा गया है (123456)
                  </div>
                </div>
              ) : null}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {otpSent ? (
                  <button
                    onClick={handleVerifyOtp}
                    className="btn-gov-primary"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    <CheckCircle size={17} />
                    OTP सत्यापित करें और लॉगिन करें
                  </button>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    className="btn-gov-primary"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    डेमो OTP प्राप्त करें
                  </button>
                )}

                <button
                  onClick={handleContinueAsGuest}
                  className="btn-gov-ghost"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  अतिथि के रूप में जारी रखें (Continue as Guest)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
