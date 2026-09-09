import { motion } from 'framer-motion';
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
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={cn('mb-10', center && 'text-center', className)}
  >
    <div className={cn('flex items-end justify-between', center && 'justify-center')}>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text">{title}</h2>
        {subtitle && <p className="text-muted mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {viewAllLink && !center && (
        <Link
          to={viewAllLink}
          className="text-sm font-medium text-primary hover:underline flex-shrink-0 ml-4"
        >
          {viewAllLabel} →
        </Link>
      )}
    </div>
    <div className={cn('mt-3 h-1 w-12 bg-primary rounded-full', center && 'mx-auto')} />
  </motion.div>
);
