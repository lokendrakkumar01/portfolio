import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { useProjects, useDeleteProject } from '../../hooks/useProjects';
import { formatDate } from '../../utils/formatters';
import { useState as useLocalState } from 'react';

export default function ProjectsAdminPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useProjects({ page, limit: 10, q: q || undefined });
  const deleteProject = useDeleteProject();
  const projects = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Projects</h1>
          <p className="text-muted text-sm">{pagination?.total ?? 0} total projects</p>
        </div>
        <Link to="/admin/projects/new"><Button icon={<Plus className="w-4 h-4" />}>Add Project</Button></Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search projects..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : projects.length === 0 ? (
        <EmptyState title="No projects found" action={{ label: 'Add First Project', onClick: () => {} }} />
      ) : (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Project</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden lg:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden lg:table-cell">Created</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.coverImage ? <img src={p.coverImage} alt={p.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" /> : <div className="w-10 h-10 bg-primary/10 rounded-lg flex-shrink-0" />}
                        <div className="min-w-0">
                          <p className="font-medium text-text truncate">{p.title}</p>
                          <p className="text-xs text-muted truncate max-w-xs">{p.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell"><Badge size="sm">{p.category}</Badge></td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Badge variant={p.status === 'completed' ? 'success' : 'warning'} size="sm">{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted">{formatDate(p.createdAt, 'short')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="p-1.5 hover:text-primary transition-colors text-muted"><ExternalLink className="w-4 h-4" /></a>}
                        <Link to={`/admin/projects/${p._id}/edit`} className="p-1.5 hover:text-primary transition-colors text-muted"><Pencil className="w-4 h-4" /></Link>
                        <button onClick={() => setDeleteId(p._id)} className="p-1.5 hover:text-error transition-colors text-muted"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
        </>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteProject.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); } }}
        loading={deleteProject.isPending}
        title="Delete Project" description="This will permanently delete the project and its images." />
    </div>
  );
}