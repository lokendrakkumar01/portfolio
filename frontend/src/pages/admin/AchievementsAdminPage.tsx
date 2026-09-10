import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAchievements, useDeleteAchievement } from '../../hooks/useAchievements';
import { formatDate } from '../../utils/formatters';

export default function AchievementsAdminPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useAchievements();
  const deleteAch = useDeleteAchievement();
  const items = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-text">Achievements</h1><p className="text-muted text-sm">{items.length} total</p></div>
        <Link to="/admin/achievements/new"><Button icon={<Plus className="w-4 h-4" />}>Add Achievement</Button></Link>
      </div>
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="No achievements yet" />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a._id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text">{a.title}</p>
                <p className="text-xs text-muted">{a.organization} · {formatDate(a.date, 'month-year')}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Link to={`/admin/achievements/${a._id}/edit`} className="p-1.5 hover:text-primary transition-colors text-muted"><Pencil className="w-4 h-4" /></Link>
                <button onClick={() => setDeleteId(a._id)} className="p-1.5 hover:text-error transition-colors text-muted"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteAch.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        loading={deleteAch.isPending} title="Delete Achievement" />
    </div>
  );
}