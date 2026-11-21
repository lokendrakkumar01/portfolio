import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Menu, X, Sun, Moon, Home, User, Zap, FolderCode, Images,
  Award, Trophy, FileText, Mail, ArrowRight
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import type { Theme } from '../../hooks/useTheme';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { useProfile } from '../../hooks/useProfile';
import { getSocialIcon } from '../../utils/formatters';

const MotionLink = motion(Link);

const navLinks = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/about', label: 'About', icon: User },
  { to: '/skills', label: 'Skills', icon: Zap },
  { to: '/projects', label: 'Projects', icon: FolderCode },
  { to: '/gallery', label: 'Gallery', icon: Images },
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
  const reduceMotion = useReducedMotion();

  const { data: settingsData } = useSettings();
  const { data: socialData } = useSocialLinks();
  const { data: profileData } = useProfile();
  const profile = profileData?.data;
  const siteName = settingsData?.data?.siteName || profile?.name || 'Portfolio';
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

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
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
      id="mobile-navigation-drawer"
      aria-modal="true"
      role="dialog"
      aria-hidden={!mobileOpen}
      aria-label="Mobile navigation"
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
        transition: reduceMotion ? 'none' : 'opacity 0.15s ease, visibility 0.15s ease',
        opacity: mobileOpen ? 1 : 0,
        visibility: mobileOpen ? 'visible' : 'hidden',
        pointerEvents: mobileOpen ? 'auto' : 'none',
      }}
      className="bg-surface lg:hidden"
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
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-base flex-shrink-0 overflow-hidden shadow-sm">
            {profile?.profileImage ? (
              <img src={profile.profileImage} alt={siteName} className="w-full h-full object-cover" />
            ) : (
              siteName.charAt(0)
            )}
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
            <MotionLink
              key={to}
              to={to}
              onClick={closeMenu}
              whileHover={reduceMotion ? undefined : { x: 4 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={`group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border px-4 py-3.5 text-base font-semibold transition-all ${
                isActive
                  ? 'border-primary/30 text-white shadow-lg shadow-primary/20'
                  : 'border-transparent text-muted hover:border-border/70 hover:bg-card/70 hover:text-text'
              }`}
            >
              {isActive && <motion.span layoutId="mobile-active-nav" className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-primary to-accent" transition={{ type: 'spring', stiffness: 360, damping: 32 }} />}
              <Icon className="relative z-10 h-5 w-5 flex-shrink-0" />
              <span className="relative z-10">{label}</span>
              {isActive && <span className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,.9)]" />}
            </MotionLink>
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
            className="flex items-center gap-2.5 font-black text-xl sm:text-2xl text-text hover:text-primary transition-colors tracking-tight"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 overflow-hidden shadow-sm">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt={siteName} className="w-full h-full object-cover" />
              ) : (
                siteName.charAt(0)
              )}
            </div>
            <span>{siteName}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `${linkCls({ isActive })} inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-[13px] xl:gap-3 xl:px-2.5 xl:text-sm hover:bg-primary/5`}>
                {({ isActive }) => (
                  <>
                    <l.icon aria-hidden="true" className={`hidden h-3.5 w-3.5 transition-transform xl:block ${isActive ? 'scale-110 text-primary' : 'opacity-70'}`} />
                    <span>{l.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        layout={reduceMotion ? false : undefined}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30, duration: reduceMotion ? 0 : undefined }}
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
              className="group rounded-xl border border-transparent p-2.5 text-muted transition-all hover:border-border hover:bg-card hover:text-text"
              aria-label="Toggle theme"
            >
              {theme === 'dark'
              ? <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-500 group-hover:rotate-45" />
              : <Moon className="h-5 w-5 text-slate-700 transition-transform duration-500 group-hover:-rotate-12" />}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              className="lg:hidden rounded-xl border border-border bg-card p-2.5 text-text shadow-sm transition-all hover:border-primary/50 hover:text-primary active:scale-95"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Portal: always mounted, CSS-toggled (NO AnimatePresence exit blocking) */}
      {mounted && createPortal(drawer, document.body)}
    </header>
  );
}
