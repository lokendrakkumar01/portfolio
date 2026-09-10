import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [show, setShow] = useState(false);
  const [bodyLocked, setBodyLocked] = useState(false);

  useEffect(() => {
    const handler = () => {
      setShow(window.scrollY > 400);
      setBodyLocked(document.body.style.overflow === 'hidden');
    };
    window.addEventListener('scroll', handler, { passive: true });

    const observer = new MutationObserver(() => {
      setBodyLocked(document.body.style.overflow === 'hidden');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      window.removeEventListener('scroll', handler);
      observer.disconnect();
    };
  }, []);

  if (bodyLocked) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-30 p-3 bg-primary text-white rounded-full shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
