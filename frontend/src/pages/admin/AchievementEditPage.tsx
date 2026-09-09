import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAchievements, useCreateAchievement, useUpdateAchievement } from '../../hooks/useAchievements';
import { achievementsApi } from '../../api/achievements.api';
import { useQuery } from '@tanstack/react-query';
import { ACH_KEY } from '../../hooks/useAchievements';

const schema = z.object({
  title: z.string().min(2),
  organization: z.string().min(2),
  event: z.string().optional(),
  date: z.string().min(1),
  category: z.enum(['hackathon','competition','award','leadership','academic','technical','event','other']),
  description: z.string().optional(),
  rank: z.string().optional(),
  verificationUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;

const catOptions = ['hackathon','competition','award','leadership','academic','technical','event','other'].map((v) => ({ value: v, label: v }));

export default function AchievementEditPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: [ACH_KEY, id],
    queryFn: () => achievementsApi.getById(id!),
    enabled: !!id,
  });
  const achievement = data?.data;
  const create = useCreateAchievement();
  const update = useUpdateAchievement();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'hackathon', featured: false, published: true },
  });

  useEffect(() => {
    if (achievement && isEdit) {
      reset({
        title: achievement.title,
        organization: achievement.organization,
        event: achievement.event ?? '',
        date: achievement.date.slice(0, 10),
        category: achievement.category,
        description: achievement.description ?? '',
        rank: achievement.rank ?? '',
        verificationUrl: achievement.verificationUrl ?? '',
        featured: achievement.featured,
        published: achievement.published,
      });
    }
  }, [achievement, isEdit, reset]);

  const onSubmit = (formData: Form) => {
    const payload = { ...formData, verificationUrl: formData.verificationUrl || undefined };
    if (isEdit && id) {
      update.mutate({ id, data: payload }, { onSuccess: () => navigate('/admin/achievements') });
    } else {
      create.mutate(payload, { onSuccess: () => navigate('/admin/achievements') });
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-card rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-text" /></button>
        <h1 className="text-2xl font-bold text-text">{isEdit ? 'Edit Achievement' : 'Add Achievement'}</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Achievement Title" error={errors.title?.message} required {...register('title')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Organization / Organizer" error={errors.organization?.message} required {...register('organization')} />
          <Input label="Event Name" {...register('event')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Date" type="date" error={errors.date?.message} required {...register('date')} />
          <Select label="Category" options={catOptions} {...register('category')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Rank / Position" placeholder="1st, Top 10, Finalist" {...register('rank')} />
          <Input label="Verification URL" type="url" {...register('verificationUrl')} />
        </div>
        <Textarea label="Description" rows={3} {...register('description')} />
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-text cursor-pointer"><input type="checkbox" {...register('featured')} className="w-4 h-4 accent-primary" />Featured</label>
          <label className="flex items-center gap-2 text-sm text-text cursor-pointer"><input type="checkbox" {...register('published')} className="w-4 h-4 accent-primary" />Published</label>
        </div>
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" loading={create.isPending || update.isPending}>{isEdit ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </div>
  );
}