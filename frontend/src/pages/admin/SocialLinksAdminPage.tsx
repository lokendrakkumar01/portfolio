import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { Input } from '../../components/ui/Input';
import { useSocialLinks, useCreateSocialLink, useUpdateSocialLink, useDeleteSocialLink } from '../../hooks/useSocialLinks';
import { getSocialIcon } from '../../utils/formatters';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SocialLink } from '../../types';

const schema = z.object({
  platform: z.string().min(2),
  url: z.string().url(),
  username: z.string().optional(),
  displayOrder: z.coerce.number().optional(),
  active: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;

const PLATFORMS = ['GitHub','LinkedIn','Twitter','Instagram','YouTube','Facebook','Portfolio','Email'];

function SocialForm({ link, onClose }: { link?: SocialLink; onClose: () => void }) {
  const create = useCreateSocialLink();
  const update = useUpdateSocialLink();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    defaultValues: link ? { platform: link.platform, url: link.url, username: link.username ?? '', displayOrder: link.displayOrder, active: link.active } : { active: true },
  });
  const onSubmit = (data: Form) => {
    if (link) { update.mutate({ id: link._id, data: data as Partial<SocialLink> }, { onSuccess: onClose }); }
    else { create.mutate(data as Partial<SocialLink>, { onSuccess: onClose }); }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-1">Platform</label>
        <select {...register('platform')} className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary">
          {PLATFORMS.map((p) => <option key={p} value={p.toLowerCase()}>{p}</option>)}
        </select>
      </div>
      <Input label="URL" type="url" required error={errors.url?.message} {...register('url')} />
      <Input label="Username / Handle" {...register('username')} hint="Optional display username" />
      <label className="flex items-center gap-2 text-sm text-text cursor-pointer"><input type="checkbox" {...register('active')} className="w-4 h-4 accent-primary" />Active (show on portfolio)</label>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={create.isPending || update.isPending}>{link ? 'Update' : 'Add'}</Button>
      </div>
    </form>
  );
}

export default function SocialLinksAdminPage() {
  const { data, isLoading } = useSocialLinks();
  const deleteLink = useDeleteSocialLink();
  const [editLink, setEditLink] = useState<SocialLink | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const links = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Social Links</h1>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setEditLink(null)}>Add Link</Button>
      </div>
      {isLoading ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div> : links.length === 0 ? (
        <EmptyState title="No social links yet" action={{ label: 'Add First Link', onClick: () => setEditLink(null) }} />
      ) : (
        <div className="space-y-3">
          {links.map((l) => {
            const Icon = getSocialIcon(l.platform);
            return (
              <div key={l._id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                <Icon className="w-5 h-5 text-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text text-sm capitalize">{l.platform}</p>
                  <a href={l.url} target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-primary truncate block">{l.url}</a>
                </div>
                {!l.active && <span className="text-xs text-muted bg-surface border border-border px-2 py-0.5 rounded-full">hidden</span>}
                <div className="flex gap-1">
                  <button onClick={() => setEditLink(l)} className="p-1.5 hover:text-primary transition-colors text-muted"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(l._id)} className="p-1.5 hover:text-error transition-colors text-muted"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal open={editLink !== undefined} onClose={() => setEditLink(undefined)} title={editLink ? 'Edit Link' : 'Add Social Link'} size="sm">
        <SocialForm link={editLink ?? undefined} onClose={() => setEditLink(undefined)} />
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteLink.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        loading={deleteLink.isPending} title="Delete Social Link" />
    </div>
  );
}