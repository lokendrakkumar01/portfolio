import { useState } from 'react';
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react';
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
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['programming', 'frontend', 'backend', 'database', 'devops', 'tools', 'other']),
  proficiency: z.coerce.number().min(1).max(5),
  icon: z.string().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;

const catOptions = [
  { value: 'programming', label: 'Programming' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'tools', label: 'Tools' },
  { value: 'other', label: 'Other' },
];

const profOptions = [1, 2, 3, 4, 5].map((v) => ({
  value: String(v),
  label: `${v} - ${getProficiencyLabel(v)}`,
}));

const PRESET_ICONS = [
  { icon: '⚡', label: 'C / General' },
  { icon: '💻', label: 'C++ / Coding' },
  { icon: '☕', label: 'Java' },
  { icon: '🐍', label: 'Python' },
  { icon: '⚛️', label: 'React' },
  { icon: '🟢', label: 'Node.js' },
  { icon: '🚀', label: 'Express' },
  { icon: '🍃', label: 'MongoDB' },
  { icon: '🟨', label: 'JavaScript' },
  { icon: '🔷', label: 'TypeScript' },
  { icon: '🌐', label: 'HTML' },
  { icon: '🎨', label: 'CSS' },
  { icon: '🐙', label: 'Git / GitHub' },
  { icon: '🤖', label: 'ChatGPT / AI' },
  { icon: '🐬', label: 'SQL / MySQL' },
  { icon: '🐘', label: 'PostgreSQL' },
  { icon: '🌊', label: 'Tailwind CSS' },
  { icon: '💜', label: 'Bootstrap' },
  { icon: '🐳', label: 'Docker' },
  { icon: '☁️', label: 'AWS / Cloud' },
  { icon: '🔥', label: 'Firebase' },
  { icon: '🛠️', label: 'Tools' },
  { icon: '📦', label: 'NPM / Packages' },
  { icon: '📱', label: 'Mobile' },
  { icon: '💾', label: 'Storage' },
  { icon: '🛡️', label: 'Security' },
];

function SkillForm({ skill, onClose }: { skill?: Skill; onClose: () => void }) {
  const create = useCreateSkill();
  const update = useUpdateSkill();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: skill
      ? {
          name: skill.name,
          category: skill.category,
          proficiency: skill.proficiency,
          icon: skill.icon ?? '',
          featured: skill.featured ?? false,
          published: skill.published ?? true,
        }
      : {
          name: '',
          category: 'programming',
          proficiency: 3,
          icon: '',
          featured: false,
          published: true,
        },
  });

  const selectedIcon = watch('icon');

  // Auto-fill matching icon on typing skill name if icon is empty
  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const key = val.toLowerCase().trim();
    if (!selectedIcon || selectedIcon === '') {
      if (key === 'c') setValue('icon', '⚡');
      else if (key === 'c++' || key === 'cpp') setValue('icon', '💻');
      else if (key.includes('java') && !key.includes('script')) setValue('icon', '☕');
      else if (key.includes('python')) setValue('icon', '🐍');
      else if (key.includes('react')) setValue('icon', '⚛️');
      else if (key.includes('node')) setValue('icon', '🟢');
      else if (key.includes('express')) setValue('icon', '🚀');
      else if (key.includes('mongo')) setValue('icon', '🍃');
      else if (key.includes('js') || key.includes('javascript')) setValue('icon', '🟨');
      else if (key.includes('ts') || key.includes('typescript')) setValue('icon', '🔷');
      else if (key.includes('html')) setValue('icon', '🌐');
      else if (key.includes('css')) setValue('icon', '🎨');
      else if (key.includes('git')) setValue('icon', '🐙');
      else if (key.includes('chatgpt') || key.includes('ai')) setValue('icon', '🤖');
      else if (key.includes('docker')) setValue('icon', '🐳');
      else if (key.includes('tailwind')) setValue('icon', '🌊');
      else if (key.includes('sql')) setValue('icon', '🐬');
    }
  };

  const onSubmit = (data: Form) => {
    if (skill) {
      update.mutate({ id: skill._id, data: data as Partial<Skill> }, { onSuccess: onClose });
    } else {
      create.mutate(data as Partial<Skill>, { onSuccess: onClose });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Skill Name & Icon Input with Live Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Skill Name *"
          placeholder="e.g. C, Java, React, Node.js"
          error={errors.name?.message}
          {...register('name')}
          onChange={(e) => {
            register('name').onChange(e);
            handleNameInput(e);
          }}
        />

        <div>
          <label className="block text-xs font-semibold text-text mb-1">
            Icon (Emoji, Image URL, or Pick Below)
          </label>
          <div className="flex items-center gap-2">
            {/* Live Icon Preview Box */}
            <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
              {selectedIcon ? (
                selectedIcon.startsWith('http') ? (
                  <img src={selectedIcon} alt="icon" className="w-6 h-6 object-contain" />
                ) : (
                  selectedIcon
                )
              ) : (
                '⚡'
              )}
            </div>
            <Input
              placeholder="e.g. 💻 or image URL"
              className="flex-1"
              {...register('icon')}
            />
          </div>
        </div>
      </div>

      {/* Quick Icon Selector Bar */}
      <div>
        <label className="block text-[11px] font-extrabold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Click to Select Icon:
        </label>
        <div className="flex flex-wrap gap-1.5 p-2.5 bg-surface/60 border border-border/80 rounded-2xl max-h-36 overflow-y-auto scrollbar-none">
          {PRESET_ICONS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setValue('icon', p.icon)}
              title={p.label}
              className={`p-2 rounded-xl text-lg hover:scale-125 active:scale-95 transition-all flex items-center justify-center border ${
                selectedIcon === p.icon
                  ? 'bg-primary/20 border-primary text-primary shadow-sm scale-110'
                  : 'bg-card border-border/60 hover:border-primary/50 text-text'
              }`}
            >
              {p.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Category & Proficiency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Category" options={catOptions} {...register('category')} />
        <Select label="Proficiency" options={profOptions} {...register('proficiency')} />
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-6 pt-1">
        <label className="flex items-center gap-2 text-sm font-semibold text-text cursor-pointer">
          <input type="checkbox" {...register('featured')} className="w-4 h-4 accent-primary rounded" />
          Featured on Home Page
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-text cursor-pointer">
          <input type="checkbox" {...register('published')} className="w-4 h-4 accent-primary rounded" />
          Published
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-3 border-t border-border/60">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={create.isPending || update.isPending}>
          {skill ? 'Update Skill' : 'Add Skill'}
        </Button>
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
  const grouped = skills.reduce((acc: Record<string, Skill[]>, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Skills Management</h1>
          <p className="text-muted text-sm">{skills.length} total skills listed</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setEditSkill(null)}>
          Add Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <EmptyState
          title="No skills yet"
          action={{ label: 'Add First Skill', onClick: () => setEditSkill(null) }}
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat}>
              <h2 className="text-xs font-black text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {cat} ({catSkills.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catSkills.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center gap-3 bg-card border border-border/80 hover:border-primary/50 transition-all rounded-2xl px-4 py-3 shadow-sm group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-surface border border-border/60 flex items-center justify-center text-xl flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      {s.icon ? (
                        s.icon.startsWith('http') ? (
                          <img src={s.icon} alt={s.name} className="w-5 h-5 object-contain" />
                        ) : (
                          s.icon
                        )
                      ) : (
                        '⚡'
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text text-sm truncate">{s.name}</p>
                      <p className="text-xs text-muted font-medium">
                        {getProficiencyLabel(s.proficiency)}
                      </p>
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => setEditSkill(s)}
                        className="p-1.5 hover:bg-surface rounded-lg hover:text-primary transition-colors text-muted"
                        title="Edit Skill"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(s._id)}
                        className="p-1.5 hover:bg-surface rounded-lg hover:text-error transition-colors text-muted"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      <Modal
        open={editSkill !== undefined}
        onClose={() => setEditSkill(undefined)}
        title={editSkill ? 'Edit Skill' : 'Add New Skill'}
        size="md"
      >
        <SkillForm skill={editSkill ?? undefined} onClose={() => setEditSkill(undefined)} />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteSkill.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
        loading={deleteSkill.isPending}
        title="Delete Skill"
      />
    </div>
  );
}