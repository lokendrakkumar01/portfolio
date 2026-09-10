import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Sun, Moon, Home, User, Zap, FolderCode,
  Award, Trophy, FileText, Mail, ArrowRight, Sparkles
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

  const location = useLocation();
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-over Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[85vw] max-w-sm bg-surface border-l border-border shadow-2xl flex flex-col justify-between overflow-hidden lg:hidden"
            >
              {/* Top Drawer Header */}
              <div>
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-base">
                      {siteName.charAt(0)}
                    </div>
                    <span className="font-bold text-text text-base tracking-tight">{siteName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-xl hover:bg-card text-muted transition-colors"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="p-2 rounded-xl bg-card border border-border hover:bg-surface text-text transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Mobile Menu List with Icons */}
                <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
                  {navLinks.map((l) => {
                    const Icon = l.icon;
                    return (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        end={l.end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                            isActive
                              ? 'bg-primary text-white shadow-md shadow-primary/20'
                              : 'text-muted hover:text-text hover:bg-card'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{l.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-5 border-t border-border bg-surface/50 space-y-4">
                <Link to="/contact" onClick={() => setMobileOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white font-semibold text-sm rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all">
                    <span>Get In Touch</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                {socialLinks.length > 0 && (
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <a
                          key={link._id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={link.platform}
                          className="p-2 rounded-xl border border-border hover:border-primary hover:text-primary text-muted transition-colors bg-card"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
