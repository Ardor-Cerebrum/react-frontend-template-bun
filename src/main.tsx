import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#0d1715', color: '#ff9278', fontFamily: 'monospace', minHeight: '100vh', lineHieght: '1.6' }}>
          <h1 style={{ fontFamily: 'sans-serif', color: '#ff7657' }}>🚨 Application Runtime Crash</h1>
          <p style={{ color: '#a5b5ab' }}>An uncaught React error occurred during page render:</p>
          <pre style={{ background: '#13201d', color: '#ff9278', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255, 118, 87, 0.2)', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.stack || this.state.error?.message}
          </pre>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }} 
            style={{ background: '#b9f25f', color: '#102014', border: 'none', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' }}
          >
            Reset Local Cache & Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
