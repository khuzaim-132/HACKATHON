import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in CarePulse App:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 p-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="text-rose-600" size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Oops! Something went wrong.</h1>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              We encountered a runtime error. Don't worry, your data is safe. Please try refreshing the page.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
              >
                <RefreshCcw size={20} />
                <span>Reload Application</span>
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full py-4 bg-white text-slate-600 font-bold rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition-all"
              >
                Back to Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-slate-50 rounded-2xl text-left overflow-auto max-h-40">
                <code className="text-xs text-rose-500 font-mono">
                  {this.state.error && this.state.error.toString()}
                </code>
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
