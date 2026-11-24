import { useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Globe2, Monitor, RefreshCw, Smartphone, Tablet, Users } from 'lucide-react';
import { analyticsApi, type VisitorCategory, type VisitorSession } from '../../api/analytics.api';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';

const formatDateTime = (value: string) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const categoryIcon = (category: VisitorCategory) => category === 'Mobile' ? Smartphone : category === 'Tablet' ? Tablet : Monitor;
const deviceTitle = (session: VisitorSession) => session.model === 'Unknown device'
  ? 'Unknown device'
  : [session.brand !== 'Unknown' ? session.brand : '', session.model].filter(Boolean).join(' ');
const countryLabel = (code: string) => code === 'Unavailable' ? 'Unavailable' : `${code} (approx.)`;

export default function VisitorAnalyticsPage() {
  const [page, setPage] = useState(1);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<VisitorCategory | ''>('');
  const [os, setOs] = useState('');
  const [browser, setBrowser] = useState('');
  const query = useQuery({
    queryKey: ['visitor-analytics', page, brand, category, os, browser],
    queryFn: () => analyticsApi.list({ page, limit: 20, brand, category, os, browser }),
  });
  const result = query.data?.data;
  const sessions = result?.items ?? [];
  const pagination = result?.pagination;
  const filters = result?.filters;

  const onFilterChange = (setter: (value: string) => void) => (event: ChangeEvent<HTMLSelectElement>) => {
    setter(event.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Visitor Analytics</h1>
          <p className="mt-1 text-sm text-muted">Anonymous device and page-view sessions. IP addresses are never stored.</p>
        </div>
        <button type="button" onClick={() => void query.refetch()} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-text hover:border-primary/40" aria-label="Refresh visitor sessions">
          <RefreshCw className={`h-4 w-4 ${query.isFetching ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="text-xs font-semibold text-muted">Device brand
          <select value={brand} onChange={onFilterChange(setBrand)} className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
            <option value="">All brands</option>{filters?.brands.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-muted">Device type
          <select value={category} onChange={(event) => { setCategory(event.target.value as VisitorCategory | ''); setPage(1); }} className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
            <option value="">All types</option><option>Mobile</option><option>Tablet</option><option>Desktop</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-muted">Operating system
          <select value={os} onChange={onFilterChange(setOs)} className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
            <option value="">All systems</option>{filters?.operatingSystems.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-muted">Browser
          <select value={browser} onChange={onFilterChange(setBrowser)} className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
            <option value="">All browsers</option>{filters?.browsers.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      </div>

      {query.isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />)}</div>
      ) : query.isError ? (
        <EmptyState icon={Globe2} title="Could not load visitor sessions" description="Check the API connection, then refresh to try again." action={{ label: 'Retry', onClick: () => { void query.refetch(); } }} />
      ) : sessions.length === 0 ? (
        <EmptyState icon={Users} title="No visitor sessions yet" description="Anonymous sessions appear here after a visitor allows analytics on the public site." />
      ) : (
        <>
          <p className="text-xs text-muted" aria-live="polite">{pagination?.total ?? 0} sessions · page {pagination?.page ?? page} of {pagination?.totalPages ?? 1}</p>

          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] text-left text-sm">
                <thead className="border-b border-border bg-surface/70 text-[11px] uppercase tracking-wide text-muted">
                <tr>{['Device', 'Type', 'OS', 'Browser', 'Screen', 'Visit date', 'Page views', 'Approx. location', 'Details'].map((label) => <th key={label} className="px-4 py-3 font-bold">{label}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sessions.map((session) => <tr key={session._id} className="align-top hover:bg-surface/40">
                    <td className="px-4 py-3"><p className="font-semibold text-text">{deviceTitle(session)}</p></td>
                    <td className="px-4 py-3">{session.category}</td>
                    <td className="px-4 py-3">{session.os}{session.osVersion ? ` ${session.osVersion}` : ''}</td>
                    <td className="px-4 py-3">{session.browser}{session.browserVersion ? ` ${session.browserVersion}` : ''}</td>
                    <td className="px-4 py-3 tabular-nums">{session.screenWidth && session.screenHeight ? `${session.screenWidth} × ${session.screenHeight}` : 'Unavailable'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(session.firstVisitedAt)}</td>
                    <td className="px-4 py-3 tabular-nums">{session.pageViewCount}</td>
                    <td className="px-4 py-3">{countryLabel(session.approximateLocation)}</td>
                    <td className="px-4 py-3"><SessionDetails session={session} /></td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {sessions.map((session) => <VisitorSessionCard key={session._id} session={session} />)}
          </div>

          <Pagination page={page} totalPages={pagination?.totalPages ?? 1} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

function VisitorSessionCard({ session }: { session: VisitorSession }) {
  const DeviceIcon = categoryIcon(session.category);
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><DeviceIcon className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-bold text-text">{deviceTitle(session)}</h2>
          <p className="mt-0.5 text-xs text-muted">{session.category} · {session.os}{session.osVersion ? ` ${session.osVersion}` : ''}</p>
          <p className="mt-1 text-xs text-muted">{session.browser}{session.browserVersion ? ` ${session.browserVersion}` : ''}</p>
        </div>
        <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{session.pageViewCount} views</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border pt-3 text-xs">
        <div><dt className="text-muted">Screen</dt><dd className="mt-0.5 font-semibold text-text">{session.screenWidth && session.screenHeight ? `${session.screenWidth} × ${session.screenHeight}` : 'Unavailable'}</dd></div>
        <div><dt className="text-muted">Approx. location</dt><dd className="mt-0.5 font-semibold text-text">{countryLabel(session.approximateLocation)}</dd></div>
        <div className="col-span-2"><dt className="text-muted">First visit</dt><dd className="mt-0.5 font-semibold text-text">{formatDateTime(session.firstVisitedAt)}</dd></div>
      </dl>
      <div className="mt-3 border-t border-border pt-3"><SessionDetails session={session} /></div>
    </article>
  );
}

function SessionDetails({ session }: { session: VisitorSession }) {
  return (
    <details className="text-xs">
      <summary className="cursor-pointer font-semibold text-primary">Session details and visited pages</summary>
      <div className="mt-3 max-w-md space-y-2 text-muted">
        <p>Anonymous visitor ID: <span className="break-all font-mono text-text">{session.visitorId}</span></p>
        <p>Model identifier: <span className="text-text">{session.modelIdentifier || 'Unavailable'}</span></p>
        <p>Platform: <span className="text-text">{session.platform}</span> · Language: <span className="text-text">{session.language}</span></p>
        <p>Viewport: <span className="text-text">{session.viewportWidth && session.viewportHeight ? `${session.viewportWidth} × ${session.viewportHeight}` : 'Unavailable'}</span></p>
        <p>Last activity: <span className="text-text">{formatDateTime(session.lastVisitedAt)}</span></p>
        <ul className="max-h-52 space-y-1 overflow-y-auto border-l-2 border-border pl-3">
          {session.pageViews.map((view, index) => <li key={`${view.visitedAt}-${index}`}><span className="font-semibold text-text">{view.path}</span> · {formatDateTime(view.visitedAt)}{view.referrer && <span className="block break-all">From {view.referrer}</span>}</li>)}
        </ul>
      </div>
    </details>
  );
}
