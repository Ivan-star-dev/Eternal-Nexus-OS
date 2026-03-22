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
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full">
            <div className="font-mono text-[0.55rem] tracking-[0.25em] text-red-500 uppercase mb-6">
              ■ System Error
            </div>
            <h1 className="font-mono text-2xl text-white mb-3 tracking-tight">
              Something went wrong
            </h1>
            <p className="font-mono text-[0.7rem] text-neutral-400 mb-8 leading-relaxed">
              An unexpected error occurred. The organism detected a failure and isolated it.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-[0.6rem] font-mono text-red-400 bg-neutral-900 border border-red-900 rounded-lg p-4 mb-6 overflow-x-auto whitespace-pre-wrap break-all">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleRetry}
              className="font-mono text-[0.65rem] tracking-[0.2em] uppercase border border-amber-500/60 text-amber-400 px-6 py-2.5 rounded hover:border-amber-400 hover:text-amber-300 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
