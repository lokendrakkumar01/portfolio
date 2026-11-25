import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Cookie, ExternalLink, X } from 'lucide-react';
import { collectVisitorPageView, type VisitorCollection } from '../../api/analytics.api';

const CONSENT_KEY = 'portfolio-analytics-consent';
const VISITOR_KEY = 'portfolio-anonymous-visitor-id';
const SESSION_KEY = 'portfolio-analytics-session-id';
const PORTFOLIO_URL = 'https://lokendrakumar.onrender.com';

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

  useEffect(() => {
    if (!showChoices) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && consent !== null) setShowChoices(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [consent, showChoices]);

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
          className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] left-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface/95 px-4 py-2.5 text-sm font-semibold text-muted shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:bottom-24 sm:left-5 sm:px-3 sm:py-2 sm:text-xs"
          aria-label="Open analytics privacy choices"
          aria-haspopup="dialog"
        >
          <Cookie className="h-4 w-4" /> Privacy
        </button>
      )}
      {showChoices && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && consent !== null) setShowChoices(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="analytics-dialog-title"
            aria-describedby="analytics-dialog-description"
            className="max-h-[min(80dvh,34rem)] w-full max-w-sm overflow-y-auto rounded-3xl border border-border bg-surface p-4 shadow-2xl sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Cookie className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="analytics-dialog-title" className="text-base font-bold text-text sm:text-lg">Anonymous analytics</h2>
                <p id="analytics-dialog-description" className="mt-1.5 text-sm leading-5 text-muted">
                  With your permission, this site records visited pages and basic device details to help improve the portfolio. No IP address or device fingerprint is stored; records expire after 180 days.
                </p>
              </div>
              {consent !== null && (
                <button
                  type="button"
                  onClick={() => setShowChoices(false)}
                  aria-label="Close privacy choices"
                  className="rounded-lg p-1.5 text-muted transition hover:bg-card hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex min-h-11 min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="truncate">{PORTFOLIO_URL.replace('https://', '')}</span>
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => saveConsent('denied')}
                className="min-h-11 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-h-10"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => saveConsent('granted')}
                className="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:min-h-10"
              >
                Allow analytics
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
