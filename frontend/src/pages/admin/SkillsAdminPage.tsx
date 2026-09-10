import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { Input, Select } from '../../components/ui/Input';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '../../hooks/useSkills';
import { getProficiencyLabel } from '../../utils/formatters';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Skill } from '../../types';

const schema = z.object({
  name: z.string().min(1),
  category: z.enum(['programming','frontend','backend','database','devops','tools','other']),
  proficiency: z.coerce.number().min(1).max(5),
  icon: z.string().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;

const catOptions = ['programming','frontend','backend','database','devops','tools','other'].map((v) => ({ value: v, label: v }));
const profOptions = [1,2,3,4,5].map((v) => ({ value: String(v), label: `${v} - ${getProficiencyLabel(v)}` }));

function SkillForm({ skill, onClose }: { skill?: Skill; onClose: () => void }) {
  const create = useCreateSkill();
  const update = useUpdateSkill();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: skill ? { name: skill.name, category: skill.category, proficiency: skill.proficiency, icon: skill.icon ?? '', featured: skill.featured, published: skill.published } : { category: 'programming', proficiency: 3, featured: false, published: true },
  });
  const onSubmit = (data: Form) => {
    if (skill) {
      update.mutate({ id: skill._id, data: data as Partial<Skill> }, { onSuccess: onClose });
    } else {
      create.mutate(data as Partial<Skill>, { onSuccess: onClose });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Skill Name" required error={errors.name?.message} {...register('name')} />
        <Input label="Icon (emoji or URL)" {...register('icon')} hint="e.g. ⚛️ or icon URL" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Category" options={catOptions} {...register('category')} />
        <Select label="Proficiency" options={profOptions} {...register('proficiency')} />
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-text cursor-pointer"><input type="checkbox" {...register('featured')} className="w-4 h-4 accent-primary" />Featured</label>
        <label className="flex items-center gap-2 text-sm text-text cursor-pointer"><input type="checkbox" {...register('published')} className="w-4 h-4 accent-primary" />Published</label>
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={create.isPending || update.isPending}>{skill ? 'Update' : 'Add'} Skill</Button>
      </div>
    </form>
  );
}

export default function SkillsAdminPage() {
  const { data, isLoading } = useSkills();
  const deleteSkill = useDeleteSkill();
  const [editSkill, setEditSkill] = useState<Skill | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const skills = data?.data ?? [];
  const grouped = skills.reduce((acc: Record<string, Skill[]>, s) => { if (!acc[s.category]) acc[s.category] = []; acc[s.category].push(s); return acc; }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-text">Skills</h1><p className="text-muted text-sm">{skills.length} total</p></div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setEditSkill(null)}>Add Skill</Button>
      </div>
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : skills.length === 0 ? (
        <EmptyState title="No skills yet" action={{ label: 'Add First Skill', onClick: () => setEditSkill(null) }} />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat}>
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3 capitalize">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catSkills.map((s) => (
                  <div key={s._id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                    {s.icon && <span className="text-xl">{s.icon}</span>}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text text-sm">{s.name}</p>
                      <p className="text-xs text-muted">{getProficiencyLabel(s.proficiency)}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => setEditSkill(s)} className="p-1 hover:text-primary transition-colors text-muted"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(s._id)} className="p-1 hover:text-error transition-colors text-muted"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={editSkill !== undefined} onClose={() => setEditSkill(undefined)} title={editSkill ? 'Edit Skill' : 'Add Skill'} size="sm">
        <SkillForm skill={editSkill ?? undefined} onClose={() => setEditSkill(undefined)} />
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteSkill.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        loading={deleteSkill.isPending} title="Delete Skill" />
    </div>
  );
}