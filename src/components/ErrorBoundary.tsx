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
        <div className="min-h-[200px] flex flex-col items-center justify-center bg-ink-medium/40 border border-rose-500/10 rounded-sm p-8">
          <div className="text-center max-w-md w-full">
            <div className="font-mono text-[0.48rem] tracking-[0.28em] text-rose-400/60 uppercase mb-4">
              SYSTEM FAULT
            </div>
            <h1 className="font-serif text-2xl font-light text-paper mb-3">
              Something broke in the mesh.
            </h1>
            {import.meta.env.DEV && this.state.error && (
              <pre className="font-mono text-[0.55rem] text-rose-400/70 mb-6 overflow-x-auto whitespace-pre-wrap break-all text-left">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleRetry}
              className="border border-white/[0.12] text-paper-dim font-mono text-[0.55rem] tracking-[0.1em] uppercase px-4 py-2 hover:border-gold/40 hover:text-gold transition-all duration-200"
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
