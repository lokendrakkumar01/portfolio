import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { socialLinksApi } from '../api/socialLinks.api';
import { getErrorMessage } from '../api/client';
import type { SocialLink } from '../types';

export const SOCIAL_KEY = 'social-links';

export const useSocialLinks = () =>
  useQuery({ queryKey: [SOCIAL_KEY], queryFn: socialLinksApi.getAll, staleTime: 10 * 60 * 1000 });

export const useCreateSocialLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SocialLink>) => socialLinksApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [SOCIAL_KEY] }); toast.success('Social link added'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateSocialLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SocialLink> }) => socialLinksApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [SOCIAL_KEY] }); toast.success('Social link updated'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteSocialLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: socialLinksApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [SOCIAL_KEY] }); toast.success('Social link deleted'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
