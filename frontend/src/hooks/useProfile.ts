import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { profileApi } from '../api/profile.api';
import { getErrorMessage } from '../api/client';
import { INITIAL_PROFILE, getCached, setCached } from '../data/initialPortfolioData';

export const PROFILE_KEY = ['profile'] as const;

export const useProfile = () =>
  useQuery({
    queryKey: PROFILE_KEY,
    queryFn: async () => {
      const res = await profileApi.get();
      if (res?.data) setCached('portfolio_profile', res.data);
      return res;
    },
    initialData: () => ({
      success: true,
      message: 'Cached',
      data: getCached('portfolio_profile', INITIAL_PROFILE),
    }),
    initialDataUpdatedAt: 0,
    staleTime: 0,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileApi.update,
    onSuccess: (res) => {
      if (res?.data) setCached('portfolio_profile', res.data);
      qc.setQueryData(PROFILE_KEY, res);
      qc.invalidateQueries({ queryKey: PROFILE_KEY });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Profile updated successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUploadProfileImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileApi.uploadImage,
    onSuccess: (res) => {
      if (res?.data) setCached('portfolio_profile', res.data);
      qc.setQueryData(PROFILE_KEY, res);
      qc.invalidateQueries({ queryKey: PROFILE_KEY });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Profile image uploaded successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
