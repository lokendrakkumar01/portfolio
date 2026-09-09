import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useProjectById, useCreateProject, useUpdateProject } from '../../hooks/useProjects';

const schema = z.object({
  title: z.string().min(2, 'Title required'),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  technologies: z.string().min(1, 'Add at least one technology'),
  features: z.string().optional(),
  category: z.enum(['web', 'mobile', 'ai-ml', 'backend', 'open-source', 'academic', 'hackathon', 'other']),
  status: z.enum(['completed', 'in-progress', 'archived']),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  displayOrder: z.number().optional(),
});
type Form = z.infer<typeof schema>;

const catOptions = ['web','mobile','ai-ml','backend','open-source','academic','hackathon','other'].map((v) => ({ value: v, label: v }));
const statusOptions = ['completed','in-progress','archived'].map((v) => ({ value: v, label: v }));

export default function ProjectEditPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { data, isLoading } = useProjectById(id ?? '');
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const project = data?.data;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'web', status: 'in-progress', featured: false, published: true },
  });

  useEffect(() => {
    if (project && isEdit) {
      reset({
        title: project.title,
        shortDescription: project.shortDescription,
        description: project.description,
        technologies: project.technologies.join(', '),
        features: project.features.join('\n'),
        category: project.category,
        status: project.status,
        githubUrl: project.githubUrl ?? '',
        liveUrl: project.liveUrl ?? '',
        featured: project.featured,
        published: project.published,
        displayOrder: project.displayOrder,
      });
    }
  }, [project, isEdit, reset]);

  const onSubmit = (formData: Form) => {
    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      features: formData.features?.split('\n').map((f) => f.trim()).filter(Boolean) ?? [],
      githubUrl: formData.githubUrl || undefined,
      liveUrl: formData.liveUrl || undefined,
    };
    if (isEdit && id) {
      updateProject.mutate({ id, data: payload }, { onSuccess: () => navigate('/admin/projects') });
    } else {
      createProject.mutate(payload, { onSuccess: () => navigate('/admin/projects') });
    }
  };

  if (isEdit && isLoading) return <div className="animate-pulse space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-border rounded-lg" />)}</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-card rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-text" /></button>
        <div>
          <h1 className="text-2xl font-bold text-text">{isEdit ? 'Edit Project' : 'New Project'}</h1>
          <p className="text-muted text-sm">Fill in the project details</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="Project Title" error={errors.title?.message} required {...register('title')} />
        <Input label="Short Description" error={errors.shortDescription?.message} required {...register('shortDescription')} hint="Shown on cards" />
        <Textarea label="Full Description" error={errors.description?.message} required rows={5} {...register('description')} />
        <Input label="Technologies" error={errors.technologies?.message} required placeholder="React, Node.js, MongoDB" {...register('technologies')} hint="Comma separated" />
        <Textarea label="Key Features" error={errors.features?.message} rows={4} placeholder="One feature per line" {...register('features')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Category" options={catOptions} {...register('category')} />
          <Select label="Status" options={statusOptions} {...register('status')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="GitHub URL" type="url" placeholder="https://github.com/..." {...register('githubUrl')} />
          <Input label="Live URL" type="url" placeholder="https://..." {...register('liveUrl')} />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
            <input type="checkbox" {...register('featured')} className="w-4 h-4 accent-primary" />
            Featured project
          </label>
          <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
            <input type="checkbox" {...register('published')} className="w-4 h-4 accent-primary" />
            Published (visible publicly)
          </label>
        </div>
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" loading={createProject.isPending || updateProject.isPending}>
            {isEdit ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
}