import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // This would typically send to an error reporting service like Sentry
    console.error('Error logged to service:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    // Copy error details to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        alert('Error details copied to clipboard. Please report this to the development team.');
      })
      .catch(() => {
        // Fallback: show error details in alert
        alert(`Error ID: ${this.state.errorId}\n\nPlease report this error to the development team.`);
      });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900/95 to-orange-900/95 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-gradient-to-br from-slate-900/95 to-red-900/95 backdrop-blur-lg rounded-3xl p-8 border border-red-500/30 shadow-2xl">
              {/* Error Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Error Title */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300 mb-2">
                  🧙‍♂️ Wizard's Spell Backfired!
                </h1>
                <p className="text-red-200/80 font-arcane text-lg">
                  Something went wrong with the magical incantation
                </p>
              </div>

              {/* Error Details */}
              <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-red-500/30">
                <h2 className="text-lg font-wizard text-white mb-4 flex items-center space-x-2">
                  <Bug className="w-5 h-5 text-red-400" />
                  <span>Error Details</span>
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-arcane text-red-300">Error ID:</span>
                    <span className="text-sm text-white font-mono ml-2">{this.state.errorId}</span>
                  </div>
                  
                  {this.state.error && (
                    <div>
                      <span className="text-sm font-arcane text-red-300">Message:</span>
                      <p className="text-sm text-white font-mono mt-1 bg-slate-900/50 p-2 rounded">
                        {this.state.error.message}
                      </p>
                    </div>
                  )}
                  
                  {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                    <div>
                      <span className="text-sm font-arcane text-red-300">Stack Trace:</span>
                      <pre className="text-xs text-white font-mono mt-1 bg-slate-900/50 p-2 rounded overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-wizard rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-wizard rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Reload Page</span>
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                >
                  <Home className="w-5 h-5" />
                  <span>Go Home</span>
                </button>
                
                <button
                  onClick={this.handleReportBug}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-wizard rounded-xl hover:from-orange-500 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
                >
                  <Bug className="w-5 h-5" />
                  <span>Report Bug</span>
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 text-center">
                <p className="text-red-200/60 font-arcane text-sm">
                  If this problem persists, please contact the development team with the Error ID above.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
