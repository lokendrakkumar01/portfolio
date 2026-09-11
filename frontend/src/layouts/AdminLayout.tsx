import { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  LayoutDashboard, User, FolderCode, Award, Trophy, Zap,
  GraduationCap, Briefcase, Image, FileText, Share2,
  MessageSquare, Settings, LogOut, Menu, X, Sun, Moon,
} from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { useTheme } from '../hooks/useTheme';
import { useStats } from '../hooks/useStats';
import { cn } from '../utils/cn';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/projects', label: 'Projects', icon: FolderCode },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { to: '/admin/skills', label: 'Skills', icon: Zap },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/gallery', label: 'Gallery', icon: Image },
  { to: '/admin/resume', label: 'Resume / CV', icon: FileText },
  { to: '/admin/social-links', label: 'Social Links', icon: Share2 },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare, badge: true },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

/** Shared sidebar content — used in both desktop aside and mobile drawer */
function SidebarContent({
  onClose,
  onLogout,
  unread,
}: {
  onClose: () => void;
  onLogout: () => void;
  unread: number;
}) {
  const { user } = useAuthStore();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <Link
          to="/admin/dashboard"
          onClick={onClose}
          className="hover:opacity-80 transition-opacity min-w-0"
        >
          <span className="font-bold text-base text-text block truncate">Admin Panel</span>
          <p className="text-xs text-muted truncate max-w-[160px]">{user?.email}</p>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-card transition-colors flex-shrink-0"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-text" />
        </button>
      </div>

      {/* Nav (scrollable) */}
      <nav
        style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}
        className="p-3 space-y-0.5"
      >
        {navItems.map(({ to, label, icon: Icon, badge }) => {
          const isActive =
            location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted hover:text-text hover:bg-card'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && unread > 0 && (
                <span className="bg-error text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout (always visible) */}
      <div
        style={{ flexShrink: 0, paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
        className="p-3 border-t border-border bg-surface"
      >
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-error hover:bg-error/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: statsData } = useStats();
  const unread = statsData?.data?.unreadMessages ?? 0;

  // Mount portal on client
  useEffect(() => { setMounted(true); }, []);

  // Auto close mobile sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Auto close on desktop resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    navigate('/admin/login');
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const mobileSidebar = (
    /*
     * Always mounted. CSS-toggled visibility/opacity/pointer-events.
     * No AnimatePresence = no exit-animation blocking content clicks.
     */
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Admin navigation"
      data-theme={theme}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'opacity 0.15s ease, visibility 0.15s ease',
        opacity: sidebarOpen ? 1 : 0,
        visibility: sidebarOpen ? 'visible' : 'hidden',
        pointerEvents: sidebarOpen ? 'auto' : 'none',
      }}
      className="bg-surface lg:hidden"
    >
      <SidebarContent
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        unread={unread}
      />
    </div>
  );

  return (
    <div data-theme={theme} className="min-h-screen bg-bg flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-surface border-r border-border h-screen sticky top-0 flex-shrink-0">
        <SidebarContent
          onClose={() => {}}
          onLogout={handleLogout}
          unread={unread}
        />
      </aside>

      {/* Mobile drawer portal (CSS-toggled, never blocks content when closed) */}
      {mounted && createPortal(mobileSidebar, document.body)}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-surface border-b border-border flex items-center gap-4 px-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-card transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-text" />
          </button>
          <h1 className="text-sm font-semibold text-text flex-1">Admin Dashboard</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-card transition-colors text-muted"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}