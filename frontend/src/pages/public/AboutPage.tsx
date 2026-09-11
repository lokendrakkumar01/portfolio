import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useProfile } from '../../hooks/useProfile';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { useExperience } from '../../hooks/useExperience';
import { useEducation } from '../../hooks/useEducation';
import { getSocialIcon, formatDate, formatDuration } from '../../utils/formatters';

export default function AboutPage() {
  const { data: profileData, isLoading } = useProfile();
  const { data: socialData } = useSocialLinks();
  const { data: expData } = useExperience();
  const { data: eduData } = useEducation();
  const profile = profileData?.data;
  const socialLinks = (socialData?.data ?? []).filter((l) => l.active);
  const experiences = (expData?.data ?? []).filter((e) => e.published);
  const educations = (eduData?.data ?? []).filter((e) => e.published);

  return (
    <>
      <SEO title="About Me" description={profile?.shortBio} image={profile?.profileImage} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="About Me" subtitle="My story, background and values" center />

        {/* Profile hero */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-16">
          <div className="flex-shrink-0">
            {isLoading ? <Skeleton className="w-36 h-36 rounded-full" /> : (
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-border shadow-xl">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt={profile.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                ) : <div className="w-full h-full bg-card flex items-center justify-center text-5xl">👤</div>}
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            {isLoading ? <Skeleton className="h-9 w-48 mb-3" /> : <h1 className="text-3xl font-bold text-text mb-2">{profile?.name}</h1>}
            {isLoading ? <Skeleton className="h-6 w-56 mb-3" /> : <p className="text-xl text-primary font-medium mb-2">{profile?.title}</p>}
            {isLoading ? <Skeleton className="h-5 w-40 mb-4" /> : (
              <div className="flex flex-wrap gap-4 mb-4 justify-center sm:justify-start">
                {profile?.location && <span className="flex items-center gap-1 text-sm text-muted"><MapPin className="w-4 h-4" />{profile.location}</span>}
                {profile?.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-1 text-sm text-muted hover:text-primary"><Mail className="w-4 h-4" />{profile.email}</a>}
                {profile?.phone && <span className="flex items-center gap-1 text-sm text-muted"><Phone className="w-4 h-4" />{profile.phone}</span>}
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return <a key={link._id} href={link.url} target="_blank" rel="noreferrer" aria-label={link.platform}
                    className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary text-muted transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>;
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <h2 className="text-xl font-semibold text-text mb-4">My Story</h2>
          {isLoading ? <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /><Skeleton className="h-4 w-4/5" /></div> : (
            <p className="text-muted leading-relaxed whitespace-pre-line">{profile?.longBio ?? profile?.shortBio ?? 'Biography coming soon.'}</p>
          )}
        </motion.div>

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-semibold text-text mb-6">Work Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp._id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex flex-wrap justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-text">{exp.position}</h3>
                      <p className="text-sm text-primary">{exp.company}</p>
                    </div>
                    <div className="text-right text-xs text-muted">
                      <p>{formatDate(exp.startDate, 'month-year')} — {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate, 'month-year') : ''}</p>
                      <p>{formatDuration(exp.startDate, exp.endDate, exp.current)}</p>
                    </div>
                  </div>
                  {exp.description && <p className="text-sm text-muted mb-3">{exp.description}</p>}
                  {exp.technologies.length > 0 && <div className="flex flex-wrap gap-1">{exp.technologies.map((t) => <Badge key={t} size="sm">{t}</Badge>)}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-text mb-6">Education</h2>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu._id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-text">{edu.degree} in {edu.field}</h3>
                      <p className="text-sm text-primary">{edu.institution}</p>
                      {edu.location && <p className="text-xs text-muted flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{edu.location}</p>}
                      {edu.grade && <p className="text-xs text-muted">Grade: {edu.grade}</p>}
                    </div>
                    <p className="text-xs text-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(edu.startDate, 'year')} — {edu.current ? 'Present' : edu.endDate ? formatDate(edu.endDate, 'year') : ''}
                    </p>
                  </div>
                  {edu.description && <p className="text-sm text-muted mt-2">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}