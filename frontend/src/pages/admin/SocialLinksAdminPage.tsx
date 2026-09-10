import { useState } from 'react';
import { Plus, Pencil, Trash2, Code2, Share2 } from 'lucide-react';
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
  platform: z.string().min(2, 'Platform name required'),
  url: z.string().url('Enter a valid URL (e.g. https://leetcode.com/u/username)'),
  username: z.string().optional(),
  displayOrder: z.coerce.number().optional(),
  active: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;

const SOCIAL_PLATFORMS = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'email', label: 'Email' },
  { value: 'portfolio', label: 'Website / Portfolio' },
];

const DSA_PLATFORMS = [
  { value: 'leetcode', label: 'LeetCode (DSA Practice)', placeholder: 'https://leetcode.com/u/Lokenndakumar/' },
  { value: 'geeksforgeeks', label: 'GeeksforGeeks', placeholder: 'https://auth.geeksforgeeks.org/user/username' },
  { value: 'codechef', label: 'CodeChef', placeholder: 'https://www.codechef.com/users/username' },
  { value: 'hackerrank', label: 'HackerRank', placeholder: 'https://www.hackerrank.com/username' },
  { value: 'codeforces', label: 'Codeforces', placeholder: 'https://codeforces.com/profile/username' },
  { value: 'hackerearth', label: 'HackerEarth', placeholder: 'https://www.hackerearth.com/@username' },
  { value: 'kaggle', label: 'Kaggle', placeholder: 'https://www.kaggle.com/username' },
  { value: 'interviewbit', label: 'InterviewBit', placeholder: 'https://www.interviewbit.com/profile/username' },
];

function SocialForm({ link, onClose }: { link?: SocialLink; onClose: () => void }) {
  const create = useCreateSocialLink();
  const update = useUpdateSocialLink();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: link
      ? { platform: link.platform, url: link.url, username: link.username ?? '', displayOrder: link.displayOrder, active: link.active }
      : { platform: 'leetcode', url: 'https://leetcode.com/u/Lokenndakumar/', active: true },
  });

  const selectedPlatform = watch('platform');
  const matchedDsa = DSA_PLATFORMS.find((p) => p.value === selectedPlatform);

  const onSubmit = (data: Form) => {
    if (link && link._id) {
      update.mutate({ id: link._id, data: data as Partial<SocialLink> }, { onSuccess: onClose });
    } else {
      create.mutate(data as Partial<SocialLink>, { onSuccess: onClose });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-text mb-1">Platform Category</label>
        <select
          {...register('platform')}
          className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <optgroup label="🔥 Coding & DSA Practice Platforms">
            {DSA_PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="🌐 Social Networks & Profiles">
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <Input
        label="Profile / Platform URL *"
        type="url"
        required
        placeholder={matchedDsa?.placeholder || 'https://...'}
        error={errors.url?.message}
        {...register('url')}
      />

      <Input
        label="Username / Handle (Optional)"
        placeholder="e.g. Lokenndakumar"
        {...register('username')}
        hint="Displayed on cards & badges"
      />

      <label className="flex items-center gap-2 text-sm text-text font-medium cursor-pointer pt-1">
        <input type="checkbox" {...register('active')} className="w-4 h-4 rounded accent-primary" />
        Active (show on portfolio)
      </label>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={create.isPending || update.isPending}>
          {link && link._id ? 'Save Changes' : 'Add Platform Link'}
        </Button>
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

  const codingLinks = links.filter((l) =>
    ['leetcode', 'geeksforgeeks', 'gfg', 'codechef', 'hackerrank', 'codeforces', 'hackerearth', 'kaggle', 'interviewbit'].includes(
      l.platform.toLowerCase()
    )
  );

  const socialNetworkLinks = links.filter(
    (l) =>
      !['leetcode', 'geeksforgeeks', 'gfg', 'codechef', 'hackerrank', 'codeforces', 'hackerearth', 'kaggle', 'interviewbit'].includes(
        l.platform.toLowerCase()
      )
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Social & Coding Profiles</h1>
          <p className="text-muted text-sm">Manage LeetCode, GeeksforGeeks, CodeChef, GitHub, LinkedIn, and social profiles</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setEditLink(null)}>
          Add Profile Link
        </Button>
      </div>

      {/* Quick Add Preset Bar */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
        <h3 className="text-xs font-extrabold text-text uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" /> Quick Add DSA & Coding Platforms
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditLink({ platform: 'leetcode', url: 'https://leetcode.com/u/Lokenndakumar/', active: true } as any)}
          >
            + Add LeetCode
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditLink({ platform: 'geeksforgeeks', url: 'https://auth.geeksforgeeks.org/user/Lokenndakumar', active: true } as any)}
          >
            + Add GeeksforGeeks
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditLink({ platform: 'codechef', url: 'https://www.codechef.com/users/Lokenndakumar', active: true } as any)}
          >
            + Add CodeChef
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditLink({ platform: 'hackerrank', url: 'https://www.hackerrank.com/Lokenndakumar', active: true } as any)}
          >
            + Add HackerRank
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
      ) : links.length === 0 ? (
        <EmptyState title="No profile links added yet" action={{ label: 'Add First Link', onClick: () => setEditLink(null) }} />
      ) : (
        <div className="space-y-8">
          {/* Coding & DSA Section */}
          {codingLinks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Coding & DSA Practice Profiles ({codingLinks.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {codingLinks.map((l) => {
                  const Icon = getSocialIcon(l.platform);
                  return (
                    <div key={l._id} className="flex items-center gap-3 bg-card border border-border/80 rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-all">
                      <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-text text-sm capitalize">{l.platform}</p>
                          {l.username && <span className="text-[10px] font-bold bg-surface border border-border px-2 py-0.5 rounded-full text-muted">{l.username}</span>}
                        </div>
                        <a href={l.url} target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-primary truncate block font-medium mt-0.5">
                          {l.url}
                        </a>
                      </div>
                      {!l.active && <span className="text-xs text-muted bg-surface border border-border px-2 py-0.5 rounded-full">hidden</span>}
                      <div className="flex gap-1">
                        <button onClick={() => setEditLink(l)} className="p-1.5 hover:text-primary transition-colors text-muted rounded-lg">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(l._id)} className="p-1.5 hover:text-error transition-colors text-muted rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Social Networks Section */}
          {socialNetworkLinks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-extrabold text-text uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" /> Social Networks ({socialNetworkLinks.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {socialNetworkLinks.map((l) => {
                  const Icon = getSocialIcon(l.platform);
                  return (
                    <div key={l._id} className="flex items-center gap-3 bg-card border border-border/80 rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-all">
                      <div className="w-10 h-10 bg-surface border border-border/60 rounded-xl flex items-center justify-center text-muted flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-text text-sm capitalize">{l.platform}</p>
                        <a href={l.url} target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-primary truncate block font-medium mt-0.5">
                          {l.url}
                        </a>
                      </div>
                      {!l.active && <span className="text-xs text-muted bg-surface border border-border px-2 py-0.5 rounded-full">hidden</span>}
                      <div className="flex gap-1">
                        <button onClick={() => setEditLink(l)} className="p-1.5 hover:text-primary transition-colors text-muted rounded-lg">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(l._id)} className="p-1.5 hover:text-error transition-colors text-muted rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal open={editLink !== undefined} onClose={() => setEditLink(undefined)} title={editLink && editLink._id ? 'Edit Platform Profile' : 'Add Platform Profile'} size="sm">
        <SocialForm link={editLink ?? undefined} onClose={() => setEditLink(undefined)} />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteLink.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
        loading={deleteLink.isPending}
        title="Delete Link"
        description="Are you sure you want to remove this profile link?"
      />
    </div>
  );
}