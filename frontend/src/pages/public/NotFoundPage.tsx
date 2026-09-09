import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/common/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="404 - Page Not Found" />
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text mb-2">Page Not Found</h2>
        <p className="text-muted mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/"><Button icon={<Home className="w-4 h-4" />}>Back to Home</Button></Link>
      </div>
    </>
  );
}