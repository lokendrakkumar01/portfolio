import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import { Spinner } from './components/ui/Spinner';

// Public pages
const HomePage = lazy(() => import('./pages/public/HomePage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const SkillsPage = lazy(() => import('./pages/public/SkillsPage'));
const ProjectsPage = lazy(() => import('./pages/public/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/public/ProjectDetailPage'));
const CertificatesPage = lazy(() => import('./pages/public/CertificatesPage'));
const AchievementsPage = lazy(() => import('./pages/public/AchievementsPage'));
const GalleryPage = lazy(() => import('./pages/public/GalleryPage'));
const ResumePage = lazy(() => import('./pages/public/ResumePage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));

// Admin pages
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/admin/ProfilePage'));
const ProjectsAdminPage = lazy(() => import('./pages/admin/ProjectsAdminPage'));
const ProjectEditPage = lazy(() => import('./pages/admin/ProjectEditPage'));
const CertificatesAdminPage = lazy(() => import('./pages/admin/CertificatesAdminPage'));
const CertificateEditPage = lazy(() => import('./pages/admin/CertificateEditPage'));
const AchievementsAdminPage = lazy(() => import('./pages/admin/AchievementsAdminPage'));
const AchievementEditPage = lazy(() => import('./pages/admin/AchievementEditPage'));
const SkillsAdminPage = lazy(() => import('./pages/admin/SkillsAdminPage'));
const EducationAdminPage = lazy(() => import('./pages/admin/EducationAdminPage'));
const ExperienceAdminPage = lazy(() => import('./pages/admin/ExperienceAdminPage'));
const GalleryAdminPage = lazy(() => import('./pages/admin/GalleryAdminPage'));
const ResumeAdminPage = lazy(() => import('./pages/admin/ResumeAdminPage'));
const SocialLinksAdminPage = lazy(() => import('./pages/admin/SocialLinksAdminPage'));
const MessagesAdminPage = lazy(() => import('./pages/admin/MessagesAdminPage'));
const SettingsAdminPage = lazy(() => import('./pages/admin/SettingsAdminPage'));

const queryClient = new QueryClient();

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="projects" element={<ProjectsAdminPage />} />
                <Route path="projects/new" element={<ProjectEditPage />} />
                <Route path="projects/:id/edit" element={<ProjectEditPage />} />
                <Route path="certificates" element={<CertificatesAdminPage />} />
                <Route path="certificates/new" element={<CertificateEditPage />} />
                <Route path="certificates/:id/edit" element={<CertificateEditPage />} />
                <Route path="achievements" element={<AchievementsAdminPage />} />
                <Route path="achievements/new" element={<AchievementEditPage />} />
                <Route path="achievements/:id/edit" element={<AchievementEditPage />} />
                <Route path="skills" element={<SkillsAdminPage />} />
                <Route path="education" element={<EducationAdminPage />} />
                <Route path="experience" element={<ExperienceAdminPage />} />
                <Route path="gallery" element={<GalleryAdminPage />} />
                <Route path="resume" element={<ResumeAdminPage />} />
                <Route path="social-links" element={<SocialLinksAdminPage />} />
                <Route path="messages" element={<MessagesAdminPage />} />
                <Route path="settings" element={<SettingsAdminPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  );
}
