import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  Menu, X, Sun, Moon, Home, User, Zap, FolderCode,
  Award, Trophy, FileText, Mail, ArrowRight
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import type { Theme } from '../../hooks/useTheme';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { getSocialIcon } from '../../utils/formatters';

const navLinks = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/about', label: 'About', icon: User },
  { to: '/skills', label: 'Skills', icon: Zap },
  { to: '/projects', label: 'Projects', icon: FolderCode },
  { to: '/certificates', label: 'Certificates', icon: Award },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/resume', label: 'Resume', icon: FileText },
  { to: '/contact', label: 'Contact', icon: Mail },
];

interface NavbarProps {
  theme: Theme;
  toggleTheme: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollY = useScrollPosition();
  const scrolled = scrollY > 20;
  const location = useLocation();

  const { data: settingsData } = useSettings();
  const { data: socialData } = useSocialLinks();
  const siteName = settingsData?.data?.siteName ?? 'Portfolio';
  const socialLinks = (socialData?.data ?? []).filter((l) => l.active).slice(0, 5);

  // Mount portal target on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Auto-close on location change (navigation happened)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setMobileOpen(false);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-all duration-200 pb-0.5 relative ${
      isActive ? 'text-primary' : 'text-muted hover:text-text'
    }`;

  const drawer = (
    /*
     * The drawer is ALWAYS mounted in the DOM (portal).
     * Open  → opacity-100, pointer-events-auto, visible
     * Closed → opacity-0,   pointer-events-none, invisible
     * CSS transition handles the fade. No framer-motion exit animation = no pointer-events blocking.
     */
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Mobile navigation"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'var(--color-surface, #fff)',
        transition: 'opacity 0.15s ease, visibility 0.15s ease',
        opacity: mobileOpen ? 1 : 0,
        visibility: mobileOpen ? 'visible' : 'hidden',
        pointerEvents: mobileOpen ? 'auto' : 'none',
      }}
      className="lg:hidden"
    >
      {/* ── Header ── */}
      <div
        style={{ flexShrink: 0 }}
        className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface"
      >
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity min-w-0"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-base flex-shrink-0">
            {siteName.charAt(0)}
          </div>
          <span className="font-bold text-text text-base tracking-tight truncate max-w-[180px]">
            {siteName}
          </span>
        </Link>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-card border border-border text-muted hover:text-text transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun className="w-5 h-5 text-yellow-400" />
              : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
          <button
            onClick={closeMenu}
            className="p-2.5 rounded-xl bg-card border border-border hover:bg-surface text-text transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Nav links (scrollable) ── */}
      <nav
        style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}
        className="px-4 py-4 space-y-1"
      >
        {navLinks.map(({ to, label, icon: Icon, end }) => {
          const isActive =
            end
              ? location.pathname === to
              : location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-muted hover:text-text hover:bg-card'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div
        style={{
          flexShrink: 0,
          paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        }}
        className="px-4 pt-3 pb-4 border-t border-border bg-surface space-y-3"
      >
        <Link
          to="/contact"
          onClick={closeMenu}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
        >
          <span>Get In Touch</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {socialLinks.map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <a
                  key={link._id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.platform}
                  onClick={closeMenu}
                  className="p-2.5 rounded-xl border border-border hover:border-primary hover:text-primary text-muted transition-colors bg-card"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/85 backdrop-blur-xl border-b border-border/60 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-black text-xl sm:text-2xl text-text hover:text-primary transition-colors tracking-tight"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {siteName.charAt(0)}
            </div>
            <span>{siteName}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>
                {({ isActive }) => (
                  <>
                    <span>{l.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-card border border-transparent hover:border-border transition-all text-muted hover:text-text"
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun className="w-5 h-5 text-yellow-400" />
                : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 text-text transition-all active:scale-95 shadow-sm"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Portal: always mounted, CSS-toggled (NO AnimatePresence exit blocking) */}
      {mounted && createPortal(drawer, document.body)}
    </header>
  );
}
