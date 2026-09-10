import { motion } from 'framer-motion';
import { Trophy, ExternalLink, Calendar, MapPin, Award } from 'lucide-react';
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="Honors & Achievements" subtitle="A timeline of milestones and recognition" center />
        
        {isLoading ? (
          <div className="space-y-6 max-w-4xl mx-auto mt-12">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState icon={Trophy} title="No achievements yet" description="Achievements will appear here." />
        ) : (
          <div className="mt-12 space-y-16">
            {Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat} className="relative">
                <h2 className="text-2xl font-extrabold text-text capitalize mb-8 flex items-center gap-3">
                  <Award className="text-primary w-7 h-7" />
                  {cat}
                </h2>
                
                {/* Vertical Timeline Line */}
                <div className="absolute left-[7.5rem] top-20 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-border to-transparent hidden md:block" />

                <div className="space-y-6">
                  {catItems.map((a, i) => (
                    <motion.div key={a._id}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-start group"
                    >
                      {/* Timeline Node */}
                      <div className="hidden md:flex absolute left-[7rem] top-6 w-4 h-4 rounded-full bg-surface border-2 border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] z-10 group-hover:scale-125 transition-transform" />
                      
                      {/* Date Block (Desktop) */}
                      <div className="hidden md:block w-28 pt-5 flex-shrink-0 text-right pr-2">
                        <span className="text-sm font-bold text-primary">{formatDate(a.date, 'month-year')}</span>
                      </div>

                      {/* Card Content */}
                      <div className="flex-1 bg-card/80 backdrop-blur-md border border-border rounded-2xl p-5 sm:p-6 hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden md:ml-4">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                          <div className="bg-primary/10 text-primary p-3 sm:p-4 rounded-2xl border border-primary/20 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                              <div>
                                <h3 className="text-lg sm:text-xl font-bold text-text group-hover:text-primary transition-colors">{a.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted">
                                  {a.organization && <span className="font-semibold">{a.organization}</span>}
                                  {a.event && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {a.event}</span>}
                                  <span className="flex items-center gap-1 md:hidden"><Calendar className="w-3.5 h-3.5" /> {formatDate(a.date, 'month-year')}</span>
                                </div>
                              </div>
                              {a.rank && (
                                <div className="bg-gradient-to-r from-accent/20 to-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex-shrink-0">
                                  {a.rank}
                                </div>
                              )}
                            </div>
                            
                            {a.description && <p className="text-sm text-muted mt-3 leading-relaxed">{a.description}</p>}
                            
                            {a.verificationUrl && (
                              <div className="mt-4 pt-4 border-t border-border/50">
                                <a href={a.verificationUrl} target="_blank" rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text bg-surface border border-border px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors">
                                  <ExternalLink className="w-3.5 h-3.5" /> Verified Proof
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
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