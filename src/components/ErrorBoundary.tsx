import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Future: Integration with Sentry or similar tracking
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-white p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="text-center w-full max-w-md">
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-red-100 shadow-sm">
                <svg
                  className="h-10 w-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-500 mb-10 text-lg leading-relaxed font-medium">
              We encountered an unexpected error. Don't worry, your data is safe. Please try refreshing or return home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all active:scale-95"
              >
                Go to Homepage
              </button>
            </div>

            {this.state.error && isDev && (
              <div className="mt-8 text-left">
                <details className="group bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden transition-all">
                  <summary className="cursor-pointer font-bold text-slate-600 px-6 py-4 list-none flex items-center justify-between hover:bg-slate-100/50 transition-colors">
                    <span className="flex items-center gap-2">
                      <code className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Debug Info</code>
                      Technical Details
                    </span>
                    <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-2">
                    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-inner">
                      <pre className="text-[11px] text-red-600 font-mono overflow-auto max-h-[300px] leading-relaxed whitespace-pre-wrap">
                        <span className="font-bold underline mb-2 block">{this.state.error.toString()}</span>
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
