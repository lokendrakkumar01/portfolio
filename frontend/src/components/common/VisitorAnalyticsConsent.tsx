import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import { collectVisitorPageView, type VisitorCollection } from '../../api/analytics.api';

const CONSENT_KEY = 'portfolio-analytics-consent';
const VISITOR_KEY = 'portfolio-anonymous-visitor-id';
const SESSION_KEY = 'portfolio-analytics-session-id';

interface NavigatorWithClientHints extends Navigator {
  userAgentData?: {
    brands: Array<{ brand: string; version: string }>;
    mobile: boolean;
    platform: string;
    getHighEntropyValues?: (hints: string[]) => Promise<{ platformVersion?: string; model?: string }>;
  };
}

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function getStoredId(storage: Storage, key: string) {
  let value = storage.getItem(key);
  if (!value) {
    value = createId();
    storage.setItem(key, value);
  }
  return value;
}

function getSafeReferrer() {
  try {
    const referrer = new URL(document.referrer);
    return ['http:', 'https:'].includes(referrer.protocol) ? `${referrer.origin}${referrer.pathname}` : '';
  } catch {
    return '';
  }
}

export default function VisitorAnalyticsConsent() {
  const location = useLocation();
  const [consent, setConsent] = useState<string | null>(() => {
    try { return localStorage.getItem(CONSENT_KEY); } catch { return 'denied'; }
  });
  const [showChoices, setShowChoices] = useState(consent === null);
  const lastRecordedPath = useRef('');

  useEffect(() => {
    if (consent !== 'granted' || !location.pathname || lastRecordedPath.current === location.pathname) return;
    lastRecordedPath.current = location.pathname;

    const record = async () => {
      try {
        const visitorId = getStoredId(localStorage, VISITOR_KEY);
        const sessionId = getStoredId(sessionStorage, SESSION_KEY);
        const userAgentData = (navigator as NavigatorWithClientHints).userAgentData;
        let highEntropy: { platformVersion?: string; model?: string } = {};
        try {
          highEntropy = await userAgentData?.getHighEntropyValues?.(['platformVersion', 'model']) ?? {};
        } catch {
          // Fall back to low-entropy browser hints and the server-side UA parser.
        }
        const payload: VisitorCollection = {
          visitorId,
          sessionId,
          path: location.pathname,
          referrer: getSafeReferrer(),
          language: navigator.language || 'und',
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          clientHints: {
            platform: userAgentData?.platform,
            platformVersion: highEntropy.platformVersion,
            model: highEntropy.model,
            mobile: userAgentData?.mobile,
            brands: userAgentData?.brands,
          },
        };
        await collectVisitorPageView(payload);
      } catch {
        // Storage restrictions should not affect use of the portfolio.
      }
    };

    void record();
  }, [consent, location.pathname]);

  const saveConsent = (value: 'granted' | 'denied') => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* Keep choice for this page view. */ }
    if (value === 'denied') {
      try { localStorage.removeItem(VISITOR_KEY); sessionStorage.removeItem(SESSION_KEY); } catch { /* Ignore restricted storage. */ }
    }
    setConsent(value);
    setShowChoices(false);
    lastRecordedPath.current = '';
  };

  return (
    <>
      {!showChoices && consent !== null && (
        <button
          type="button"
          onClick={() => setShowChoices(true)}
          className="fixed bottom-24 left-5 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-surface/95 px-3 py-2 text-xs font-semibold text-muted shadow-lg backdrop-blur-xl transition hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Open analytics privacy choices"
        >
          <Cookie className="h-4 w-4" /> Privacy
        </button>
      )}
      {showChoices && (
        <section className="fixed bottom-24 left-5 z-50 w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl border border-border bg-surface/95 p-4 shadow-2xl backdrop-blur-xl" aria-label="Analytics privacy choices">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-text">Anonymous analytics</h2>
              <p className="mt-1 text-xs leading-5 text-muted">With your permission, this site records visited pages and basic device details to help improve the portfolio. No IP address or device fingerprint is stored; records expire after 180 days.</p>
            </div>
            {consent !== null && <button type="button" onClick={() => setShowChoices(false)} aria-label="Close privacy choices" className="rounded-lg p-1 text-muted hover:bg-card hover:text-text"><X className="h-4 w-4" /></button>}
          </div>
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => saveConsent('denied')} className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted hover:bg-card">Decline</button>
            <button type="button" onClick={() => saveConsent('granted')} className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white hover:opacity-90">Allow analytics</button>
          </div>
        </section>
      )}
    </>
  );
}
