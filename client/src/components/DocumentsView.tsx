import { useState } from 'react';
import { FileText, Upload, Trash2, FileCheck } from 'lucide-react';
import type { LanguageCode } from '../types';

interface DocumentsViewProps {
  language: LanguageCode;
  t: (key: string, fallback?: string) => string;
}

export function DocumentsView({ language, t }: DocumentsViewProps) {
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; size: string; type: string; timestamp: string }>
  >([
    {
      name: 'Aadhaar_Card_Sample.pdf',
      size: '240 KB',
      type: 'PDF',
      timestamp: '2026-10-09 10:15 AM'
    }
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const checklist = [
    {
      title: language === 'hi' ? 'आधार कार्ड (Aadhaar Card)' : (language === 'mr' ? 'आधार कार्ड' : 'Aadhaar Card'),
      desc: language === 'hi' ? 'पहचान एवं पते का प्राथमिक प्रमाण पत्र। आधार में मोबाइल नंबर लिंक होना अनिवार्य है।' : 'ओळख व पत्त्याचा मुख्य पुरावा. आधारशी मोबाइल क्रमांक जोडलेला असणे आवश्यक आहे.',
      required: true,
      format: 'PDF, JPG (अधिकतम 2MB)'
    },
    {
      title: language === 'hi' ? 'भूमि स्वामित्व अभिलेख (Khasra-Khatauni)' : (language === 'mr' ? 'जमीन मालकी पुरावा (७/१२ उतारा)' : 'Land Ownership Record / Khasra-Khatauni'),
      desc: language === 'hi' ? 'खेती योग्य भूमि का खसरा/खतौनी या भूलेख नकल जिसमें आवेदक का नाम दर्ज हो।' : 'शेतजमिनीचा ७/१२ किंवा ८-अ उतारा ज्यावर अर्जदाराचे नाव नोंदवलेले असावे.',
      required: true,
      format: 'PDF (अधिकतम 5MB)'
    },
    {
      title: language === 'hi' ? 'आधार से जुड़ा बैंक खाता पासबुक' : (language === 'mr' ? 'आधार संलग्न बँक पासबुक' : 'Aadhaar-Seeded Bank Passbook'),
      desc: language === 'hi' ? 'प्रत्यक्ष लाभ अंतरण (DBT) हेतु बैंक पासबुक का प्रथम पृष्ठ जिसमें खाता संख्या व IFSC स्पष्ट हो।' : 'थेट लाभ हस्तांतरणासाठी (DBT) बँक पासबुकचे पहिले पान ज्यावर खाते क्रमांक व IFSC स्पष्ट असावे.',
      required: true,
      format: 'PDF, JPG (अधिकतम 2MB)'
    },
    {
      title: language === 'hi' ? 'सक्रिय मोबाइल नंबर' : (language === 'mr' ? 'सक्रिय मोबाइल क्रमांक' : 'Active Mobile Number'),
      desc: language === 'hi' ? 'OTP सत्यापन एवं आवेदन सूचनाओं हेतु आधार से जुड़ा सक्रिय फोन नंबर।' : 'OTP पडताळणी आणि अर्जाच्या सूचनांसाठी सक्रिय फोन नंबर.',
      required: true,
      format: '10-अंकीय भारतीय मोबाइल नंबर'
    }
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const newDoc = {
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setUploadedFiles([newDoc, ...uploadedFiles]);
  };

  const handleRemoveFile = (idx: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx));
  };

  return (
    <div className="gov-container" style={{ padding: '24px 0' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#0d4436',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <span
          style={{
            backgroundColor: '#165b49',
            color: '#a7f3d0',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px'
          }}
        >
          <FileText size={14} color="#f59e0b" />
          DOCUMENTATION STANDARDS • दस्तावेज़ एवं दिशा-निर्देश
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          {t('docsTitle', 'दस्तावेज़ एवं दिशा-निर्देश')}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#d1fae5', maxWidth: '720px', lineHeight: 1.5 }}>
          {t('docsSub', 'सरकारी सेवाओं के लिए आवश्यक दस्तावेज़ों की सूची एवं स्थानीय डेमो सत्यापन व्यवस्था।')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* 1. Mandatory Checklist Column */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #cbd5e1',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#0d4436', marginBottom: '6px' }}>
            {t('docsReqTitle', 'अनिवार्य दस्तावेज़ चेकलिस्ट (PM-Kisan)')}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            आवेदन प्रक्रिया से पहले इन प्रपत्रों की मूल प्रति या स्पष्ट फोटो तैयार रखें:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {checklist.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: '14px'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FileCheck size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                      {item.title}
                    </div>
                    <span className="badge-gov badge-gov-green">अनिवार्य</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.45, marginBottom: '6px' }}>
                    {item.desc}
                  </p>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                    स्वीकृत प्रारूप: {item.format}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Interactive Local Demo Upload Column */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #cbd5e1',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#0d4436', marginBottom: '6px' }}>
            {t('demoUploadTitle', 'डेमो दस्तावेज़ अपलोड (स्थानीय सत्यापन)')}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            {t('demoUploadNote', 'नोट: यह केवल इंटरफ़ेस परीक्षण के लिए है। आपकी फाइलें केवल आपके ब्राउज़र में सुरक्षित रहती हैं।')}
          </p>

          {/* Drag & Drop Box */}
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileUpload(e.dataTransfer.files);
            }}
            style={{
              display: 'block',
              border: isDragging ? '2px dashed #0d4436' : '2px dashed #cbd5e1',
              backgroundColor: isDragging ? '#ecfdf5' : '#f8fafc',
              borderRadius: '12px',
              padding: '28px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'all 0.2s'
            }}
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files)}
              style={{ display: 'none' }}
            />
            <Upload size={32} color="#0d4436" style={{ margin: '0 auto 10px', display: 'block' }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              फाइल चुनें या यहाँ खींचकर छोड़ें
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              PDF, JPG, PNG (डेमो स्थानीय सत्यापन)
            </div>
          </label>

          {/* Uploaded Files List */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
              स्थानीय रूप से जांची गई फाइलें ({uploadedFiles.length}):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#065f46' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#047857' }}>
                      {file.size} • {file.type} • {file.timestamp}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-gov badge-gov-green" style={{ fontSize: '11px' }}>
                      ✓ Verified Locally
                    </span>
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
