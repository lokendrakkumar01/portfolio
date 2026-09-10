import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import { useTheme } from '../hooks/useTheme';
import AIChatWidget from '../components/common/AIChatWidget';

export default function PublicLayout() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div data-theme={theme} className="min-h-screen bg-bg flex flex-col">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <AIChatWidget />
    </div>
  );
}