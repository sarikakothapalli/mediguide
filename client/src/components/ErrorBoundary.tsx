import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="min-h-screen grid place-items-center p-8 bg-background">
        <section className="w-full max-w-xl rounded-2xl border bg-white p-8 text-center shadow-sm">
          <AlertTriangle size={44} className="mx-auto mb-4 text-red-600" />
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-600">Reload the page. If the problem persists, check the browser console and server log.</p>
          {this.state.error && <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-3 text-left text-xs">{this.state.error.message}</pre>}
          <button onClick={() => window.location.reload()} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white">
            <RotateCcw size={16} /> Reload page
          </button>
        </section>
      </main>
    );
  }
}
