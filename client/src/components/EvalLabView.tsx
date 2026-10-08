import { Activity, BarChart3 } from 'lucide-react';
import type { LanguageCode } from '../types';

interface EvalLabViewProps {
  language: LanguageCode;
  refText: string;
  hypText: string;
  onSetRefText: (val: string) => void;
  onSetHypText: (val: string) => void;
  werResult: any;
  metricsData: any;
  onCalcWer: () => void;
  t: (key: string, fallback?: string) => string;
}

export function EvalLabView({
  language: _language,
  refText,
  hypText,
  onSetRefText,
  onSetHypText,
  werResult,
  metricsData,
  onCalcWer,
  t
}: EvalLabViewProps) {
  return (
    <div className="gov-container" style={{ padding: '24px 0', maxWidth: '880px' }}>
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
          <Activity size={14} color="#f59e0b" />
          SPEECH RECOGNITION EVALUATION • मूल्यांकन व मेट्रिक्स
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          {t('evalTitle', 'शब्द त्रुटि दर (WER) एवं सिस्टम प्रदर्शन प्रयोगशाला')}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#d1fae5', lineHeight: 1.5 }}>
          बहुभाषी आवाज़ पहचान की गुणवत्ता को लेवेनश्टाइन गतिशील प्रोग्रामिंग (Levenshtein Alignment) द्वारा मापा जाता है: <code>WER = (S + D + I) / N</code>
        </p>
      </div>

      {/* 1. WER Calculator Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #cbd5e1',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px'
        }}
      >
        <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#0d4436', marginBottom: '16px' }}>
          Word Error Rate (WER) संरेखण विश्लेषक
        </h3>

        {/* Text areas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              {t('refText', 'संदर्भ मूल पाठ (Ground Truth Reference)')}
            </label>
            <textarea
              rows={3}
              value={refText}
              onChange={(e) => onSetRefText(e.target.value)}
              placeholder="मूल बोला गया वाक्य दर्ज करें..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                lineHeight: 1.4
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              {t('hypText', 'पहचाना गया पाठ (Hypothesis Transcript)')}
            </label>
            <textarea
              rows={3}
              value={hypText}
              onChange={(e) => onSetHypText(e.target.value)}
              placeholder="आवाज़ पहचान से प्राप्त वाक्य..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                lineHeight: 1.4
              }}
            />
          </div>
        </div>

        {/* Action Controls & Presets */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onCalcWer} className="btn-gov-primary">
              <Activity size={16} />
              {t('calcWer', 'WER की गणना करें')}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>नमूना परीक्षण:</span>
            <button
              onClick={() => {
                onSetRefText('मेरा नाम रमेश कुमार है');
                onSetHypText('मेरा नाम रमेश कुमार है');
              }}
              className="btn-gov-ghost"
              style={{ padding: '4px 8px', fontSize: '11.5px' }}
            >
              हिंदी (Perfect)
            </button>
            <button
              onClick={() => {
                onSetRefText('मला शेतकरी योजनेसाठी अर्ज करायचा आहे');
                onSetHypText('मला शेतकरी योजना अर्ज करायचा आहे');
              }}
              className="btn-gov-ghost"
              style={{ padding: '4px 8px', fontSize: '11.5px' }}
            >
              मराठी (1 Deletion)
            </button>
            <button
              onClick={() => {
                onSetRefText('I want to register for PM Kisan scheme');
                onSetHypText('I want register for Kisan scheme');
              }}
              className="btn-gov-ghost"
              style={{ padding: '4px 8px', fontSize: '11.5px' }}
            >
              English
            </button>
          </div>
        </div>

        {/* WER Result Grid */}
        {werResult && (
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0d4436' }}>
                  {werResult.werPercentage || `${Math.round(werResult.wer * 100)}%`}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '2px' }}>
                  Word Error Rate (WER)
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#dc2626' }}>
                  {werResult.substitutions}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '2px' }}>
                  प्रतिस्थापन (Substitutions)
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#ea580c' }}>
                  {werResult.deletions}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '2px' }}>
                  विलोपन (Deletions)
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#2563eb' }}>
                  {werResult.insertions}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '2px' }}>
                  सन्निवेश (Insertions)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. System Performance Dashboard Cards */}
      {metricsData && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #cbd5e1',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <BarChart3 size={20} color="#0d4436" />
            <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#0d4436' }}>
              सिस्टम प्रदर्शन मेट्रिक्स (Production Telemetry)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '12px', color: '#065f46', fontWeight: 700 }}>सत्र संख्या (Total Sessions)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0d4436', marginTop: '4px' }}>
                {metricsData.totalSessions}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '12px', color: '#166534', fontWeight: 700 }}>सफलता दर (Completion Rate)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
                {metricsData.completionRate}%
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>औसत लेटेंसी (Avg Latency)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {metricsData.averageLatencyMs} ms
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
              <div style={{ fontSize: '12px', color: '#9a3412', fontWeight: 700 }}>ऑपरेटर सहायता (Handoffs)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#c2410c', marginTop: '4px' }}>
                {metricsData.handoffCount}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
