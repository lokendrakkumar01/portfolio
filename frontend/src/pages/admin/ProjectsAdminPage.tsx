import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink, Search, Camera, FolderCode } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { useProjects, useDeleteProject, useUploadProjectCover } from '../../hooks/useProjects';
import { formatDate } from '../../utils/formatters';

export default function ProjectsAdminPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useProjects({ page, limit: 10, q: q || undefined });
  const deleteProject = useDeleteProject();
  const uploadCover = useUploadProjectCover();

  const projects = data?.data ?? [];
  const pagination = data?.pagination;

  const handleImageClick = (projectId: string) => {
    setActiveUploadId(projectId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadId) return;
    uploadCover.mutate(
      { id: activeUploadId, file },
      {
        onSettled: () => {
          setActiveUploadId(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text">Projects Management</h1>
          <p className="text-muted text-sm">{pagination?.total ?? 0} total projects — upload cover photos & details</p>
        </div>
        <Link to="/admin/projects/new" className="self-start sm:self-auto">
          <Button icon={<Plus className="w-4 h-4" />}>Add Project</Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Search projects by title, tech, description..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : projects.length === 0 ? (
        <EmptyState title="No projects found" action={{ label: 'Add First Project', onClick: () => {} }} />
      ) : (
        <>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="border-b border-border bg-surface/50">
                <tr>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-muted uppercase tracking-wider">Cover & Project</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-muted uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-muted uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-muted uppercase tracking-wider hidden lg:table-cell">Created</th>
                  <th className="text-right px-4 py-3.5 text-xs font-bold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => handleImageClick(p._id)}
                          className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface border border-border flex-shrink-0 cursor-pointer group hover:border-primary transition-colors shadow-sm"
                          title="Click to upload/change project photo"
                        >
                          {p.coverImage ? (
                            <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted">
                              <FolderCode className="w-6 h-6 text-muted/50" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Camera className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <Link to={`/admin/projects/${p._id}/edit`} className="font-bold text-text hover:text-primary transition-colors truncate block text-base">
                            {p.title}
                          </Link>
                          <p className="text-xs text-muted truncate max-w-xs">{p.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge size="sm" variant="primary">{p.category}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Badge variant={p.status === 'completed' ? 'success' : 'warning'} size="sm">{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted">{formatDate(p.createdAt, 'short')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleImageClick(p._id)}
                          title="Upload cover photo"
                        >
                          <Camera className="w-3.5 h-3.5 mr-1" /> Photo
                        </Button>
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noreferrer" className="p-2 hover:text-primary transition-colors text-muted rounded-lg hover:bg-surface">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Link to={`/admin/projects/${p._id}/edit`} className="p-2 hover:text-primary transition-colors text-muted rounded-lg hover:bg-surface">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleteId(p._id)} className="p-2 hover:text-error transition-colors text-muted rounded-lg hover:bg-surface">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
          {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
        </>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteProject.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); } }}
        loading={deleteProject.isPending}
        title="Delete Project"
        description="This will permanently delete the project and its images."
      />
    </div>
  );
}