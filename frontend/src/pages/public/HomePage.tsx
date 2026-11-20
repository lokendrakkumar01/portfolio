import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Download, Mail, ArrowRight, MapPin, FolderCode, Trophy, Sparkles, UserCheck, Award, Play, Film, ZoomIn, X, Image as ImageIcon, ChevronLeft, ChevronRight, Calendar, Github, ExternalLink } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { useCurrentResume } from '../../hooks/useResume';
import { useStats } from '../../hooks/useStats';
import { useSkills } from '../../hooks/useSkills';
import { useProjects } from '../../hooks/useProjects';
import { useCertificates } from '../../hooks/useCertificates';
import { useAchievements } from '../../hooks/useAchievements';
import { useGallery } from '../../hooks/useGallery';
import { VideoPlayer, getVideoThumbnail, isVideoUrl } from '../../components/common/VideoPlayer';
import { CategoryIcon, SkillCard, SKILL_CATEGORY_LABELS } from '../../components/skills/SkillCard';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton, SkeletonCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { getSocialIcon, formatDate, optimizeCloudinaryUrl } from '../../utils/formatters';
import { downloadResumeFile } from '../../utils/download';
import { useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactApi } from '../../api/contact.api';
import toast from 'react-hot-toast';
import type { Skill, SkillCategory, GalleryItem } from '../../types';

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ end, label, suffix = '' }: { end: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || end === 0) {
      setCount(end);
      return;
    }
    let cur = 0;
    const step = Math.max(1, end / 30);
    const id = setInterval(() => {
      cur += step;
      if (cur >= end) { setCount(end); clearInterval(id); }
      else setCount(Math.floor(cur));
    }, 30);
    return () => clearInterval(id);
  }, [started, end]);

  return (
    <div ref={ref} className="text-center p-5 bg-card/60 backdrop-blur-md border border-border/60 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors" />
      <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-1">{count}{suffix}</div>
      <div className="text-xs font-bold text-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { data: profileData, isLoading } = useProfile();
  const { data: socialData } = useSocialLinks();
  const { data: resumeData } = useCurrentResume();
  const [imgError, setImgError] = useState(false);

  const profile = profileData?.data;
  const socialLinks = (socialData?.data ?? []).filter((l) => l.active).slice(0, 6);
  const currentResume = resumeData?.data;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glow Orbs */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full relative z-10">
        {/* Left Column Text */}
        <div className="order-2 lg:order-1 lg:col-span-7">
          {!profile && isLoading ? (
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 backdrop-blur-md border border-border/80 text-primary text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-accent" /> Welcome to my Portfolio
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-text leading-tight tracking-tight mb-4"
              >
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{profile?.name ?? 'Developer'}</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-lg sm:text-2xl lg:text-3xl font-bold text-muted mb-6"
              >
                {profile?.title && profile.title !== '[YOUR TITLE]' ? profile.title : 'Full-Stack Developer & Software Engineer'}
              </motion.h2>

              {profile?.tagline && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                  className="text-text italic text-lg mb-6 border-l-4 border-primary/60 pl-4 py-1"
                >
                  "{profile.tagline}"
                </motion.p>
              )}

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-muted text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl font-medium"
              >
                {profile?.shortBio ?? 'Building modern, performant, and scalable web applications.'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mb-10"
              >
                <Link to="/projects" className="w-full sm:w-auto">
                  <Button size="lg" icon={<ArrowRight className="w-4 h-4" />} className="w-full sm:w-auto shadow-lg shadow-primary/25">
                    Explore Projects
                  </Button>
                </Link>
                {currentResume && (
                  <Button
                    variant="outline"
                    size="lg"
                    icon={<Download className="w-4 h-4" />}
                    onClick={() => downloadResumeFile(currentResume.fileUrl, currentResume.fileName || 'Lokendra_Kumar_Resume.pdf')}
                    className="w-full sm:w-auto bg-surface/50 backdrop-blur-sm shadow-md"
                  >
                    Download Resume
                  </Button>
                )}
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" icon={<Mail className="w-4 h-4" />} className="w-full sm:w-auto">
                    Get in Touch
                  </Button>
                </Link>
              </motion.div>

              {/* Social Icons */}
              {socialLinks.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex gap-4 flex-wrap items-center">
                  <span className="text-xs text-muted font-bold uppercase tracking-widest mr-2">Follow me</span>
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <a
                        key={link._id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.platform}
                        className="p-3 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-md hover:border-primary hover:text-primary hover:-translate-y-1 text-muted transition-all duration-300 shadow-sm"
                      >
                        <Icon className="w-5 h-5" />
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
          className="order-1 lg:order-2 lg:col-span-5 flex justify-center py-4"
        >
          <div className="relative group">
            <div className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-primary to-accent opacity-30 blur-3xl animate-pulse-slow group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-8 border-card shadow-2xl ring-4 ring-primary/30 bg-surface flex items-center justify-center transform group-hover:scale-[1.02] transition-transform duration-500">
              {profile?.profileImage && !imgError ? (
                <img
                  src={optimizeCloudinaryUrl(profile.profileImage, 400)}
                  alt={profile.name ?? 'Lokendra Kumar'}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                  loading="eager"
                  // @ts-ignore
                  fetchpriority="high"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 via-surface to-accent/10 flex flex-col items-center justify-center text-center p-6">
                  <UserCheck className="w-20 h-20 sm:w-24 sm:h-24 text-primary/60 mb-4" />
                  <span className="text-lg font-bold text-text truncate max-w-[200px]">{profile?.name ?? 'Lokendra Kumar'}</span>
                  <span className="text-sm text-muted truncate max-w-[200px]">{profile?.title && profile.title !== '[YOUR TITLE]' ? profile.title : 'Full Stack Developer'}</span>
                </div>
              )}
            </div>

            {/* Availability Pill */}
            {profile?.availability === 'available' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="absolute -bottom-4 right-4 sm:right-8 flex items-center gap-3 bg-card/90 backdrop-blur-xl border border-border rounded-full px-5 py-2.5 shadow-2xl"
              >
                <div className="w-3 h-3 bg-success rounded-full animate-ping absolute" />
                <div className="w-3 h-3 bg-success rounded-full relative z-10" />
                <span className="text-sm font-bold text-text">Available for Hire</span>
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
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const { data: statsData } = useStats();
  const profile = profileData?.data;
  const stats = statsData?.data;
  const isLoading = !profile && isProfileLoading;

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-muted text-lg sm:text-xl leading-relaxed whitespace-pre-line font-medium">
              {profile?.longBio ?? profile?.shortBio ?? 'Biography coming soon.'}
            </p>
            {profile?.location && (
              <div className="flex items-center gap-2 text-text font-semibold text-base pt-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="pt-4">
              <Link to="/about">
                <Button variant="outline" size="lg" className="rounded-full shadow-sm">
                  Read Full Bio <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
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
  const { data, isLoading: isSkillsLoading } = useSkills();
  const reduceMotion = useReducedMotion();
  const skills = (data?.data ?? []).filter((skill) => skill.published !== false);
  const isLoading = !skills.length && isSkillsLoading;
  const grouped = skills.reduce((acc: Partial<Record<SkillCategory, Skill[]>>, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category]!.push(skill);
    return acc;
  }, {} as Partial<Record<SkillCategory, Skill[]>>);
  const categories = (Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[]).filter((category) => grouped[category]?.length);

  return (
    <section className="relative isolate overflow-hidden border-y border-border/40 bg-surface/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="skills-grid-pattern pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div className="skills-orb skills-orb-one pointer-events-none absolute -left-32 top-1/4 -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div className="skills-orb skills-orb-two pointer-events-none absolute -right-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading title="Skills & Tech Stack" subtitle="Technologies and tools I use to engineer scalable web applications" viewAllLink="/skills" />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <EmptyState title="Skills coming soon" description="Skills will appear here once added." />
        ) : (
          <div className="space-y-9 sm:space-y-12">
            {categories.map((category, catIdx) => {
              const categorySkills = grouped[category] ?? [];
              return (
              <motion.div
                key={category}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : catIdx * 0.08 }}
              >
                {/* Category Header */}
                <div className="mb-4 flex min-w-0 items-center gap-3 sm:mb-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 to-accent/15 text-primary sm:h-11 sm:w-11 sm:rounded-2xl">
                    <CategoryIcon category={category} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black leading-tight text-text sm:text-base">{SKILL_CATEGORY_LABELS[category]}</h3>
                    <p className="mt-0.5 text-[10px] font-medium text-muted">{categorySkills.length} {categorySkills.length === 1 ? 'technology' : 'technologies'}</p>
                  </div>
                  <div className="h-px min-w-3 flex-1 bg-gradient-to-r from-primary/40 via-accent/20 to-transparent" />
                  <span className="shrink-0 rounded-full border border-border/70 bg-card px-2.5 py-1 text-[10px] font-black tabular-nums text-muted">{categorySkills.length}</span>
                </div>

                <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {categorySkills.map((skill, index) => <SkillCard key={skill._id} skill={skill} index={index} compact />)}
                </div>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────
function ProjectsSection() {
  const navigate = useNavigate();
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects({ limit: 6 });
  const rawProjects = (projectsData?.data ?? []).filter((p) => p.published !== false);
  
  // Sort projects: Advanced (1) -> Medium (2) -> Basic (3)
  const projects = [...rawProjects].sort((a, b) => {
    const getRank = (c?: string) => (c === 'advanced' ? 1 : c === 'basic' ? 3 : 2);
    return getRank(a.complexity) - getRank(b.complexity);
  });
  
  const isLoading = !projects.length && isProjectsLoading;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Featured Projects" subtitle="A selection of software projects I've engineered" viewAllLink="/projects" />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState title="Projects coming soon" description="Projects will be showcased here." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div
                  onClick={() => navigate(`/projects/${p.slug}`)}
                  className="group block bg-card/60 backdrop-blur-xl rounded-3xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-500 h-full flex flex-col relative cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/90 z-10 pointer-events-none" />
                  {p.coverImage ? (
                    <div className="w-full h-56 overflow-hidden bg-surface relative">
                      <img
                        src={optimizeCloudinaryUrl(p.coverImage, 700)}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading={i < 3 ? 'eager' : 'lazy'}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-surface/80 flex items-center justify-center border-b border-border">
                      <FolderCode className="w-16 h-16 text-muted/30 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  )}
                  
                  <div className="p-6 flex-1 flex flex-col justify-between relative z-20 -mt-8 bg-card rounded-t-3xl border-t border-border/50">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-muted mb-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>Built: {formatDate(p.startDate || p.createdAt, 'month-year')}</span>
                      </div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-extrabold text-xl text-text group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all break-words line-clamp-1">
                          {p.title}
                        </h3>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <Badge variant={p.status === 'completed' ? 'success' : 'warning'} className="shadow-sm">
                            {p.status}
                          </Badge>
                          {p.complexity && (
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border tracking-wider ${
                              p.complexity === 'advanced'
                                ? 'bg-accent/20 text-accent border-accent/40'
                                : p.complexity === 'basic'
                                ? 'bg-muted/10 text-muted border-border'
                                : 'bg-primary/20 text-primary border-primary/40'
                            }`}>
                              {p.complexity === 'advanced' ? '🚀 ADVANCED' : p.complexity === 'basic' ? '📝 BASIC' : '⚡ MEDIUM'}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted mb-5 line-clamp-2 leading-relaxed font-medium">
                        {p.shortDescription}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border/60">
                      <div className="flex flex-wrap gap-1.5">
                        {p.technologies.slice(0, 2).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-surface border border-border text-text shadow-sm">{t}</span>
                        ))}
                        {p.technologies.length > 2 && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-surface text-muted border border-border">+{p.technologies.length - 2}</span>}
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {p.githubUrl && (
                          <a href={p.githubUrl} target="_blank" rel="noreferrer" title="View Source Code"
                            className="p-1.5 rounded-lg bg-surface border border-border hover:border-primary text-text hover:text-primary transition-colors">
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noreferrer" title="Live Demo"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                            <ExternalLink className="w-3.5 h-3.5" /> Live
                          </a>
                        )}
                      </div>
                    </div>
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

// ─── Achievements Section ─────────────────────────────────────────────────────
function AchievementsSection() {
  const { data: featuredData, isLoading: isFeaturedLoading } = useAchievements({ featured: true, limit: 4 });
  const { data: allData, isLoading: isAllLoading } = useAchievements({ limit: 4 });
  const featuredItems = featuredData?.data ?? [];
  const allItems = allData?.data ?? [];
  const items = featuredItems.length > 0 ? featuredItems : allItems;
  const isLoading = isFeaturedLoading && isAllLoading;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface/30 border-y border-border/40 relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading title="Achievements & Honors" subtitle="Honors, awards, and milestones" viewAllLink="/achievements" />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="Achievements coming soon" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((a, i) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 rounded-2xl flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-inner">
                  <Trophy className="w-8 h-8 drop-shadow-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-lg text-text line-clamp-1 group-hover:text-primary transition-colors">{a.title}</h3>
                  <p className="text-sm text-muted font-medium mt-1">{a.organization}</p>
                  <p className="text-xs text-primary font-bold mt-2 uppercase tracking-wide bg-primary/10 inline-block px-2 py-0.5 rounded-md border border-primary/20">{formatDate(a.date, 'month-year')}</p>
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
  const { data: featuredData, isLoading: isFeaturedLoading } = useCertificates({ featured: true, limit: 6 });
  const { data: allData, isLoading: isAllLoading } = useCertificates({ limit: 6 });
  const featuredCerts = featuredData?.data ?? [];
  const allCerts = allData?.data ?? [];
  const certs = featuredCerts.length > 0 ? featuredCerts : allCerts;
  const isLoading = isFeaturedLoading && isAllLoading;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Certifications" subtitle="Professional credentials and courses" viewAllLink="/certificates" />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)}
          </div>
        ) : certs.length === 0 ? (
          <EmptyState title="Certificates coming soon" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-card border border-border rounded-3xl p-6 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group"
              >
                {c.certificateImage ? (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface border border-border/60 flex-shrink-0 group-hover:shadow-md transition-shadow">
                    <img src={c.certificateImage} alt={c.title} loading="lazy" decoding="async" className="w-full h-full object-contain p-1" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-surface border border-border/60 flex items-center justify-center flex-shrink-0 group-hover:border-primary/40 transition-colors">
                    <Award className="w-8 h-8 text-muted/50" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-text text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{c.title}</h3>
                  <p className="text-xs text-muted font-medium mt-1.5">{c.issuer}</p>
                  <p className="text-[10px] text-muted/70 font-bold uppercase tracking-wider mt-1">{formatDate(c.issueDate, 'month-year')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Gallery Section ─────────────────────────────────────────────────────────
function GallerySection() {
  const { data, isLoading } = useGallery({ limit: 16, published: 'true' });
  const items = data?.data ?? [];
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [brokenMedia, setBrokenMedia] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface/30 border-t border-border/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          title="Moments & Video Gallery"
          subtitle="Event photos, hackathons, and video highlights from my journey"
          viewAllLink="/gallery"
        />

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="relative group/carousel">
            {/* Left Scroll Arrow Button (<) */}
            <button
              onClick={() => handleScroll('left')}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card/90 backdrop-blur-md border border-border/80 text-primary shadow-xl hover:bg-primary hover:text-white transition-all duration-300 z-20 flex items-center justify-center active:scale-95 shadow-primary/10"
              aria-label="Previous photos"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Scroll Arrow Button (>) */}
            <button
              onClick={() => handleScroll('right')}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card/90 backdrop-blur-md border border-border/80 text-primary shadow-xl hover:bg-primary hover:text-white transition-all duration-300 z-20 flex items-center justify-center active:scale-95 shadow-primary/10"
              aria-label="Next photos"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Horizontal Scrollable Carousel Container */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-none py-2 px-1 snap-x snap-mandatory scroll-smooth"
            >
              {items.map((img, i) => {
                const isVideo = img.mediaType === 'video' || isVideoUrl(img.imageUrl);
                const videoThumbnail = isVideo ? getVideoThumbnail(img.imageUrl) : null;
                const isBroken = brokenMedia[img._id];

                return (
                  <motion.button
                    key={img._id}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveItem(img)}
                    className="flex-shrink-0 w-56 sm:w-64 aspect-square relative overflow-hidden rounded-2xl border border-border/80 bg-surface hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 text-left snap-start focus:outline-none"
                  >
                    {isVideo ? (
                      <div className="w-full h-full bg-black relative flex items-center justify-center">
                        {videoThumbnail && !isBroken ? (
                          <img src={videoThumbnail} alt={img.title} loading={i < 4 ? 'eager' : 'lazy'} decoding="async" onError={() => setBrokenMedia((prev) => ({ ...prev, [img._id]: true }))} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-card p-3 text-center">
                            <Film className="w-8 h-8 text-primary mb-1 animate-bounce" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : !isBroken ? (
                      <img
                        src={optimizeCloudinaryUrl(img.imageUrl, 480)}
                        alt={img.title}
                        loading={i < 4 ? 'eager' : 'lazy'}
                        decoding="async"
                        onError={() => setBrokenMedia((prev) => ({ ...prev, [img._id]: true }))}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-card text-muted p-4 text-center">
                        <ImageIcon className="w-10 h-10 opacity-40 mb-2" />
                        <span className="text-xs font-bold">Media unavailable</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3 pointer-events-none">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full self-start shadow-sm">
                        {img.category}
                      </span>
                      <p className="text-white text-xs font-bold truncate leading-tight drop-shadow">
                        {img.title}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Video Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveItem(null)}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-10 border border-white/20 active:scale-95"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] bg-surface/90 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[70vh]">
                {activeItem.mediaType === 'video' || activeItem.imageUrl.includes('.mp4') || activeItem.imageUrl.includes('youtube') || activeItem.imageUrl.includes('vimeo') || activeItem.imageUrl.includes('/video/') ? (
                  <VideoPlayer url={activeItem.imageUrl} title={activeItem.title} autoPlay controls className="w-full h-full min-h-[350px]" />
                ) : (
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                )}
              </div>

              <div className="p-5 bg-card border-t border-border flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 border border-primary/30 text-primary px-3 py-0.5 rounded-full">
                    {activeItem.category}
                  </span>
                  <h3 className="text-base font-black text-text mt-1">{activeItem.title}</h3>
                </div>
                <Link
                  to="/gallery"
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-2xl hover:opacity-90 transition-all shadow-md"
                >
                  View Full Gallery ↗
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface/50 border-t border-border/40 relative overflow-hidden">
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading title="Get In Touch" subtitle="Have a project or opportunity? Send me a message." center />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto items-center">
          <div>
            <h3 className="font-extrabold text-3xl text-text mb-4">Let's Connect</h3>
            <p className="text-muted text-lg leading-relaxed mb-8 font-medium">
              I am open to discussions about software development projects, freelancing opportunities, or joining an innovative team. Let's build something great together.
            </p>
            
            <div className="space-y-6">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-card border border-border rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                    <Mail className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-text font-semibold group-hover:text-primary transition-colors">{profile.email}</p>
                  </div>
                </a>
              )}
              {profile?.location && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-card border border-border rounded-2xl flex items-center justify-center shadow-sm">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5">Location</p>
                    <p className="text-text font-semibold">{profile.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-card/80 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            <div>
              <input
                {...register('name')}
                placeholder="Your Name *"
                className="w-full px-5 py-3.5 text-sm font-medium bg-surface/50 border border-border/80 hover:border-primary/50 rounded-2xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
              />
              {errors.name && <p className="text-xs text-error mt-1.5 ml-2 font-medium">{errors.name.message}</p>}
            </div>
            <div>
              <input
                {...register('email')}
                placeholder="Your Email *"
                type="email"
                className="w-full px-5 py-3.5 text-sm font-medium bg-surface/50 border border-border/80 hover:border-primary/50 rounded-2xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
              />
              {errors.email && <p className="text-xs text-error mt-1.5 ml-2 font-medium">{errors.email.message}</p>}
            </div>
            <div>
              <input
                {...register('subject')}
                placeholder="Subject *"
                className="w-full px-5 py-3.5 text-sm font-medium bg-surface/50 border border-border/80 hover:border-primary/50 rounded-2xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
              />
              {errors.subject && <p className="text-xs text-error mt-1.5 ml-2 font-medium">{errors.subject.message}</p>}
            </div>
            <div>
              <textarea
                {...register('message')}
                placeholder="Your Message *"
                rows={5}
                className="w-full px-5 py-3.5 text-sm font-medium bg-surface/50 border border-border/80 hover:border-primary/50 rounded-2xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner resize-none"
              />
              {errors.message && <p className="text-xs text-error mt-1.5 ml-2 font-medium">{errors.message.message}</p>}
            </div>
            <Button type="submit" loading={isSubmitting} className="w-full rounded-2xl py-4 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform" size="lg">
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
      <GallerySection />
      <ContactSection />
    </>
  );
}
