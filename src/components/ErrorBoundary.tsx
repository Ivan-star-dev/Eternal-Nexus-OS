// sacred-flow: app-level — ErrorBoundary
// Catches unhandled runtime errors and prevents full app crash

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error.message, errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0f1a', padding: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.28em', color: '#f87171', textTransform: 'uppercase', marginBottom: '1rem' }}>
              SYSTEM FAULT
            </div>
            <h1 style={{ fontFamily: 'serif', fontSize: '1.5rem', fontWeight: 300, color: '#e2e8f0', marginBottom: '1rem' }}>
              Something broke in the mesh.
            </h1>
            {import.meta.env.DEV && this.state.error && (
              <pre style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#fca5a5', marginBottom: '1.5rem', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', textAlign: 'left', background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '4px' }}>
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleRetry}
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.5rem 1rem', cursor: 'pointer', background: 'transparent' }}
            >
              RETRY
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
