import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled render error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.hash = '#services';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="gov-container" style={{ padding: '40px 16px', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              maxWidth: '640px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #fecaca',
              boxShadow: 'var(--shadow-md)',
              padding: '32px 28px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#991b1b', marginBottom: '10px' }}>
              {this.props.fallbackTitle || 'पृष्ठ लोड करने में समस्या आई (Page Load Issue)'}
            </h2>

            <p style={{ fontSize: '14.5px', color: '#4b5563', lineHeight: 1.6, marginBottom: '20px' }}>
              {this.props.fallbackMessage ||
                'इस सेवा की जानकारी प्रदर्शित करने में एक तकनीकी समस्या हुई है। कृपया सेवा सूची पर वापस लौटें या पुनः प्रयास करें।'}
            </p>

            {this.state.error && (
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#64748b',
                  textAlign: 'left',
                  marginBottom: '24px',
                  overflowX: 'auto',
                  maxHeight: '100px'
                }}
              >
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                className="btn-gov-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
              >
                <RefreshCw size={16} />
                सेवा सूची पर वापस जाएं (Back to Services)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
