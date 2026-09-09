import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera } from 'lucide-react';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useProfile, useUpdateProfile, useUploadProfileImage } from '../../hooks/useProfile';
import type { Profile } from '../../types';

const schema = z.object({
  name: z.string().min(2),
  username: z.string().min(2),
  title: z.string().min(2),
  tagline: z.string().optional(),
  shortBio: z.string().min(10),
  longBio: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  availability: z.enum(['available', 'busy', 'not-looking']),
});
type Form = z.infer<typeof schema>;

const availabilityOptions = [
  { value: 'available', label: 'Available for Work' },
  { value: 'busy', label: 'Busy (Not Available)' },
  { value: 'not-looking', label: 'Not Looking' },
];

export default function ProfilePage() {
  const { data: profileData, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadImage = useUploadProfileImage();
  const profile = profileData?.data;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { availability: 'available' },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? '',
        username: profile.username ?? '',
        title: profile.title ?? '',
        tagline: profile.tagline ?? '',
        shortBio: profile.shortBio ?? '',
        longBio: profile.longBio ?? '',
        location: profile.location ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        availability: (profile.availability as Form['availability']) ?? 'available',
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: Form) => updateProfile.mutate(data as Partial<Profile>);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    uploadImage.mutate(file);
  };

  if (isLoading) return <div className="animate-pulse space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-border rounded-lg" />)}</div>;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Profile</h1>
        <p className="text-muted text-sm">Your public profile information</p>
      </div>

      {/* Profile image */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border">
            {previewUrl || profile?.profileImage ? (
              <img src={previewUrl ?? profile?.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-card flex items-center justify-center text-3xl">👤</div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-90">
            <Camera className="w-3.5 h-3.5" />
            <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
          </label>
        </div>
        <div>
          <p className="font-semibold text-text">{profile?.name ?? 'Your Name'}</p>
          <p className="text-sm text-muted">{profile?.title ?? 'Your Title'}</p>
          {uploadImage.isPending && <p className="text-xs text-primary mt-1">Uploading image...</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" error={errors.name?.message} required {...register('name')} />
          <Input label="Username" error={errors.username?.message} required {...register('username')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Professional Title" error={errors.title?.message} required {...register('title')} />
          <Input label="Tagline" error={errors.tagline?.message} {...register('tagline')} />
        </div>
        <Textarea label="Short Bio" error={errors.shortBio?.message} required rows={3} {...register('shortBio')} />
        <Textarea label="Long Bio" error={errors.longBio?.message} rows={6} {...register('longBio')} hint="Full bio shown on About page" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Email" type="email" error={errors.email?.message} required {...register('email')} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Location" error={errors.location?.message} {...register('location')} />
          <Select label="Availability Status" options={availabilityOptions} {...register('availability')} />
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={updateProfile.isPending} disabled={!isDirty}>Save Profile</Button>
        </div>
      </form>
    </div>
  );
}