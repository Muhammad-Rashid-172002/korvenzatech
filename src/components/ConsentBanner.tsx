import React, { useEffect, useState } from 'react';
import { Link } from '../lib/router';
import { setConsent, storedConsent } from '../lib/analytics';

/**
 * Analytics consent (Google Analytics 4 via Consent Mode v2).
 * Shown once until the visitor chooses; reopened from the footer's "Cookie preferences"
 * (window event `kz:consent-open`). Rendered only after hydration (no SSR markup, no CLS:
 * it is a fixed overlay). Advertising storage is never enabled.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!storedConsent()) {
      // after first paint/idle so it never competes with the LCP
      const id = window.setTimeout(() => setOpen(true), 1200);
      return () => window.clearTimeout(id);
    }
  }, []);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener('kz:consent-open', show);
    return () => window.removeEventListener('kz:consent-open', show);
  }, []);

  if (!open) return null;
  const choose = (c: 'granted' | 'denied') => { setConsent(c); setOpen(false); };
  return (
    <div className="kz-consent" role="region" aria-label="Cookie preferences" data-analytics-ignore="">
      <p className="text-[13px] leading-6 text-[var(--kz-text-2)]">
        We use Google Analytics cookies to understand how this site is used. No advertising, and we never sell data.{' '}
        <Link to="/cookies" className="font-semibold text-[var(--kz-accent-text)] underline-offset-2 hover:underline">Cookie policy</Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose('granted')} className="kz-consent-btn kz-consent-btn--accept">Accept analytics</button>
        <button type="button" onClick={() => choose('denied')} className="kz-consent-btn">Decline</button>
      </div>
    </div>
  );
}
