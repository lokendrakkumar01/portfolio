import fs from 'fs';
import path from 'path';

const files = {
  "src/types/index.ts": "export interface ApiResponse<T> { success: boolean; message: string; data: T; }\nexport interface AuthUser { id: string; email: string; role: 'admin'; }",
  "src/utils/cn.ts": "import { type ClassValue, clsx } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\nexport const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));",
  "src/utils/formatters.ts": "export const truncate = (text: string, len: number) => text.slice(0, len);",
  "src/api/client.ts": "import axios from 'axios';\nexport const apiClient = axios.create();",
  "src/store/auth.store.ts": "import { create } from 'zustand';\nexport const useAuthStore = create(() => ({}));",
  "src/hooks/useTheme.ts": "import { useState } from 'react';\nexport const useTheme = () => ({ theme: 'light', toggleTheme: () => {} });",
  "src/components/ui/Button.tsx": "export const Button = ({ children, ...props }: any) => <button {...props}>{children}</button>;",
  "src/components/ui/Spinner.tsx": "export const Spinner = ({ size }: any) => <div>Loading...</div>;",
  "src/layouts/PublicLayout.tsx": "import { Outlet } from 'react-router-dom';\nexport default function PublicLayout() { return <div><Outlet /></div>; }",
  "src/layouts/AdminLayout.tsx": "import { Outlet } from 'react-router-dom';\nexport default function AdminLayout() { return <div><Outlet /></div>; }",
  
  // Public pages
  "src/pages/public/HomePage.tsx": "export default function HomePage() { return <div>HomePage</div>; }",
  "src/pages/public/AboutPage.tsx": "export default function AboutPage() { return <div>AboutPage</div>; }",
  "src/pages/public/SkillsPage.tsx": "export default function SkillsPage() { return <div>SkillsPage</div>; }",
  "src/pages/public/ProjectsPage.tsx": "export default function ProjectsPage() { return <div>ProjectsPage</div>; }",
  "src/pages/public/ProjectDetailPage.tsx": "export default function ProjectDetailPage() { return <div>ProjectDetailPage</div>; }",
  "src/pages/public/CertificatesPage.tsx": "export default function CertificatesPage() { return <div>CertificatesPage</div>; }",
  "src/pages/public/AchievementsPage.tsx": "export default function AchievementsPage() { return <div>AchievementsPage</div>; }",
  "src/pages/public/GalleryPage.tsx": "export default function GalleryPage() { return <div>GalleryPage</div>; }",
  "src/pages/public/ResumePage.tsx": "export default function ResumePage() { return <div>ResumePage</div>; }",
  "src/pages/public/ContactPage.tsx": "export default function ContactPage() { return <div>ContactPage</div>; }",
  "src/pages/public/NotFoundPage.tsx": "export default function NotFoundPage() { return <div>404</div>; }",
  
  // Admin pages
  "src/pages/admin/LoginPage.tsx": "export default function LoginPage() { return <div>Login</div>; }",
  "src/pages/admin/DashboardPage.tsx": "export default function DashboardPage() { return <div>Dashboard</div>; }",
  "src/pages/admin/ProfilePage.tsx": "export default function ProfilePage() { return <div>Profile</div>; }",
  "src/pages/admin/ProjectsAdminPage.tsx": "export default function ProjectsAdminPage() { return <div>ProjectsAdmin</div>; }",
  "src/pages/admin/ProjectEditPage.tsx": "export default function ProjectEditPage() { return <div>ProjectEdit</div>; }",
  "src/pages/admin/CertificatesAdminPage.tsx": "export default function CertificatesAdminPage() { return <div>CertificatesAdmin</div>; }",
  "src/pages/admin/CertificateEditPage.tsx": "export default function CertificateEditPage() { return <div>CertificateEdit</div>; }",
  "src/pages/admin/AchievementsAdminPage.tsx": "export default function AchievementsAdminPage() { return <div>AchievementsAdmin</div>; }",
  "src/pages/admin/AchievementEditPage.tsx": "export default function AchievementEditPage() { return <div>AchievementEdit</div>; }",
  "src/pages/admin/SkillsAdminPage.tsx": "export default function SkillsAdminPage() { return <div>SkillsAdmin</div>; }",
  "src/pages/admin/EducationAdminPage.tsx": "export default function EducationAdminPage() { return <div>EducationAdmin</div>; }",
  "src/pages/admin/ExperienceAdminPage.tsx": "export default function ExperienceAdminPage() { return <div>ExperienceAdmin</div>; }",
  "src/pages/admin/GalleryAdminPage.tsx": "export default function GalleryAdminPage() { return <div>GalleryAdmin</div>; }",
  "src/pages/admin/ResumeAdminPage.tsx": "export default function ResumeAdminPage() { return <div>ResumeAdmin</div>; }",
  "src/pages/admin/SocialLinksAdminPage.tsx": "export default function SocialLinksAdminPage() { return <div>SocialLinksAdmin</div>; }",
  "src/pages/admin/MessagesAdminPage.tsx": "export default function MessagesAdminPage() { return <div>MessagesAdmin</div>; }",
  "src/pages/admin/SettingsAdminPage.tsx": "export default function SettingsAdminPage() { return <div>SettingsAdmin</div>; }",

  "src/App.tsx": `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join('e:/portfolio/frontend', filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log("Done part 2");
