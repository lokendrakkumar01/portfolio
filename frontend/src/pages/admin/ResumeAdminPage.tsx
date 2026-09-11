import { useRef, useState } from 'react';
import { Upload, Trash2, Star, Download, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useResume, useUploadResume, useSetCurrentResume, useDeleteResume } from '../../hooks/useResume';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { downloadResumeFile } from '../../utils/download';

export default function ResumeAdminPage() {
  const { data, isLoading } = useResume();
  const uploadResume = useUploadResume();
  const setCurrent = useSetCurrentResume();
  const deleteResume = useDeleteResume();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const resumes = data?.data ?? [];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadResume.mutate(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Resume / CV Management</h1>
          <p className="text-muted text-sm mt-0.5">Upload and manage your CV document versions</p>
        </div>
        <Button icon={<Upload className="w-4 h-4" />} loading={uploadResume.isPending} onClick={() => fileRef.current?.click()}>
          Upload New Resume
        </Button>
        <input ref={fileRef} type="file" accept=".pdf" className="sr-only" onChange={handleUpload} />
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm text-text">
          <p className="font-semibold text-primary mb-0.5">Resume Versioning</p>
          <p className="text-muted">
            Upload your PDF resume. The latest upload will automatically be marked as <span className="font-semibold text-text">Current</span>. Visitors on the public portfolio will view and download the current version.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resume uploaded yet"
          description="Upload your resume PDF to allow visitors to view and download your CV."
          action={{ label: 'Upload Resume PDF', onClick: () => fileRef.current?.click() }}
        />
      ) : (
        <div className="space-y-3">
          {resumes.map((r) => (
            <div
              key={r._id}
              className={`bg-card border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${
                r.isCurrent ? 'border-primary/60 ring-1 ring-primary/20 bg-primary/5' : 'border-border hover:border-border/80'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-text text-sm truncate">{r.fileName}</p>
                    {r.isCurrent && <Badge variant="success" size="sm">Current Active</Badge>}
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Version {r.version} · {formatFileSize(r.fileSize)} · Uploaded {formatDate(r.uploadedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => downloadResumeFile(r.fileUrl, r.fileName || 'Lokendra_Kumar_Resume.pdf')}
                >
                  Download
                </Button>
                {!r.isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Star className="w-4 h-4" />}
                    loading={setCurrent.isPending}
                    onClick={() => setCurrent.mutate(r._id)}
                  >
                    Set Active
                  </Button>
                )}
                <button
                  onClick={() => setDeleteId(r._id)}
                  className="p-2 hover:bg-error/10 hover:text-error rounded-lg transition-colors text-muted"
                  title="Delete version"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteResume.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
        loading={deleteResume.isPending}
        title="Delete Resume Version"
        description="Are you sure you want to permanently delete this resume version?"
      />
    </div>
  );
}