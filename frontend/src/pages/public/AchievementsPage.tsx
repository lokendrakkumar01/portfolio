import { motion } from 'framer-motion';
import { Trophy, ExternalLink } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAchievements } from '../../hooks/useAchievements';
import { formatDate } from '../../utils/formatters';

export default function AchievementsPage() {
  const { data, isLoading } = useAchievements();
  const items = data?.data ?? [];
  const grouped = items.reduce((acc: Record<string, typeof items>, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {});

  return (
    <>
      <SEO title="Achievements" description="My awards, recognitions, and accomplishments" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="Achievements" subtitle="Recognition and milestones I'm proud of" center />
        {isLoading ? (
          <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState icon={Trophy} title="No achievements yet" description="Achievements will appear here." />
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat}>
                <h2 className="text-lg font-semibold text-text capitalize mb-4">{cat}</h2>
                <div className="space-y-3">
                  {catItems.map((a, i) => (
                    <motion.div key={a._id}
                      initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                      className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 hover:border-primary/40 hover:shadow-sm transition-all">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-text">{a.title}</h3>
                            <p className="text-sm text-muted">{a.organization}{a.event && ` — ${a.event}`}</p>
                          </div>
                          <div className="text-right">
                            <Badge size="sm" variant="primary">{formatDate(a.date, 'month-year')}</Badge>
                            {a.rank && <p className="text-xs text-muted mt-0.5">Rank: {a.rank}</p>}
                          </div>
                        </div>
                        {a.description && <p className="text-sm text-muted mt-2">{a.description}</p>}
                        {a.verificationUrl && (
                          <a href={a.verificationUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                            <ExternalLink className="w-3 h-3" /> View Proof
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}