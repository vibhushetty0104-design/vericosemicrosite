import { createRoot } from 'react-dom/client';
import '../../index.css';
import { VenousValvePrototype } from './VenousValvePrototype';

/*
 * Entry for prototypes/venous-valve.html. Vite's dev server serves that page; `vite build`
 * only bundles index.html, so this prototype is never part of the deployed site. It uses only
 * the scoped `vv-` classes (no Tailwind utilities), so it adds nothing to the site's CSS either.
 */
function PrototypePage() {
  return (
    <div className="vv-page">
      <div className="vv-page-banner">
        <p>
          <strong>Internal prototype.</strong> Not linked from the site and not deployed.{' '}
          <a href="/">
            Back to the site
          </a>
        </p>
      </div>
      <main className="vv-page-main">
        <h1 className="vv-visually-hidden">Venous valve prototype</h1>
        <VenousValvePrototype />
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<PrototypePage />);
