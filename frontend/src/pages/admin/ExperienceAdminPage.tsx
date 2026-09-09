import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { useExperience, useCreateExperience, useUpdateExperience, useDeleteExperience } from '../../hooks/useExperience';
import { formatDate, formatDuration } from '../../utils/formatters';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Experience } from '../../types';

const schema = z.object({
  company: z.string().min(2),
  position: z.string().min(2),
  employmentType: z.enum(['full-time','part-time','internship','freelance','volunteer','leadership']),
  location: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  technologies: z.string().optional(),
  companyUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;
const empTypes = ['full-time','part-time','internship','freelance','volunteer','leadership'].map((v) => ({ value: v, label: v }));

function ExpForm({ exp, onClose }: { exp?: Experience; onClose: () => void }) {
  const create = useCreateExperience();
  const update = useUpdateExperience();
  const { register, handleSubmit, watch } = useForm<Form>({
    defaultValues: exp ? { ...exp, startDate: exp.startDate.slice(0,10), endDate: exp.endDate?.slice(0,10) ?? '', technologies: exp.technologies.join(', '), companyUrl: exp.companyUrl ?? '' } : { employmentType: 'full-time', current: true, published: true },
  });
  const current = watch('current');
  const onSubmit = (data: Form) => {
    const payload = { ...data, technologies: data.technologies?.split(',').map((t) => t.trim()).filter(Boolean) ?? [], companyUrl: data.companyUrl || undefined };
    if (exp) { update.mutate({ id: exp._id, data: payload as Partial<Experience> }, { onSuccess: onClose }); }
    else { create.mutate(payload as Partial<Experience>, { onSuccess: onClose }); }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Company" required {...register('company')} />
        <Input label="Position / Role" required {...register('position')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Employment Type" options={empTypes} {...register('employmentType')} />
        <Input label="Location" {...register('location')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Start Date" type="date" required {...register('startDate')} />
        {!current && <Input label="End Date" type="date" {...register('endDate')} />}
      </div>
      <Input label="Technologies Used" placeholder="React, Node.js, PostgreSQL" {...register('technologies')} hint="Comma separated" />
      <Input label="Company Website" type="url" {...register('companyUrl')} />
      <Textarea label="Description" rows={3} {...register('description')} />
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-text cursor-pointer"><input type="checkbox" {...register('current')} className="w-4 h-4 accent-primary" />Currently working here</label>
        <label className="flex items-center gap-2 text-sm text-text cursor-pointer"><input type="checkbox" {...register('published')} className="w-4 h-4 accent-primary" />Published</label>
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={create.isPending || update.isPending}>{exp ? 'Update' : 'Add'}</Button>
      </div>
    </form>
  );
}

export default function ExperienceAdminPage() {
  const { data, isLoading } = useExperience();
  const deleteExp = useDeleteExperience();
  const [editExp, setEditExp] = useState<Experience | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const items = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-text">Experience</h1></div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setEditExp(null)}>Add Experience</Button>
      </div>
      {isLoading ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div> : items.length === 0 ? (
        <EmptyState title="No experience yet" action={{ label: 'Add Experience', onClick: () => setEditExp(null) }} />
      ) : (
        <div className="space-y-3">
          {items.map((exp) => (
            <div key={exp._id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text">{exp.position}</p>
                <p className="text-sm text-primary">{exp.company}</p>
                <p className="text-xs text-muted">{formatDate(exp.startDate, 'month-year')} — {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate, 'month-year') : ''} · {formatDuration(exp.startDate, exp.endDate, exp.current)}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditExp(exp)} className="p-1.5 hover:text-primary transition-colors text-muted"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(exp._id)} className="p-1.5 hover:text-error transition-colors text-muted"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={editExp !== undefined} onClose={() => setEditExp(undefined)} title={editExp ? 'Edit Experience' : 'Add Experience'} size="md">
        <ExpForm exp={editExp ?? undefined} onClose={() => setEditExp(undefined)} />
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteExp.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        loading={deleteExp.isPending} title="Delete Experience" />
    </div>
  );
}