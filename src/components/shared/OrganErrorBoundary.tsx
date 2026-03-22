// sacred-flow: antigravity — OrganErrorBoundary
// Isolates organ failures — one crash does NOT kill the organism

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  organName: string;
  children: ReactNode;
  silent?: boolean; // Render null instead of error card (for optional/decorative organs)
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class OrganErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[${this.props.organName.toUpperCase()}] crashed:`,
      error.message,
      errorInfo.componentStack
    );
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.silent) return null;
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '2rem',
          }}
        >
          <div
            style={{
              background: '#1a1a2e',
              border: '2px solid #ff4444',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
              fontFamily: 'monospace',
              color: '#e0e0e0',
            }}
          >
            <div
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#ff4444',
                marginBottom: '1rem',
              }}
            >
              ■ ORGAN FAILURE
            </div>
            <h2
              style={{
                fontSize: '1.2rem',
                color: '#FFB347',
                marginBottom: '0.5rem',
              }}
            >
              {this.props.organName}
            </h2>
            <p
              style={{
                fontSize: '0.75rem',
                color: '#999',
                marginBottom: '1.5rem',
                wordBreak: 'break-word',
              }}
            >
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={this.handleRestart}
              style={{
                background: 'transparent',
                border: '1px solid #FFB347',
                color: '#FFB347',
                padding: '0.5rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Restart Organ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default OrganErrorBoundary;
