import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, Mail, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { useResume } from '../../hooks/useResume';
import { useStats } from '../../hooks/useStats';
import { useSkills } from '../../hooks/useSkills';
import { useProjects } from '../../hooks/useProjects';
import { useCertificates } from '../../hooks/useCertificates';
import { useAchievements } from '../../hooks/useAchievements';
import { useExperience } from '../../hooks/useExperience';
import { useEducation } from '../../hooks/useEducation';
import { useGallery } from '../../hooks/useGallery';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton, SkeletonCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { getSocialIcon, formatDate, formatDuration, getProficiencyLabel } from '../../utils/formatters';
import { useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactApi } from '../../api/contact.api';
import toast from 'react-hot-toast';
import type { Profile, Skill, Project, Certificate, Achievement, Experience, Education, GalleryItem, Resume } from '../../types';

// ─── Animated counter ────────────────────────────────────────────────────────
function AnimatedCounter({ end, label, suffix = '+' }: { end: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started || end === 0) return;
    let cur = 0;
    const step = end / 40;
    const id = setInterval(() => {
      cur += step;
      if (cur >= end) { setCount(end); clearInterval(id); }
      else setCount(Math.floor(cur));
    }, 30);
    return () => clearInterval(id);
  }, [started, end]);
  return (
    <div ref={ref} className="text-center p-4">
      <div className="text-3xl font-bold text-primary">{count}{end > 0 ? suffix : '—'}</div>
      <div className="text-sm text-muted mt-1">{label}</div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const { data: profileData, isLoading } = useProfile();
  const { data: socialData } = useSocialLinks();
  const { data: resumeData } = useResume();
  const profile = profileData?.data;
  const socialLinks = (socialData?.data ?? []).filter((l) => l.active).slice(0, 6);
  const currentResume = (resumeData?.data ?? []).find((r) => r.isCurrent);

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Text */}
        <div className="order-2 lg:order-1">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-3"><Skeleton className="h-10 w-32" /><Skeleton className="h-10 w-36" /></div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="text-primary font-semibold mb-3 text-lg">Hello, I'm
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight mb-3">
                {profile?.name ?? 'Your Name'}
              </motion.h1>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl font-semibold text-primary mb-3">
                {profile?.title ?? 'Software Developer'}
              </motion.h2>
              {profile?.tagline && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                  className="text-muted italic mb-4">{profile.tagline}
                </motion.p>
              )}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-muted text-base leading-relaxed mb-8 max-w-lg">
                {profile?.shortBio ?? 'Welcome to my portfolio.'}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 mb-8">
                <Link to="/projects">
                  <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>View Projects</Button>
                </Link>
                {currentResume && (
                  <a href={currentResume.fileUrl} download target="_blank" rel="noreferrer">
                    <Button variant="outline" size="lg" icon={<Download className="w-4 h-4" />}>Download Resume</Button>
                  </a>
                )}
                <Link to="/contact">
                  <Button variant="ghost" size="lg" icon={<Mail className="w-4 h-4" />}>Contact Me</Button>
                </Link>
              </motion.div>
              {socialLinks.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="flex gap-3 flex-wrap">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <a key={link._id} href={link.url} target="_blank" rel="noreferrer" aria-label={link.platform}
                        className="p-2.5 rounded-xl border border-border hover:border-primary hover:text-primary text-muted transition-all duration-200">
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Photo */}
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="order-1 lg:order-2 flex justify-center">
          <div className="relative">
            <div className="absolute inset-[-20px] rounded-full bg-primary/10 blur-3xl" />
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-border shadow-xl">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-card flex items-center justify-center">
                  <span className="text-7xl">👤</span>
                </div>
              )}
            </div>
            {profile?.availability === 'available' && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-surface border border-border rounded-full px-3 py-1.5 shadow-lg">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs font-medium text-text">Available for work</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection() {
  const { data: profileData, isLoading } = useProfile();
  const { data: statsData } = useStats();
  const profile = profileData?.data;
  const stats = statsData?.data;
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeading title="About Me" subtitle="Get to know me better" />
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12"><div className="space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /><Skeleton className="h-4 w-4/5" /></div></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-4">
            <p className="text-muted leading-relaxed">{profile?.longBio ?? profile?.shortBio ?? 'Biography coming soon.'}</p>
            {profile?.location && (
              <div className="flex items-center gap-2 text-muted text-sm">
                <MapPin className="w-4 h-4" /><span>{profile.location}</span>
              </div>
            )}
            <div className="pt-2">
              <Link to="/about"><Button variant="outline">Read More About Me <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <AnimatedCounter end={stats?.projects ?? 0} label="Projects" />
            <AnimatedCounter end={stats?.certificates ?? 0} label="Certificates" />
            <AnimatedCounter end={stats?.achievements ?? 0} label="Achievements" />
            <AnimatedCounter end={stats?.skills ?? 0} label="Skills" />
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function SkillsSection() {
  const { data, isLoading } = useSkills({ featured: true });
  const skills = data?.data ?? [];
  const grouped = skills.reduce((acc: Record<string, Skill[]>, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Skills & Technologies" subtitle="Technologies I work with" viewAllLink="/skills" />
        {isLoading ? (
          <div className="flex flex-wrap gap-2">{Array.from({ length: 16 }).map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}</div>
        ) : skills.length === 0 ? (
          <EmptyState title="Skills coming soon" description="Check back later." />
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([cat, catSkills]) => (
              <div key={cat}>
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3 capitalize">{cat}</h3>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((s) => (
                    <motion.div key={s._id} whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-sm text-text hover:border-primary hover:text-primary transition-colors">
                      {s.icon && <span>{s.icon}</span>}
                      <span>{s.name}</span>
                      <span className="text-xs text-muted">·{getProficiencyLabel(s.proficiency).slice(0,3)}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function ProjectsSection() {
  const { data, isLoading } = useProjects({ featured: true, limit: 6 });
  const projects = data?.data ?? [];
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Featured Projects" subtitle="Some of my best work" viewAllLink="/projects" />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : projects.length === 0 ? (
          <EmptyState title="Projects coming soon" description="Check back later for my work." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.div key={p._id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/projects/${p.slug}`} className="group block bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  {p.coverImage ? (
                    <img src={p.coverImage} alt={p.title} className="w-full h-44 object-cover rounded-t-xl" loading="lazy" />
                  ) : (
                    <div className="w-full h-44 bg-surface rounded-t-xl flex items-center justify-center"><FolderCode className="w-12 h-12 text-border" /></div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-text group-hover:text-primary transition-colors mb-1">{p.title}</h3>
                    <p className="text-sm text-muted mb-3 line-clamp-2">{p.shortDescription}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.technologies.slice(0, 4).map((t) => <Badge key={t} variant="primary" size="sm">{t}</Badge>)}
                      {p.technologies.length > 4 && <Badge size="sm">+{p.technologies.length - 4}</Badge>}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Certificates ─────────────────────────────────────────────────────────────
function CertificatesSection() {
  const { data, isLoading } = useCertificates({ featured: true, limit: 6 });
  const certs = data?.data ?? [];
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Certifications" subtitle="Professional certifications I've earned" viewAllLink="/certificates" />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
        ) : certs.length === 0 ? (
          <EmptyState title="Certificates coming soon" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((c, i) => (
              <motion.div key={c._id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  {c.certificateImage && (
                    <img src={c.certificateImage} alt={c.title} className="w-12 h-12 object-contain rounded-lg border border-border flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text text-sm line-clamp-2">{c.title}</h3>
                    <p className="text-xs text-muted mt-0.5">{c.issuer}</p>
                    <p className="text-xs text-muted">{formatDate(c.issueDate, 'month-year')}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────────
function AchievementsSection() {
  const { data, isLoading } = useAchievements({ featured: true, limit: 4 });
  const items = data?.data ?? [];
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Achievements" subtitle="Recognition and accomplishments" viewAllLink="/achievements" />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState title="Achievements coming soon" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((a, i) => (
              <motion.div key={a._id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-text text-sm line-clamp-1">{a.title}</h3>
                  <p className="text-xs text-muted">{a.organization}</p>
                  <p className="text-xs text-muted">{formatDate(a.date, 'month-year')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────
function ExperienceSection() {
  const { data, isLoading } = useExperience();
  const items = (data?.data ?? []).filter((e) => e.published);
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Experience" subtitle="My professional journey" />
        {isLoading ? (
          <div className="space-y-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState title="Experience coming soon" />
        ) : (
          <div className="space-y-4">
            {items.map((exp, i) => (
              <motion.div key={exp._id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
                {exp.companyLogo ? (
                  <img src={exp.companyLogo} alt={exp.company} className="w-12 h-12 rounded-lg border border-border object-contain flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-text">{exp.position}</h3>
                      <p className="text-sm text-muted">{exp.company}</p>
                    </div>
                    <div className="text-right text-xs text-muted">
                      <p>{formatDate(exp.startDate, 'month-year')} — {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate, 'month-year') : ''}</p>
                      <p>{formatDuration(exp.startDate, exp.endDate, exp.current)}</p>
                    </div>
                  </div>
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exp.technologies.slice(0, 5).map((t) => <Badge key={t} size="sm">{t}</Badge>)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────
function EducationSection() {
  const { data, isLoading } = useEducation();
  const items = (data?.data ?? []).filter((e) => e.published);
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Education" subtitle="Academic background" />
        {isLoading ? (
          <div className="space-y-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState title="Education coming soon" />
        ) : (
          <div className="space-y-4">
            {items.map((edu, i) => (
              <motion.div key={edu._id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
                {edu.logo ? (
                  <img src={edu.logo} alt={edu.institution} className="w-12 h-12 rounded-lg border border-border object-contain flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-text">{edu.degree} in {edu.field}</h3>
                      <p className="text-sm text-muted">{edu.institution}</p>
                      {edu.grade && <p className="text-xs text-muted">Grade: {edu.grade}</p>}
                    </div>
                    <p className="text-xs text-muted">
                      {formatDate(edu.startDate, 'year')} — {edu.current ? 'Present' : edu.endDate ? formatDate(edu.endDate, 'year') : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function GallerySection() {
  const { data, isLoading } = useGallery({ featured: true, limit: 8 });
  const items = data?.data ?? [];
  if (!isLoading && items.length === 0) return null;
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Gallery" subtitle="Moments and memories" viewAllLink="/gallery" />
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((img, i) => (
              <motion.div key={img._id}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="aspect-square overflow-hidden rounded-xl border border-border">
                <img src={img.imageUrl} alt={img.title} loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Resume CTA ───────────────────────────────────────────────────────────────
function ResumeCTASection() {
  const { data: resumeData } = useResume();
  const currentResume = (resumeData?.data ?? []).find((r) => r.isCurrent);
  if (!currentResume) return null;
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center bg-card border border-border rounded-2xl p-10">
        <h2 className="text-2xl font-bold text-text mb-3">Want to know more about my experience?</h2>
        <p className="text-muted mb-6">Download my latest resume to see my full experience, skills, and achievements.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/resume"><Button variant="outline" size="lg">View Resume</Button></Link>
          <a href={currentResume.fileUrl} download target="_blank" rel="noreferrer">
            <Button size="lg" icon={<Download className="w-4 h-4" />}>Download Resume</Button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});
type ContactForm = z.infer<typeof contactSchema>;

function ContactSection() {
  const { data: profileData } = useProfile();
  const profile = profileData?.data;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });
  const onSubmit = async (data: ContactForm) => {
    try {
      await contactApi.submit(data);
      toast.success('Message sent! I\'ll get back to you soon.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Get In Touch" subtitle="Have a project or opportunity in mind? Let's connect." center />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold text-text mb-3">Let's talk</h3>
            <p className="text-muted text-sm mb-6">I'm open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="text-primary hover:underline text-sm block mb-2">{profile.email}</a>
            )}
            {profile?.location && (
              <p className="text-sm text-muted flex items-center gap-1"><MapPin className="w-4 h-4" />{profile.location}</p>
            )}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input {...register('name')} placeholder="Your Name *" className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input {...register('email')} placeholder="Your Email *" type="email" className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input {...register('subject')} placeholder="Subject *" className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              {errors.subject && <p className="text-xs text-error mt-1">{errors.subject.message}</p>}
            </div>
            <div>
              <textarea {...register('message')} placeholder="Your Message *" rows={5} className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" />
              {errors.message && <p className="text-xs text-error mt-1">{errors.message.message}</p>}
            </div>
            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Send Message</Button>
          </form>
        </div>
      </div>
    </section>
  );
}

// Missing icon import
import { FolderCode, Trophy, Briefcase, GraduationCap } from 'lucide-react';

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: profileData } = useProfile();
  const profile = profileData?.data;
  return (
    <>
      <SEO title={profile?.name} description={profile?.shortBio} image={profile?.profileImage} />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <AchievementsSection />
      <CertificatesSection />
      <ExperienceSection />
      <EducationSection />
      <GallerySection />
      <ResumeCTASection />
      <ContactSection />
    </>
  );
}