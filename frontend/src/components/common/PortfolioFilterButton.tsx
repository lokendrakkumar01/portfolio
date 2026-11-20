import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PortfolioFilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
  group: string;
  className?: string;
}

export function PortfolioFilterButton({ active, onClick, children, count, group, className = '' }: PortfolioFilterButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className={`portfolio-filter relative inline-flex min-h-10 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl border px-3.5 py-2 text-xs font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:min-h-11 sm:rounded-2xl sm:px-4 sm:text-sm ${active ? 'border-primary/40 text-white shadow-lg shadow-primary/20' : 'border-border/70 bg-card/65 text-muted hover:border-primary/40 hover:text-text'} ${className}`}
    >
      {active && (
        <motion.span
          layoutId={`portfolio-filter-${group}`}
          layout={reduceMotion ? false : undefined}
          className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-primary via-blue-500 to-accent"
          transition={{ type: 'spring', stiffness: 380, damping: 32, duration: reduceMotion ? 0 : undefined }}
        />
      )}
      <span className="relative z-10 inline-flex min-w-0 items-center justify-center gap-2">{children}</span>
      {count !== undefined && (
        <motion.span
          key={count}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.75 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          className={`relative z-10 rounded-full px-1.5 py-0.5 text-[9px] font-black tabular-nums sm:text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-surface/80 text-muted'}`}
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  );
}
