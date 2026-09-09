import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Button } from '../../components/ui/Button';
import { useProfile } from '../../hooks/useProfile';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { contactApi } from '../../api/contact.api';
import { getSocialIcon } from '../../utils/formatters';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(20),
});
type Form = z.infer<typeof schema>;

const cls = 'w-full px-4 py-2.5 text-sm bg-card border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

export default function ContactPage() {
  const { data: profileData } = useProfile();
  const { data: socialData } = useSocialLinks();
  const profile = profileData?.data;
  const socialLinks = (socialData?.data ?? []).filter((l) => l.active);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    try {
      await contactApi.submit(data);
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <SEO title="Contact" description="Get in touch with me" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="Get In Touch" subtitle="Have an idea? Let's build something together." center />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <p className="text-muted text-sm leading-relaxed">
              I'm always open to new opportunities, collaborations, and conversations. Fill out the form and I'll get back to you as soon as possible.
            </p>
            <div className="space-y-4">
              {profile?.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><Mail className="w-5 h-5 text-primary" /></div>
                  <div><p className="text-xs text-muted">Email</p><a href={`mailto:${profile.email}`} className="text-sm text-text hover:text-primary">{profile.email}</a></div>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><Phone className="w-5 h-5 text-primary" /></div>
                  <div><p className="text-xs text-muted">Phone</p><p className="text-sm text-text">{profile.phone}</p></div>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div>
                  <div><p className="text-xs text-muted">Location</p><p className="text-sm text-text">{profile.location}</p></div>
                </div>
              )}
            </div>
            {socialLinks.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Social Media</p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return <a key={link._id} href={link.url} target="_blank" rel="noreferrer" aria-label={link.platform}
                      className="p-2.5 rounded-lg border border-border hover:border-primary hover:text-primary text-muted transition-colors">
                      <Icon className="w-4 h-4" />
                    </a>;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-4 bg-card border border-border rounded-2xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><input {...register('name')} placeholder="Your Name *" className={cls} />{errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}</div>
              <div><input {...register('email')} type="email" placeholder="Your Email *" className={cls} />{errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}</div>
            </div>
            <div><input {...register('subject')} placeholder="Subject *" className={cls} />{errors.subject && <p className="text-xs text-error mt-1">{errors.subject.message}</p>}</div>
            <div><textarea {...register('message')} placeholder="Your Message *" rows={6} className={`${cls} resize-none`} />{errors.message && <p className="text-xs text-error mt-1">{errors.message.message}</p>}</div>
            <Button type="submit" loading={isSubmitting} className="w-full" size="lg" icon={<MessageSquare className="w-4 h-4" />}>Send Message</Button>
          </form>
        </div>
      </div>
    </>
  );
}