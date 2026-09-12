import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  useProjectById,
  useCreateProject,
  useUpdateProject,
  useUploadProjectCover,
  useAddProjectScreenshot,
  useDeleteProjectScreenshot,
} from '../../hooks/useProjects';
import toast from 'react-hot-toast';

const urlOrEmpty = z.string()
  .transform(v => v?.trim() ?? '')
  .refine(v => v === '' || /^https?:\/\/.+/.test(v), { message: 'Must be a valid URL starting with http:// or https://' })
  .optional()
  .or(z.literal(''));

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title too long'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(500, 'Short description too long (max 500 chars)'),
  description: z.string().min(20, 'Full description must be at least 20 characters').max(10000, 'Description too long'),
  technologies: z.string().min(1, 'Add at least one technology (comma separated)'),
  features: z.string().optional(),
  category: z.enum(['web', 'mobile', 'ai-ml', 'backend', 'open-source', 'academic', 'hackathon', 'other']),
  status: z.enum(['completed', 'in-progress', 'archived']),
  complexity: z.enum(['advanced', 'medium', 'basic']).optional(),
  githubUrl: urlOrEmpty,
  liveUrl: urlOrEmpty,
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  displayOrder: z.number().optional(),
});
type Form = z.infer<typeof schema>;

const catOptions = ['web', 'mobile', 'ai-ml', 'backend', 'open-source', 'academic', 'hackathon', 'other'].map((v) => ({
  value: v,
  label: v.toUpperCase(),
}));
const statusOptions = ['completed', 'in-progress', 'archived'].map((v) => ({
  value: v,
  label: v.replace('-', ' ').toUpperCase(),
}));
const complexityOptions = [
  { value: 'advanced', label: '🚀 Advanced / Large Project' },
  { value: 'medium', label: '⚡ Medium Project' },
  { value: 'basic', label: '📝 Basic / Small Project' },
];

export default function ProjectEditPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { data, isLoading } = useProjectById(id ?? '');
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const uploadCover = useUploadProjectCover();
  const addScreenshot = useAddProjectScreenshot();
  const deleteScreenshot = useDeleteProjectScreenshot();
  
  const project = data?.data;
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const screenshotFileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'web', status: 'in-progress', complexity: 'medium', featured: false, published: true },
  });

  const onInvalid = (errs: typeof errors) => {
    const messages = Object.values(errs).map(e => e?.message).filter(Boolean);
    if (messages.length > 0) {
      toast.error('Please fix the form errors: ' + messages[0]);
    }
  };

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
        complexity: (project.complexity ?? 'medium') as 'advanced' | 'medium' | 'basic',
        githubUrl: project.githubUrl ?? '',
        liveUrl: project.liveUrl ?? '',
        featured: project.featured,
        published: project.published,
        displayOrder: project.displayOrder,
      });
      if (project.coverImage) {
        setCoverPreview(project.coverImage);
      }
    }
  }, [project, isEdit, reset]);

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setSelectedFile(file);

    if (isEdit && id) {
      uploadCover.mutate({ id, file });
    }
  };

  const handleAddScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    addScreenshot.mutate({ id, file });
  };

  const onSubmit = (formData: Form) => {
    const githubUrl = typeof formData.githubUrl === 'string' ? formData.githubUrl.trim() : '';
    const liveUrl = typeof formData.liveUrl === 'string' ? formData.liveUrl.trim() : '';

    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      features: formData.features?.split('\n').map((f) => f.trim()).filter(Boolean) ?? [],
      githubUrl: githubUrl || undefined,
      liveUrl: liveUrl || undefined,
    };

    if (isEdit && id) {
      updateProject.mutate({ id, data: payload }, { onSuccess: () => navigate('/admin/projects') });
    } else {
      createProject.mutate(payload, {
        onSuccess: (res) => {
          const newId = res.data._id;
          if (selectedFile && newId) {
            uploadCover.mutate(
              { id: newId, file: selectedFile },
              { onSuccess: () => navigate('/admin/projects') }
            );
          } else {
            navigate('/admin/projects');
          }
        },
      });
    }
  };

  if (isEdit && isLoading) return <div className="animate-pulse space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-border rounded-lg" />)}</div>;

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-card rounded-xl border border-border transition-colors">
          <ArrowLeft className="w-5 h-5 text-text" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-text">{isEdit ? 'Edit Project' : 'New Project'}</h1>
          <p className="text-muted text-sm">Add project details, cover photo, and screenshots</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        {/* Cover Image Upload Section */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-text uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" /> Project Cover Photo
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-64 h-40 rounded-2xl overflow-hidden bg-surface border-2 border-dashed border-border flex items-center justify-center relative group">
              {coverPreview ? (
                <img src={coverPreview} alt="Project Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
                  <span className="text-xs text-muted font-medium">No cover image uploaded</span>
                </div>
              )}
              {uploadCover.isPending && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold animate-pulse">
                  Uploading to Cloudinary...
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1 text-center sm:text-left">
              <p className="text-sm font-semibold text-text">Upload High Quality Banner</p>
              <p className="text-xs text-muted">Supports JPG, PNG, WEBP. Displays as the primary card image on your portfolio.</p>
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Upload className="w-4 h-4" />}
                  onClick={() => coverFileRef.current?.click()}
                  loading={uploadCover.isPending}
                >
                  Choose Image File
                </Button>
                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleCoverSelect}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Details Section */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <Input label="Project Title *" error={errors.title?.message} required placeholder="e.g. E-Commerce Platform" {...register('title')} />
          <Input label="Short Description *" error={errors.shortDescription?.message} required placeholder="Brief tagline shown on project cards..." {...register('shortDescription')} />
          <Textarea label="Full Description *" error={errors.description?.message} required rows={5} placeholder="Detailed explanation of the project architecture and features..." {...register('description')} />
          <Input label="Technologies Used *" error={errors.technologies?.message} required placeholder="React, Node.js, MongoDB, Tailwind CSS" {...register('technologies')} hint="Comma separated values" />
          <Textarea label="Key Features" error={errors.features?.message} rows={4} placeholder="One key feature per line..." {...register('features')} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Category *" options={catOptions} {...register('category')} />
            <Select label="Status *" options={statusOptions} {...register('status')} />
            <Select label="Project Level *" options={complexityOptions} {...register('complexity')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="GitHub Source URL" placeholder="https://github.com/username/repo" error={errors.githubUrl?.message} {...register('githubUrl')} hint="Optional – must start with https://" />
            <Input label="Live Demo URL" placeholder="https://myproject.com" error={errors.liveUrl?.message} {...register('liveUrl')} hint="Optional – must start with https://" />
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-border/50">
            <label className="flex items-center gap-2 text-sm text-text font-medium cursor-pointer">
              <input type="checkbox" {...register('featured')} className="w-4 h-4 rounded accent-primary" />
              Featured Project (shows on Home page)
            </label>
            <label className="flex items-center gap-2 text-sm text-text font-medium cursor-pointer">
              <input type="checkbox" {...register('published')} className="w-4 h-4 rounded accent-primary" />
              Published (visible publicly)
            </label>
          </div>
        </div>

        {/* Screenshots Section (Available in Edit Mode) */}
        {isEdit && id && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-text uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" /> Additional Screenshots
                </h3>
                <p className="text-xs text-muted mt-0.5">Showcase extra UI views on project detail page</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => screenshotFileRef.current?.click()}
                loading={addScreenshot.isPending}
              >
                Add Screenshot
              </Button>
              <input ref={screenshotFileRef} type="file" accept="image/*" className="sr-only" onChange={handleAddScreenshot} />
            </div>

            {project?.screenshots && project.screenshots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {project.screenshots.map((s) => (
                  <div key={s._id} className="relative group aspect-video rounded-xl overflow-hidden border border-border bg-surface">
                    <img src={s.url} alt="Screenshot" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => s._id && deleteScreenshot.mutate({ projectId: id, screenshotId: s._id })}
                      className="absolute top-2 right-2 p-1.5 bg-error text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted italic">No extra screenshots added yet.</p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" size="lg" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" size="lg" loading={createProject.isPending || updateProject.isPending || uploadCover.isPending}>
            {isEdit ? 'Save Project Changes' : 'Create & Upload Cover'}
          </Button>
        </div>
      </form>
    </div>
  );
}