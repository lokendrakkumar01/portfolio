import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, Mail, ArrowRight, MapPin, Calendar, FolderCode, Trophy, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
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
import type { Skill } from '../../types';

// ─── Animated Counter ────────────────────────────────────────────────────────
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
    <div ref={ref} className="text-center p-4 bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl shadow-sm hover:border-primary/40 transition-colors">
      <div className="text-3xl font-extrabold text-primary">{count}{end > 0 ? suffix : '—'}</div>
      <div className="text-xs font-medium text-muted mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { data: profileData, isLoading } = useProfile();
  const { data: socialData } = useSocialLinks();
  const { data: resumeData } = useResume();
  const profile = profileData?.data;
  const socialLinks = (socialData?.data ?? []).filter((l) => l.active).slice(0, 6);
  const currentResume = (resumeData?.data ?? []).find((r) => r.isCurrent);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left Column Text */}
        <div className="order-2 lg:order-1 lg:col-span-7">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-12 w-36 rounded-xl" />
                <Skeleton className="h-12 w-40 rounded-xl" />
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4"
              >
                <Sparkles className="w-3.5 h-3.5" /> Welcome to my Portfolio
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-4xl sm:text-6xl font-extrabold text-text leading-tight tracking-tight mb-3"
              >
                Hi, I'm <span className="text-gradient">{profile?.name ?? 'Your Name'}</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl font-semibold text-primary/90 mb-4"
              >
                {profile?.title ?? 'Full-Stack Developer & Software Engineer'}
              </motion.h2>

              {profile?.tagline && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                  className="text-muted italic text-base mb-4 border-l-2 border-primary/40 pl-3"
                >
                  "{profile.tagline}"
                </motion.p>
              )}

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-muted text-base sm:text-lg leading-relaxed mb-8 max-w-2xl"
              >
                {profile?.shortBio ?? 'Building modern, performant, and scalable web applications with clean architecture.'}
              </motion.p>

              {/* Action CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-3 mb-8"
              >
                <Link to="/projects">
                  <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                    Explore Projects
                  </Button>
                </Link>
                {currentResume && (
                  <a href={currentResume.fileUrl} download target="_blank" rel="noreferrer">
                    <Button variant="outline" size="lg" icon={<Download className="w-4 h-4" />}>
                      Download Resume
                    </Button>
                  </a>
                )}
                <Link to="/contact">
                  <Button variant="ghost" size="lg" icon={<Mail className="w-4 h-4" />}>
                    Get in Touch
                  </Button>
                </Link>
              </motion.div>

              {/* Social Icons */}
              {socialLinks.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex gap-3 flex-wrap items-center">
                  <span className="text-xs text-muted font-medium uppercase tracking-wider mr-1">Follow me:</span>
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <a
                        key={link._id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.platform}
                        className="p-2.5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm hover:border-primary hover:text-primary text-muted transition-all duration-200 shadow-sm"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Column Photo Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="order-1 lg:order-2 lg:col-span-5 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-[-12px] rounded-full bg-gradient-to-r from-primary to-accent opacity-25 blur-2xl animate-pulse-slow" />
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-card shadow-2xl ring-4 ring-primary/20">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-card flex items-center justify-center text-7xl">
                  👤
                </div>
              )}
            </div>

            {/* Availability Pill */}
            {profile?.availability === 'available' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="absolute -bottom-2 right-4 flex items-center gap-2 bg-surface/90 backdrop-blur-md border border-border rounded-full px-4 py-1.5 shadow-xl"
              >
                <div className="w-2.5 h-2.5 bg-success rounded-full animate-ping" />
                <span className="text-xs font-semibold text-text">Available for Hire</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  const { data: profileData, isLoading } = useProfile();
  const { data: statsData } = useStats();
  const profile = profileData?.data;
  const stats = statsData?.data;

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeading title="About Me" subtitle="A brief overview of who I am and what I do" />
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-muted text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {profile?.longBio ?? profile?.shortBio ?? 'Biography coming soon.'}
            </p>
            {profile?.location && (
              <div className="flex items-center gap-2 text-muted text-sm pt-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="pt-3">
              <Link to="/about">
                <Button variant="outline" size="md">
                  Read Full Bio <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <AnimatedCounter end={stats?.projects ?? 0} label="Projects Built" />
            <AnimatedCounter end={stats?.certificates ?? 0} label="Certifications" />
            <AnimatedCounter end={stats?.achievements ?? 0} label="Achievements" />
            <AnimatedCounter end={stats?.skills ?? 0} label="Skills Mastered" />
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Skills Section ───────────────────────────────────────────────────────────
function SkillsSection() {
  const { data, isLoading } = useSkills({ featured: true });
  const skills = data?.data ?? [];
  const grouped = skills.reduce((acc: Record<string, Skill[]>, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/50 border-y border-border/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Skills & Tech Stack" subtitle="Technologies and tools I use to bring ideas to life" viewAllLink="/skills" />
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-full" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <EmptyState title="Skills coming soon" description="Skills will appear here once added." />
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([cat, catSkills]) => (
              <div key={cat}>
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3 capitalize flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" /> {cat}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {catSkills.map((s) => (
                    <motion.div
                      key={s._id}
                      whileHover={{ scale: 1.04, y: -2 }}
                      className="flex items-center gap-2 px-3.5 py-2 bg-card border border-border rounded-xl text-sm text-text hover:border-primary/60 hover:shadow-md transition-all cursor-default"
                    >
                      {s.icon && <span className="text-base">{s.icon}</span>}
                      <span className="font-medium">{s.name}</span>
                      <span className="text-[10px] text-muted font-medium bg-surface px-1.5 py-0.5 rounded-md border border-border">
                        {getProficiencyLabel(s.proficiency)}
                      </span>
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

// ─── Projects Section ─────────────────────────────────────────────────────────
function ProjectsSection() {
  const { data, isLoading } = useProjects({ featured: true, limit: 6 });
  const projects = data?.data ?? [];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Featured Projects" subtitle="A selection of software projects I've engineered" viewAllLink="/projects" />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState title="Projects coming soon" description="Projects will be showcased here." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/projects/${p.slug}`}
                  className="group block bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
                >
                  {p.coverImage ? (
                    <div className="w-full h-48 overflow-hidden bg-surface relative">
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-surface/80 flex items-center justify-center border-b border-border">
                      <FolderCode className="w-12 h-12 text-muted/40" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-bold text-text group-hover:text-primary transition-colors text-base line-clamp-1">
                          {p.title}
                        </h3>
                        <Badge variant={p.status === 'completed' ? 'success' : 'warning'} size="sm">
                          {p.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted mb-4 line-clamp-2 leading-relaxed">
                        {p.shortDescription}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                      {p.technologies.slice(0, 4).map((t) => (
                        <Badge key={t} variant="primary" size="sm">
                          {t}
                        </Badge>
                      ))}
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

// ─── Achievements Section ─────────────────────────────────────────────────────
function AchievementsSection() {
  const { data, isLoading } = useAchievements({ featured: true, limit: 4 });
  const items = data?.data ?? [];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/50 border-y border-border/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Achievements & Honors" subtitle="Honors, awards, and milestones" viewAllLink="/achievements" />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="Achievements coming soon" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((a, i) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-text text-sm line-clamp-1">{a.title}</h3>
                  <p className="text-xs text-muted mt-0.5">{a.organization}</p>
                  <p className="text-xs text-primary font-medium mt-0.5">{formatDate(a.date, 'month-year')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Certificates Section ─────────────────────────────────────────────────────
function CertificatesSection() {
  const { data, isLoading } = useCertificates({ featured: true, limit: 6 });
  const certs = data?.data ?? [];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Certifications" subtitle="Professional credentials and courses" viewAllLink="/certificates" />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : certs.length === 0 ? (
          <EmptyState title="Certificates coming soon" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  {c.certificateImage && (
                    <img src={c.certificateImage} alt={c.title} className="w-12 h-12 object-contain rounded-xl border border-border flex-shrink-0 bg-surface" />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-text text-sm line-clamp-2">{c.title}</h3>
                    <p className="text-xs text-primary font-medium mt-0.5">{c.issuer}</p>
                    <p className="text-xs text-muted mt-0.5">{formatDate(c.issueDate, 'month-year')}</p>
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

// ─── Contact Form Component ───────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
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
      toast.success('Message sent successfully! I\'ll reply as soon as possible.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/50 border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Get In Touch" subtitle="Have a project or opportunity? Send me a message." center />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <h3 className="font-bold text-text text-lg mb-3">Let's Connect</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              I am open to discussions about software development projects, freelancing opportunities, or joining an innovative team.
            </p>
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="text-primary font-semibold hover:underline text-sm block mb-2">
                ✉️ {profile.email}
              </a>
            )}
            {profile?.location && (
              <p className="text-sm text-muted flex items-center gap-1.5 mt-2">
                <MapPin className="w-4 h-4 text-primary" /> {profile.location}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div>
              <input
                {...register('name')}
                placeholder="Your Name *"
                className="w-full px-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input
                {...register('email')}
                placeholder="Your Email *"
                type="email"
                className="w-full px-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input
                {...register('subject')}
                placeholder="Subject *"
                className="w-full px-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.subject && <p className="text-xs text-error mt-1">{errors.subject.message}</p>}
            </div>
            <div>
              <textarea
                {...register('message')}
                placeholder="Your Message *"
                rows={4}
                className="w-full px-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              {errors.message && <p className="text-xs text-error mt-1">{errors.message.message}</p>}
            </div>
            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── HomePage Export ──────────────────────────────────────────────────────────
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
      <ContactSection />
    </>
  );
}