import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { socialLinksApi } from '../api/socialLinks.api';
import { getErrorMessage } from '../api/client';
import type { SocialLink } from '../types';
import { INITIAL_SOCIAL_LINKS, getCached, setCached, removeCached } from '../data/initialPortfolioData';

export const SOCIAL_KEY = 'social-links';

export const useSocialLinks = () =>
  useQuery({
    queryKey: [SOCIAL_KEY],
    queryFn: async () => {
      const res = await socialLinksApi.getAll();
      if (res?.data) setCached('portfolio_social_links', res.data);
      return res;
    },
    initialData: () => ({
      success: true,
      message: 'Cached',
      data: getCached('portfolio_social_links', INITIAL_SOCIAL_LINKS),
    }),
    initialDataUpdatedAt: 0,
    staleTime: 30 * 1000,
  });

export const useCreateSocialLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SocialLink>) => socialLinksApi.create(data),
    onSuccess: () => {
      removeCached('portfolio_social_links');
      qc.invalidateQueries({ queryKey: [SOCIAL_KEY] });
      toast.success('Social link added');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateSocialLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SocialLink> }) => socialLinksApi.update(id, data),
    onSuccess: () => {
      removeCached('portfolio_social_links');
      qc.invalidateQueries({ queryKey: [SOCIAL_KEY] });
      toast.success('Social link updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteSocialLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: socialLinksApi.delete,
    onSuccess: () => {
      removeCached('portfolio_social_links');
      qc.invalidateQueries({ queryKey: [SOCIAL_KEY] });
      toast.success('Social link deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
