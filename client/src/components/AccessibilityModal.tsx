import { X, Sliders, Check } from 'lucide-react';
import type { AccessibilitySettings } from '../types';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (settings: AccessibilitySettings) => void;
  t: (key: string, fallback?: string) => string;
}

export function AccessibilityModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  t
}: AccessibilityModalProps) {
  if (!isOpen) return null;

  const handleTextSize = (size: 'normal' | 'large' | 'xlarge') => {
    onUpdateSettings({ ...settings, textSize: size });
  };

  const handleHighContrast = (val: boolean) => {
    onUpdateSettings({ ...settings, highContrast: val });
  };

  const handleReducedMotion = (val: boolean) => {
    onUpdateSettings({ ...settings, reducedMotion: val });
  };

  const handleVoiceSpeed = (speed: 'normal' | 'slow' | 'fast') => {
    onUpdateSettings({ ...settings, voiceSpeed: speed });
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
          overflow: 'hidden'
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
            <Sliders size={20} color="#a7f3d0" />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
              {t('accessibilityPref', 'सुलभता सेटिंग्स (Accessibility)')}
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
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. Text Size */}
          <div>
            <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
              {t('textSize', 'फ़ॉन्ट का आकार')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'normal', label: 'सामान्य (Default)' },
                { id: 'large', label: 'बड़ा (Large)' },
                { id: 'xlarge', label: 'अति बड़ा (XL)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTextSize(item.id as any)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '8px',
                    border: settings.textSize === item.id ? '2px solid #0d4436' : '1px solid #cbd5e1',
                    backgroundColor: settings.textSize === item.id ? '#ecfdf5' : '#ffffff',
                    color: settings.textSize === item.id ? '#0d4436' : '#334155',
                    fontWeight: settings.textSize === item.id ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. High Contrast */}
          <div>
            <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
              {t('highContrast', 'उच्च कंट्रास्ट (High Contrast)')}
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleHighContrast(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: !settings.highContrast ? '2px solid #0d4436' : '1px solid #cbd5e1',
                  backgroundColor: !settings.highContrast ? '#ecfdf5' : '#ffffff',
                  color: !settings.highContrast ? '#0d4436' : '#334155',
                  fontWeight: !settings.highContrast ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                मानक (Normal)
              </button>
              <button
                onClick={() => handleHighContrast(true)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: settings.highContrast ? '2px solid #0d4436' : '1px solid #cbd5e1',
                  backgroundColor: settings.highContrast ? '#ecfdf5' : '#ffffff',
                  color: settings.highContrast ? '#0d4436' : '#334155',
                  fontWeight: settings.highContrast ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                उच्च कंट्रास्ट (High Contrast)
              </button>
            </div>
          </div>

          {/* 3. Reduced Motion */}
          <div>
            <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
              {t('reducedMotion', 'धीमी एनिमेशन (Reduced Motion)')}
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleReducedMotion(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: !settings.reducedMotion ? '2px solid #0d4436' : '1px solid #cbd5e1',
                  backgroundColor: !settings.reducedMotion ? '#ecfdf5' : '#ffffff',
                  color: !settings.reducedMotion ? '#0d4436' : '#334155',
                  fontWeight: !settings.reducedMotion ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                सामान्य एनिमेशन
              </button>
              <button
                onClick={() => handleReducedMotion(true)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: settings.reducedMotion ? '2px solid #0d4436' : '1px solid #cbd5e1',
                  backgroundColor: settings.reducedMotion ? '#ecfdf5' : '#ffffff',
                  color: settings.reducedMotion ? '#0d4436' : '#334155',
                  fontWeight: settings.reducedMotion ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                धीमी एनिमेशन (Reduced)
              </button>
            </div>
          </div>

          {/* 4. Voice Speed */}
          <div>
            <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
              {t('voiceSpeed', 'आवाज़ की गति (Voice Speed)')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'slow', label: 'धीमी (0.8x)' },
                { id: 'normal', label: 'सामान्य (1.0x)' },
                { id: 'fast', label: 'तेज़ (1.2x)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleVoiceSpeed(item.id as any)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '8px',
                    border: settings.voiceSpeed === item.id ? '2px solid #0d4436' : '1px solid #cbd5e1',
                    backgroundColor: settings.voiceSpeed === item.id ? '#ecfdf5' : '#ffffff',
                    color: settings.voiceSpeed === item.id ? '#0d4436' : '#334155',
                    fontWeight: settings.voiceSpeed === item.id ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-gov-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            <Check size={18} />
            {t('saveChanges', 'सेटिंग्स लागू करें')}
          </button>
        </div>
      </div>
    </div>
  );
}
