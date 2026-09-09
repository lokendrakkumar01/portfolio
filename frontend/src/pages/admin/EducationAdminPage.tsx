import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { Input, Textarea } from '../../components/ui/Input';
import { useEducation, useCreateEducation, useUpdateEducation, useDeleteEducation } from '../../hooks/useEducation';
import { formatDate } from '../../utils/formatters';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Education } from '../../types';

const schema = z.object({
  institution: z.string().min(2),
  degree: z.string().min(2),
  field: z.string().min(2),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  grade: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  published: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;

function EduForm({ edu, onClose }: { edu?: Education; onClose: () => void }) {
  const create = useCreateEducation();
  const update = useUpdateEducation();
  const { register, handleSubmit, watch } = useForm<Form>({
    defaultValues: edu ? { ...edu, startDate: edu.startDate.slice(0,10), endDate: edu.endDate?.slice(0,10) ?? '' } : { current: true, published: true },
  });
  const current = watch('current');
  const onSubmit = (data: Form) => {
    if (edu) { update.mutate({ id: edu._id, data: data as Partial<Education> }, { onSuccess: onClose }); }
    else { create.mutate(data as Partial<Education>, { onSuccess: onClose }); }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Institution" required {...register('institution')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Degree" required placeholder="B.Tech, M.Sc" {...register('degree')} />
        <Input label="Field / Major" required placeholder="Computer Science" {...register('field')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Start Date" type="date" required {...register('startDate')} />
        {!current && <Input label="End Date" type="date" {...register('endDate')} />}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Grade / CGPA" {...register('grade')} />
        <Input label="Location" {...register('location')} />
      </div>
      <Textarea label="Description" rows={3} {...register('description')} />
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-text cursor-pointer"><input type="checkbox" {...register('current')} className="w-4 h-4 accent-primary" />Currently studying here</label>
        <label className="flex items-center gap-2 text-sm text-text cursor-pointer"><input type="checkbox" {...register('published')} className="w-4 h-4 accent-primary" />Published</label>
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={create.isPending || update.isPending}>{edu ? 'Update' : 'Add'}</Button>
      </div>
    </form>
  );
}

export default function EducationAdminPage() {
  const { data, isLoading } = useEducation();
  const deleteEdu = useDeleteEducation();
  const [editEdu, setEditEdu] = useState<Education | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const items = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-text">Education</h1></div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setEditEdu(null)}>Add Education</Button>
      </div>
      {isLoading ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div> : items.length === 0 ? (
        <EmptyState title="No education records yet" action={{ label: 'Add Education', onClick: () => setEditEdu(null) }} />
      ) : (
        <div className="space-y-3">
          {items.map((edu) => (
            <div key={edu._id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text">{edu.degree} in {edu.field}</p>
                <p className="text-sm text-muted">{edu.institution}</p>
                <p className="text-xs text-muted">{formatDate(edu.startDate, 'year')} — {edu.current ? 'Present' : edu.endDate ? formatDate(edu.endDate, 'year') : ''}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditEdu(edu)} className="p-1.5 hover:text-primary transition-colors text-muted"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(edu._id)} className="p-1.5 hover:text-error transition-colors text-muted"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={editEdu !== undefined} onClose={() => setEditEdu(undefined)} title={editEdu ? 'Edit Education' : 'Add Education'} size="md">
        <EduForm edu={editEdu ?? undefined} onClose={() => setEditEdu(undefined)} />
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteEdu.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        loading={deleteEdu.isPending} title="Delete Education" />
    </div>
  );
}