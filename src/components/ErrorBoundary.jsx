import { Component } from 'react';
import { RELOAD_KEY, isChunkError } from '../lib/chunk';

/* Catches render errors and failed page loads. A failed page load reloads once to pick up
   the new build, then falls back to a plain screen with a way out. */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false, key: props.resetKey };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  /* A new route clears the error screen. */
  static getDerivedStateFromProps(props, state) {
    return props.resetKey !== state.key ? { failed: false, key: props.resetKey } : null;
  }

  componentDidCatch(error) {
    if (!isChunkError(error)) return;
    let reloaded = false;
    try {
      reloaded = sessionStorage.getItem(RELOAD_KEY) === '1';
      if (!reloaded) sessionStorage.setItem(RELOAD_KEY, '1');
    } catch {
      reloaded = true;
    }
    if (!reloaded) window.location.reload();
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="section notfound" role="alert">
        <div className="wrap stack" style={{ '--gap': '1.25rem', textAlign: 'center', justifyItems: 'center' }}>
          <h1 className="h2">
            This page <em>skipped</em> a beat.
          </h1>
          <p className="lead">Something did not load. Reload the page, or head back to the start.</p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
              Reload the page
            </button>
            <a className="btn btn--ghost" href="/">
              Back to home
            </a>
          </div>
        </div>
      </section>
    );
  }
}
