import { ShieldCheck, Heart } from 'lucide-react';
import type { LanguageCode } from '../types';

interface FooterProps {
  language: LanguageCode;
  onTabChange: (tab: any) => void;
  t: (key: string, fallback?: string) => string;
}

export function Footer({ language: _language, onTabChange, t }: FooterProps) {
  return (
    <footer style={{ backgroundColor: '#092c22', color: '#ffffff', borderTop: '3px solid #165b49', marginTop: 'auto' }}>
      {/* 4-Column Directory */}
      <div className="gov-container-wide" style={{ padding: '40px 20px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          {/* Column 1: About & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #f97316 33%, #ffffff 33%, #ffffff 66%, #15803d 66%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #1e3a8a' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                {t('appName')}
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#a7f3d0', lineHeight: 1.6, marginBottom: '16px' }}>
              {t('footerAbout', 'सेवावाणी भारत के नागरिकों के लिए आवाज़-आधारित डिजिटल सार्वजनिक सेवाओं को सुलभ बनाने का एक शोध एवं विकास प्रोटोटाइप है।')}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#165b49', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', color: '#fef3c7' }}>
              <ShieldCheck size={13} color="#f59e0b" />
              <span>प्रोटोटाइप एमवीपी डेमो • 2026</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fde047', marginBottom: '14px' }}>
              {t('footerLinksTitle', 'त्वरित नेविगेशन')}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <li>
                <button
                  onClick={() => onTabChange('assistant')}
                  style={{ background: 'none', border: 'none', color: '#d1fae5', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  {t('navHome', 'नागरिक सहायक (Home)')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('services')}
                  style={{ background: 'none', border: 'none', color: '#d1fae5', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  {t('navServices', 'सरकारी योजना निर्देशिका')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('applications')}
                  style={{ background: 'none', border: 'none', color: '#d1fae5', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  {t('navApplications', 'मेरे आवेदन')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('track')}
                  style={{ background: 'none', border: 'none', color: '#d1fae5', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  {t('navTrack', 'आवेदन स्थिति ट्रैक करें')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('docs')}
                  style={{ background: 'none', border: 'none', color: '#d1fae5', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  {t('navDocs', 'आवश्यक दस्तावेज़')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Schemes */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fde047', marginBottom: '14px' }}>
              {t('footerServicesTitle', 'सार्वजनिक सेवाएं')}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#d1fae5' }}>
              <li>🌾 पीएम-किसान सम्मान निधि (Online Voice)</li>
              <li>🍚 राष्ट्रीय खाद्य सुरक्षा (राशन कार्ड)</li>
              <li>👴 राष्ट्रीय सामाजिक सहायता (वृद्धावस्था पेंशन)</li>
              <li>🎓 पोस्ट-मैट्रिक विद्यार्थी छात्रवृत्ति</li>
              <li>🏠 प्रधानमंत्री आवास योजना (ग्रामीण/शहरी)</li>
            </ul>
          </div>

          {/* Column 4: Prototype & Transparency */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fde047', marginBottom: '14px' }}>
              {t('footerLegalTitle', 'कानूनी एवं पारदर्शिता प्रकटीकरण')}
            </h4>
            <p style={{ fontSize: '12px', color: '#a7f3d0', lineHeight: 1.6, marginBottom: '12px' }}>
              यह प्रणाली एक डिजिटल पब्लिक सर्विस अनुसंधान प्रोटोटाइप है। यह किसी सरकारी मंत्रालय या NIC की आधिकारिक वेबसाइट नहीं है। यहाँ किया गया कोई भी आवेदन वास्तविक सरकारी सर्वर पर जमा नहीं होता।
            </p>
            <div style={{ fontSize: '12px', color: '#d1fae5' }}>
              📞 तकनीकी संपर्क: <strong>support@sevavaani.demo</strong>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #165b49',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#a7f3d0',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            {t('copyrightText', '© 2026 सेवावाणी (SevaVaani) • डिजिटल पब्लिक सर्विस प्रोटोटाइप। वास्तविक सरकारी वेबसाइट नहीं है।')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>निर्मित: बहुभाषी भारतीय नागरिकों के लिए</span>
            <Heart size={13} color="#f97316" fill="#f97316" />
          </div>
        </div>
      </div>
    </footer>
  );
}
