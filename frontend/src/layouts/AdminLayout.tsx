import { useState, useEffect } from 'react';
import { Outlet, Navigate, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const { data: statsData } = useStats();
  const unread = statsData?.data?.unreadMessages ?? 0;

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/admin/login');
  };

  const content = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header (Fixed) */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface">
        <Link to="/admin/dashboard" onClick={onClose} className="hover:opacity-80 transition-opacity min-w-0">
          <span className="font-bold text-base text-text block truncate">Admin Panel</span>
          <p className="text-xs text-muted truncate max-w-[140px]">{user?.email}</p>
        </Link>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-card transition-colors flex-shrink-0" aria-label="Close sidebar">
          <X className="w-5 h-5 text-text" />
        </button>
      </div>

      {/* Nav (Scrollable content only) */}
      <nav className="flex-1 min-h-0 overflow-y-auto p-3 space-y-0.5 scrollbar-none">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:text-text hover:bg-card'
              )
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && unread > 0 && (
              <span className="bg-error text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout (Fixed & Safe-area aware) */}
      <div className="flex-shrink-0 p-3 pb-safe border-t border-border bg-surface">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-error hover:bg-error/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-surface border-r border-border h-screen sticky top-0 flex-shrink-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 h-[100dvh] bg-surface border-r border-border flex flex-col overflow-hidden lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function AdminLayout() {
  const { isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Auto close mobile sidebar on location/route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Auto close mobile sidebar on desktop resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div data-theme={theme} className="min-h-screen bg-bg flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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