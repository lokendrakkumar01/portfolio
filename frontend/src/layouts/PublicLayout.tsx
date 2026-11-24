import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import { useTheme } from '../hooks/useTheme';
import AIChatWidget from '../components/common/AIChatWidget';
import VisitorAnalyticsConsent from '../components/common/VisitorAnalyticsConsent';

export default function PublicLayout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <div data-theme={theme} className="min-h-screen bg-bg flex flex-col">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="page-transition-stage"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
      <VisitorAnalyticsConsent />
      <AIChatWidget />
    </div>
  );
}
