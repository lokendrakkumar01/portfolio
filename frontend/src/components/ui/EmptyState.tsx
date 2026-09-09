import { type LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
    {Icon && (
      <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4 border border-border">
        <Icon className="w-8 h-8 text-muted" />
      </div>
    )}
    <h3 className="text-base font-semibold text-text mb-1">{title}</h3>
    {description && <p className="text-sm text-muted max-w-sm">{description}</p>}
    {action && (
      <Button className="mt-5" onClick={action.onClick}>{action.label}</Button>
    )}
  </div>
);
