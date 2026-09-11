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

function EduForm({ edu, initialPreset, onClose }: { edu?: Education; initialPreset?: Partial<Education>; onClose: () => void }) {
  const create = useCreateEducation();
  const update = useUpdateEducation();
  const { register, handleSubmit, watch } = useForm<Form>({
    defaultValues: edu
      ? { ...edu, startDate: edu.startDate?.slice(0,10) ?? '', endDate: edu.endDate?.slice(0,10) ?? '' }
      : initialPreset
      ? {
          institution: initialPreset.institution || '',
          degree: initialPreset.degree || '',
          field: initialPreset.field || '',
          startDate: (initialPreset.startDate as any) || '2019-04-01',
          endDate: (initialPreset.endDate as any) || '2021-03-31',
          current: false,
          published: true,
          grade: initialPreset.grade || '',
          location: initialPreset.location || 'India',
        }
      : { current: false, published: true },
  });
  const current = watch('current');
  const onSubmit = (data: Form) => {
    if (edu) { update.mutate({ id: edu._id, data: data as Partial<Education> }, { onSuccess: onClose }); }
    else { create.mutate(data as Partial<Education>, { onSuccess: onClose }); }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Institution / School Name *" required placeholder="e.g. Kendriya Vidyalaya / Government High School" {...register('institution')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Degree / Class *" required placeholder="10th Class / 12th Class / B.Tech" {...register('degree')} />
        <Input label="Field / Stream *" required placeholder="PCM / Science & Math / Computer Science" {...register('field')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Start Date *" type="date" required {...register('startDate')} />
        {!current && <Input label="End Date" type="date" {...register('endDate')} />}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Grade / Percentage / CGPA" placeholder="e.g. 85% / 9.0 CGPA" {...register('grade')} />
        <Input label="Location" placeholder="e.g. Uttar Pradesh, India" {...register('location')} />
      </div>
      <Textarea label="Description / Highlights" rows={3} placeholder="Highlights, subjects, board (CBSE/UP Board)..." {...register('description')} />
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-text cursor-pointer"><input type="checkbox" {...register('current')} className="w-4 h-4 accent-primary" />Currently studying here</label>
        <label className="flex items-center gap-2 text-sm text-text cursor-pointer"><input type="checkbox" {...register('published')} className="w-4 h-4 accent-primary" />Published</label>
      </div>
      <div className="flex gap-3 justify-end pt-2 border-t border-border">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={create.isPending || update.isPending}>{edu ? 'Update Record' : 'Save Record'}</Button>
      </div>
    </form>
  );
}

export default function EducationAdminPage() {
  const { data, isLoading } = useEducation();
  const deleteEdu = useDeleteEducation();
  const [editEdu, setEditEdu] = useState<Education | null | undefined>(undefined);
  const [preset, setPreset] = useState<Partial<Education> | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const items = data?.data ?? [];

  const handleAddPreset = (type: '10th' | '12th') => {
    if (type === '10th') {
      setPreset({
        degree: '10th Class (Secondary)',
        field: 'General Science & Mathematics',
        institution: 'High School Name',
        startDate: '2018-04-01' as any,
        endDate: '2019-03-31' as any,
        grade: 'Pass / 85%',
        location: 'India',
      });
    } else {
      setPreset({
        degree: '12th Class (Higher Secondary)',
        field: 'PCM (Physics, Chemistry, Mathematics)',
        institution: 'Senior Secondary School / Inter College',
        startDate: '2019-04-01' as any,
        endDate: '2021-03-31' as any,
        grade: 'Pass / 85%',
        location: 'India',
      });
    }
    setEditEdu(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Education Management</h1>
          <p className="text-muted text-xs font-semibold mt-1">Manage 10th Class, 12th Class, and Higher Degrees for your portfolio.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => handleAddPreset('10th')}>
            + 10th Class Preset
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAddPreset('12th')}>
            + 12th Class Preset
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => { setPreset(undefined); setEditEdu(null); }}>
            Add Custom
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No education records yet"
          description="Click '+ 10th Class Preset' or '+ 12th Class Preset' to quickly add your school details."
          action={{ label: 'Add 10th Class', onClick: () => handleAddPreset('10th') }}
        />
      ) : (
        <div className="space-y-3">
          {items.map((edu) => (
            <div key={edu._id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 shadow-sm hover:border-primary/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-text text-base">{edu.degree} - {edu.field}</p>
                  {edu.published ? (
                    <span className="text-[9px] font-black uppercase bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20">Published</span>
                  ) : (
                    <span className="text-[9px] font-black uppercase bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20">Hidden</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-primary mt-0.5">{edu.institution}</p>
                <div className="flex items-center gap-3 text-xs text-muted mt-1 font-medium flex-wrap">
                  <span>{formatDate(edu.startDate, 'year')} — {edu.current ? 'Present' : edu.endDate ? formatDate(edu.endDate, 'year') : ''}</span>
                  {edu.grade && <span>• Grade: {edu.grade}</span>}
                  {edu.location && <span>• {edu.location}</span>}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => { setPreset(undefined); setEditEdu(edu); }} className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-muted" title="Edit"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(edu._id)} className="p-2 hover:bg-error/10 hover:text-error rounded-lg transition-colors text-muted" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={editEdu !== undefined} onClose={() => { setEditEdu(undefined); setPreset(undefined); }} title={editEdu ? 'Edit Education' : preset ? 'Add Class Education' : 'Add Education'} size="md">
        <EduForm edu={editEdu ?? undefined} initialPreset={preset} onClose={() => { setEditEdu(undefined); setPreset(undefined); }} />
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteEdu.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        loading={deleteEdu.isPending} title="Delete Education Record" />
    </div>
  );
}