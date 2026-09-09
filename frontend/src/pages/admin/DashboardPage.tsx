import { motion } from 'framer-motion';
import { FolderCode, Award, Trophy, Zap, GraduationCap, Briefcase, Image, FileText, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStats } from '../../hooks/useStats';
import { useAuthStore } from '../../store/auth.store';
import { Skeleton } from '../../components/ui/Skeleton';

const statCards = [
  { key: 'projects', label: 'Projects', icon: FolderCode, to: '/admin/projects', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { key: 'certificates', label: 'Certificates', icon: Award, to: '/admin/certificates', color: 'text-green-500', bg: 'bg-green-500/10' },
  { key: 'achievements', label: 'Achievements', icon: Trophy, to: '/admin/achievements', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { key: 'skills', label: 'Skills', icon: Zap, to: '/admin/skills', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { key: 'education', label: 'Education', icon: GraduationCap, to: '/admin/education', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { key: 'experience', label: 'Experience', icon: Briefcase, to: '/admin/experience', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { key: 'gallery', label: 'Gallery Items', icon: Image, to: '/admin/gallery', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { key: 'unreadMessages', label: 'Unread Messages', icon: MessageSquare, to: '/admin/messages', color: 'text-red-500', bg: 'bg-red-500/10' },
];

const quickLinks = [
  { to: '/', label: 'View Public Portfolio', icon: ExternalLink },
  { to: '/admin/profile', label: 'Update Profile', icon: null },
  { to: '/admin/resume', label: 'Manage Resume', icon: FileText },
  { to: '/admin/messages', label: 'View Messages', icon: MessageSquare },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useStats();
  const stats = data?.data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Welcome back, {user?.email}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, to, color, bg }, i) => (
          <motion.div key={key}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link to={to} className="block bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all">
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              {isLoading ? (
                <><Skeleton className="h-7 w-12 mb-1" /><Skeleton className="h-4 w-20" /></>
              ) : (
                <>
                  <p className="text-2xl font-bold text-text">{stats?.[key as keyof typeof stats] ?? 0}</p>
                  <p className="text-xs text-muted">{label}</p>
                </>
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-base font-semibold text-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickLinks.map(({ to, label, icon: Icon }) => (
            to.startsWith('http') || to === '/' ? (
              <a key={to} href={to} target={to === '/' ? '_blank' : undefined} rel="noreferrer"
                className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 text-sm text-text hover:border-primary/50 hover:text-primary transition-all">
                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                {label}
              </a>
            ) : (
              <Link key={to} to={to}
                className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 text-sm text-text hover:border-primary/50 hover:text-primary transition-all">
                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                {label}
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}