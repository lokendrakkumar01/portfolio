import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useSettings, useUpdateSettings } from '../../hooks/useSettings';
import type { SiteSettings } from '../../types';

const schema = z.object({
  siteName: z.string().min(1),
  siteTitle: z.string().min(1),
  siteDescription: z.string().optional(),
  primaryEmail: z.string().email(),
  contactEnabled: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;

export default function SettingsAdminPage() {
  const { data, isLoading } = useSettings();
  const update = useUpdateSettings();
  const settings = data?.data;

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<Form>({
    defaultValues: { contactEnabled: true, maintenanceMode: false },
  });

  useEffect(() => {
    if (settings) {
      reset({
        siteName: settings.siteName,
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription ?? '',
        primaryEmail: settings.primaryEmail,
        contactEnabled: settings.contactEnabled,
        maintenanceMode: settings.maintenanceMode,
      });
    }
  }, [settings, reset]);

  const onSubmit = (data: Form) => update.mutate(data as Partial<SiteSettings>);

  if (isLoading) return <div className="animate-pulse space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-border rounded-lg" />)}</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Site Settings</h1>
        <p className="text-muted text-sm">Configure your portfolio site</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-text text-sm uppercase tracking-wide">General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Site Name" required hint="Short name, used in navbar" {...register('siteName')} />
            <Input label="Site Title" required hint="Full title for SEO" {...register('siteTitle')} />
          </div>
          <Textarea label="Site Description" rows={3} hint="Used for meta description / SEO" {...register('siteDescription')} />
          <Input label="Primary Contact Email" type="email" required {...register('primaryEmail')} />
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-text text-sm uppercase tracking-wide">Features</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-surface border border-border rounded-lg cursor-pointer">
              <div>
                <p className="text-sm font-medium text-text">Contact Form</p>
                <p className="text-xs text-muted">Allow visitors to send messages</p>
              </div>
              <input type="checkbox" {...register('contactEnabled')} className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between p-3 bg-surface border border-border rounded-lg cursor-pointer">
              <div>
                <p className="text-sm font-medium text-text">Maintenance Mode</p>
                <p className="text-xs text-muted">Show maintenance page to visitors</p>
              </div>
              <input type="checkbox" {...register('maintenanceMode')} className="w-5 h-5 accent-primary" />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={update.isPending} disabled={!isDirty}>Save Settings</Button>
        </div>
      </form>
    </div>
  );
}