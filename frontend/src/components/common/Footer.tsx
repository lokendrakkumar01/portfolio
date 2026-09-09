import { Link } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useSettings } from '../../hooks/useSettings';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { getSocialIcon } from '../../utils/formatters';

const footerLinks = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  const { data: profileData } = useProfile();
  const { data: settingsData } = useSettings();
  const { data: socialData } = useSocialLinks();

  const profile = profileData?.data;
  const settings = settingsData?.data;
  const socialLinks = (socialData?.data ?? []).filter((l) => l.active);
  const year = new Date().getFullYear();
  const name = profile?.name ?? settings?.siteName ?? 'Portfolio';

  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-xl text-text mb-2">{name}</h3>
            {profile?.tagline && <p className="text-muted text-sm">{profile.tagline}</p>}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="text-sm text-primary hover:underline mt-2 block">
                {profile.email}
              </a>
            )}
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-sm font-semibold text-text uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-text uppercase tracking-wider mb-4">Connect</h4>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.platform}
                      className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary text-muted transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted">Social links coming soon.</p>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-sm text-muted">
            © {year} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
