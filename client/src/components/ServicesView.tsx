import { useState } from 'react';
import { Search, ChevronRight, ExternalLink, ShieldCheck, FileText } from 'lucide-react';
import type { LanguageCode, ServiceDefinition } from '../types';

interface ServicesViewProps {
  language: LanguageCode;
  services: ServiceDefinition[];
  onSelectService: (service: ServiceDefinition) => void;
  onApplyService: (serviceId: string) => void;
  t: (key: string, fallback?: string) => string;
}

export function ServicesView({
  language,
  services,
  onSelectService,
  onApplyService,
  t
}: ServicesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: language === 'hi' ? 'सभी सेवाएं' : (language === 'mr' ? 'सर्व सेवा' : 'All Schemes') },
    { id: 'agriculture', label: language === 'hi' ? 'कृषि एवं किसान' : (language === 'mr' ? 'शेती व शेतकरी' : 'Agriculture') },
    { id: 'food_security', label: language === 'hi' ? 'खाद्य सुरक्षा' : (language === 'mr' ? 'अन्न सुरक्षा' : 'Food Security') },
    { id: 'social_welfare', label: language === 'hi' ? 'सामाजिक सुरक्षा' : (language === 'mr' ? 'सामाजिक सुरक्षा' : 'Social Welfare') },
    { id: 'education', label: language === 'hi' ? 'शिक्षा एवं छात्रवृत्ति' : (language === 'mr' ? 'शिक्षण व शिष्यवृत्ती' : 'Education') },
    { id: 'housing', label: language === 'hi' ? 'आवास योजना' : (language === 'mr' ? 'घरकुल योजना' : 'Housing') }
  ];

  const filtered = services.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const nameStr = (s.name[language] || s.name.en || '').toLowerCase();
    const descStr = (s.description[language] || s.description.en || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || nameStr.includes(q) || descStr.includes(q);
    return matchesCategory && matchesQuery;
  });

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
          <ShieldCheck size={14} color="#f59e0b" />
          PUBLIC WELFARE CATALOG • नागरिक योजनाएं
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          {t('popularServicesTitle', 'सरकारी सेवाओं की निर्देशिका')}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#d1fae5', maxWidth: '720px', lineHeight: 1.5 }}>
          {t('popularServicesSub', 'उपलब्ध जन कल्याणकारी योजनाएं एवं ऑनलाइन डेमो सुविधाएं। किसी भी सेवा के लिए आवाज़ से पूछताछ या आवेदन करें।')}
        </p>
      </div>

      {/* Search and Category Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
        {/* Search input */}
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '15px' }} />
          <input
            type="text"
            placeholder={language === 'hi' ? 'योजना का नाम खोजें (उदा. किसान, पेंशन, राशन, छात्रवृत्ति)...' : (language === 'mr' ? 'योजनेचे नाव शोधा (उदा. शेतकरी, पेन्शन, रेशन)...' : 'Search scheme name or keywords...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '13px 16px 13px 44px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              fontSize: '15px',
              outline: 'none',
              backgroundColor: '#ffffff'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              style={{
                padding: '7px 16px',
                borderRadius: '20px',
                border: selectedCategory === c.id ? '1.5px solid #0d4436' : '1px solid #cbd5e1',
                backgroundColor: selectedCategory === c.id ? '#0d4436' : '#ffffff',
                color: selectedCategory === c.id ? '#ffffff' : '#334155',
                fontSize: '13px',
                fontWeight: selectedCategory === c.id ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filtered.map((service) => {
          const isDirect = service.directApplicationSupported;
          return (
            <div
              key={service.serviceId}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: isDirect ? '2px solid #86efac' : '1px solid #cbd5e1',
                boxShadow: isDirect ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
            >
              <div>
                {/* Header tags */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className={`badge-gov ${isDirect ? 'badge-gov-green' : 'badge-gov-blue'}`}>
                    {isDirect ? '✓ ऑनलाइन डेमो आवेदन उपलब्ध' : 'मार्गदर्शन उपलब्ध'}
                  </span>
                  <span className="badge-gov badge-gov-proto">Demo</span>
                </div>

                {/* Scheme Title */}
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d4436', marginBottom: '8px', lineHeight: 1.3 }}>
                  {service.name[language] || service.name.hi}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                  {service.description[language] || service.description.hi}
                </p>

                {/* Documents requirement badge */}
                <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={13} color="#0d4436" />
                    आवश्यक दस्तावेज़:
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {service.requiredDocuments?.map((d) => d[language] || d.hi).slice(0, 2).join(' • ')}
                    {service.requiredDocuments && service.requiredDocuments.length > 2 ? ' व अन्य' : ''}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {isDirect ? (
                    <button
                      onClick={() => onApplyService(service.serviceId)}
                      className="btn-gov-primary"
                      style={{ flex: 1 }}
                    >
                      <ChevronRight size={16} />
                      {t('applyNow', 'आवेदन करें')}
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectService(service)}
                      className="btn-gov-outline"
                      style={{ flex: 1 }}
                    >
                      <FileText size={15} />
                      {t('howToApply', 'मार्गदर्शन देखें')}
                    </button>
                  )}
                </div>

                {service.officialSource && (
                  <div style={{ marginTop: '10px', fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>आधिकारिक संदर्भ: {service.officialSource}</span>
                    <ExternalLink size={12} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
