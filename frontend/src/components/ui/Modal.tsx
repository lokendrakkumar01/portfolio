import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal = ({ open, onClose, title, children, size = 'md' }: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'relative bg-card rounded-2xl shadow-2xl border border-border w-full max-h-[90vh] overflow-y-auto',
              sizes[size]
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
                <h2 className="text-lg font-semibold text-text">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-text transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-surface/80 hover:bg-surface text-muted hover:text-text transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="p-4 sm:p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
