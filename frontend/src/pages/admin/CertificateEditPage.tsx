import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCertificate, useCreateCertificate, useUpdateCertificate } from '../../hooks/useCertificates';

const schema = z.object({
  title: z.string().min(2),
  issuer: z.string().min(2),
  issueDate: z.string().min(1),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  skills: z.string().optional(),
  category: z.enum(['programming','web-development','cloud','database','ai-ml','cybersecurity','other']),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;

const catOptions = ['programming','web-development','cloud','database','ai-ml','cybersecurity','other'].map((v) => ({ value: v, label: v }));

export default function CertificateEditPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { data } = useCertificate(id ?? '');
  const cert = data?.data;
  const create = useCreateCertificate();
  const update = useUpdateCertificate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'programming', featured: false, published: true },
  });

  useEffect(() => {
    if (cert && isEdit) {
      reset({
        title: cert.title,
        issuer: cert.issuer,
        issueDate: cert.issueDate.slice(0, 10),
        expiryDate: cert.expiryDate?.slice(0, 10) ?? '',
        credentialId: cert.credentialId ?? '',
        credentialUrl: cert.credentialUrl ?? '',
        skills: cert.skills.join(', '),
        category: cert.category,
        featured: cert.featured,
        published: cert.published,
      });
    }
  }, [cert, isEdit, reset]);

  const onSubmit = (formData: Form) => {
    const payload = { ...formData, skills: formData.skills?.split(',').map((s) => s.trim()).filter(Boolean) ?? [], credentialUrl: formData.credentialUrl || undefined };
    if (isEdit && id) {
      update.mutate({ id, data: payload }, { onSuccess: () => navigate('/admin/certificates') });
    } else {
      create.mutate(payload, { onSuccess: () => navigate('/admin/certificates') });
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-card rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-text" /></button>
        <h1 className="text-2xl font-bold text-text">{isEdit ? 'Edit Certificate' : 'Add Certificate'}</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Certificate Title" error={errors.title?.message} required {...register('title')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Issuer / Organization" error={errors.issuer?.message} required {...register('issuer')} />
          <Select label="Category" options={catOptions} {...register('category')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Issue Date" type="date" error={errors.issueDate?.message} required {...register('issueDate')} />
          <Input label="Expiry Date" type="date" {...register('expiryDate')} hint="Leave empty if no expiry" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Credential ID" {...register('credentialId')} />
          <Input label="Credential URL" type="url" {...register('credentialUrl')} />
        </div>
        <Input label="Skills" placeholder="JavaScript, React, HTML" {...register('skills')} hint="Comma separated" />
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