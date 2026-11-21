import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllLabel?: string;
  center?: boolean;
  className?: string;
}

export const SectionHeading = ({
  title, subtitle, viewAllLink, viewAllLabel = 'View All', center = false, className,
}: SectionHeadingProps) => (
  <HeadingMotion title={title} subtitle={subtitle} viewAllLink={viewAllLink} viewAllLabel={viewAllLabel} center={center} className={className} />
);

function HeadingMotion({ title, subtitle, viewAllLink, viewAllLabel, center, className }: SectionHeadingProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduceMotion ? 0 : 0.5 }}
      className={cn('mb-8 sm:mb-10', center && 'text-center', className)}
    >
      <div className={cn('flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between', center && 'sm:justify-center')}>
        <div className="min-w-0">
          <h2 className="text-balance text-2xl font-black tracking-tight text-text sm:text-3xl">{title}</h2>
          {subtitle && <p className={cn('mt-2 max-w-xl text-sm leading-6 text-muted sm:text-base', center && 'mx-auto')}>{subtitle}</p>}
        </div>
        {viewAllLink && !center && (
          <Link
            to={viewAllLink}
            className="group inline-flex min-h-10 shrink-0 items-center gap-1 self-start rounded-full border border-primary/20 bg-primary/5 px-3 text-xs font-extrabold text-primary transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:self-auto sm:px-4 sm:text-sm"
          >
            {viewAllLabel}<motion.span aria-hidden="true" className="inline-block" whileHover={reduceMotion ? undefined : { x: 3 }}>→</motion.span>
          </Link>
        )}
      </div>
      <motion.div
        initial={reduceMotion ? false : { scaleX: 0.35, opacity: 0.5 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.08 }}
        className={cn('mt-4 h-1 w-16 origin-left rounded-full bg-gradient-to-r from-primary via-sky-400 to-accent shadow-sm shadow-primary/20', center && 'mx-auto origin-center')}
      />
    </motion.div>
  );
}
