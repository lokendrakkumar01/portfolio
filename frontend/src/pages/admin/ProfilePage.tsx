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

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({
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
        <h1 className="text-2xl font-bold text-text">Profile Management</h1>
        <p className="text-muted text-sm">Update your public profile, bio, and face photo</p>
      </div>

      {/* Profile image upload frame */}
      <div className="flex items-center gap-6 bg-card border border-border p-5 rounded-2xl">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 bg-surface shadow-md">
            {previewUrl || profile?.profileImage ? (
              <img src={previewUrl ?? profile?.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-card flex items-center justify-center text-3xl">👤</div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 shadow-lg">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
          </label>
        </div>
        <div>
          <p className="font-bold text-text text-base">{profile?.name ?? 'Your Name'}</p>
          <p className="text-sm text-primary font-medium">{profile?.title ?? 'Your Title'}</p>
          {uploadImage.isPending ? (
            <p className="text-xs text-primary font-semibold mt-1 animate-pulse">Uploading photo to Cloudinary...</p>
          ) : (
            <p className="text-xs text-muted mt-1">Click camera icon to change photo</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name *" error={errors.name?.message} required {...register('name')} />
          <Input label="Username *" error={errors.username?.message} required {...register('username')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Professional Title *" error={errors.title?.message} required placeholder="Full-Stack Developer & Software Engineer" {...register('title')} />
          <Input label="Tagline" error={errors.tagline?.message} placeholder="Crafting digital experiences with passion" {...register('tagline')} />
        </div>
        <Textarea label="Short Bio *" error={errors.shortBio?.message} required rows={3} placeholder="Brief intro shown on Home page..." {...register('shortBio')} />
        <Textarea label="Long Bio" error={errors.longBio?.message} rows={6} placeholder="Full biography shown on About page..." {...register('longBio')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Email *" type="email" error={errors.email?.message} required {...register('email')} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Location" error={errors.location?.message} placeholder="Delhi, India" {...register('location')} />
          <Select label="Availability Status" options={availabilityOptions} {...register('availability')} />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" loading={updateProfile.isPending} size="lg">Save Profile Changes</Button>
        </div>
      </form>
    </div>
  );
}