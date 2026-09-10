import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const scrollY = useScrollPosition();
  const scrolled = scrollY > 20;
  const navigate = useNavigate();
  const location = useLocation();

  const { data: settingsData } = useSettings();
  const { data: socialData } = useSocialLinks();
  const siteName = settingsData?.data?.siteName ?? 'Portfolio';
  const socialLinks = (socialData?.data ?? []).filter((l) => l.active).slice(0, 5);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Auto-close on location change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleNavClick = (to: string) => {
    setMobileOpen(false);
    navigate(to);
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-all duration-200 pb-0.5 relative ${
      isActive ? 'text-primary' : 'text-muted hover:text-text'
    }`;

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
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Mobile Hamburger Button */}
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

      {/* Mobile Full-Screen Drawer via Portal (Escapes any header sticky/backdrop-blur trapping) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="fixed inset-0 z-[9999] w-screen h-[100dvh] bg-surface flex flex-col overflow-hidden lg:hidden"
              style={{ width: '100vw', height: '100dvh' }}
            >
              {/* Top Drawer Header (Fixed) */}
              <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface">
                <button onClick={() => handleNavClick('/')} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity min-w-0 text-left">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-base flex-shrink-0">
                    {siteName.charAt(0)}
                  </div>
                  <span className="font-bold text-text text-base tracking-tight truncate max-w-[160px] sm:max-w-[200px]">{siteName}</span>
                </button>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl hover:bg-card border border-border text-muted hover:text-text transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
                  </button>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-card border border-border hover:bg-surface text-text transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Menu List with Icons (Scrollable content only) */}
              <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-1.5 scrollbar-none">
                {navLinks.map((l) => {
                  const Icon = l.icon;
                  const isActive = location.pathname === l.to || (l.to !== '/' && location.pathname.startsWith(l.to));
                  return (
                    <button
                      key={l.to}
                      onClick={() => handleNavClick(l.to)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-bold transition-all text-left ${
                        isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.01]'
                          : 'text-muted hover:text-text hover:bg-card/80'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{l.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Bottom Drawer Actions (Fixed & Safe-area aware) */}
              <div className="flex-shrink-0 p-4 sm:p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] border-t border-border bg-surface/90 backdrop-blur-md space-y-3.5">
                <button
                  onClick={() => handleNavClick('/contact')}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                >
                  <span>Get In Touch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {socialLinks.length > 0 && (
                  <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <a
                          key={link._id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={link.platform}
                          onClick={() => setMobileOpen(false)}
                          className="p-2.5 rounded-xl border border-border hover:border-primary hover:text-primary text-muted transition-colors bg-card"
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
