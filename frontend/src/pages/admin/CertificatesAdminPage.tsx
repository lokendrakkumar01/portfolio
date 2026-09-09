import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { useCertificates, useDeleteCertificate } from '../../hooks/useCertificates';
import { formatDate } from '../../utils/formatters';

export default function CertificatesAdminPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useCertificates({ limit: 50 });
  const deleteCert = useDeleteCertificate();
  const certs = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-text">Certificates</h1><p className="text-muted text-sm">{certs.length} total</p></div>
        <Link to="/admin/certificates/new"><Button icon={<Plus className="w-4 h-4" />}>Add Certificate</Button></Link>
      </div>
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : certs.length === 0 ? (
        <EmptyState title="No certificates yet" action={{ label: 'Add Certificate', onClick: () => {} }} />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Certificate</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden md:table-cell">Issuer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {certs.map((c) => (
                <tr key={c._id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.certificateImage ? <img src={c.certificateImage} alt={c.title} className="w-10 h-10 rounded-lg object-contain border border-border flex-shrink-0" /> : <div className="w-10 h-10 bg-primary/10 rounded-lg flex-shrink-0" />}
                      <p className="font-medium text-text line-clamp-1">{c.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted text-sm">{c.issuer}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted text-xs">{formatDate(c.issueDate, 'month-year')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/certificates/${c._id}/edit`} className="p-1.5 hover:text-primary transition-colors text-muted"><Pencil className="w-4 h-4" /></Link>
                      <button onClick={() => setDeleteId(c._id)} className="p-1.5 hover:text-error transition-colors text-muted"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteCert.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        loading={deleteCert.isPending} title="Delete Certificate" />
    </div>
  );
}