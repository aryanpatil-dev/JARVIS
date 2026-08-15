import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Power } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClose = () => {
    window.jarvisAPI?.window.close();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#08090b',
            color: '#f8fafc',
            fontFamily: 'var(--font-mono)',
            padding: '24px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: '#0c0f16',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444' }}>
              <AlertTriangle size={24} />
              <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em' }}>
                JARVIS CORE // SYSTEM FAULT RECOVERY
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
              An unexpected render anomaly occurred in the UI pipeline. Diagnostic logs have been recorded for inspection.
            </p>

            {this.state.error && (
              <div
                style={{
                  backgroundColor: '#07090e',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  padding: '10px',
                  fontSize: '11px',
                  color: '#f87171',
                  maxHeight: '160px',
                  overflowY: 'auto',
                }}
              >
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={this.handleClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  color: '#94a3b8',
                  padding: '8px 14px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                <Power size={13} />
                <span>EXIT</span>
              </button>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#38bdf8',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#08090b',
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={13} />
                <span>RESTORE UI</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
