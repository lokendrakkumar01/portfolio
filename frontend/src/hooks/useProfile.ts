import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { profileApi } from '../api/profile.api';
import { getErrorMessage } from '../api/client';

export const PROFILE_KEY = ['profile'] as const;

export const useProfile = () =>
  useQuery({
    queryKey: PROFILE_KEY,
    queryFn: profileApi.get,
    staleTime: 0,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileApi.update,
    onSuccess: (res) => {
      qc.setQueryData(PROFILE_KEY, res);
      qc.invalidateQueries({ queryKey: PROFILE_KEY });
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
      qc.setQueryData(PROFILE_KEY, res);
      qc.invalidateQueries({ queryKey: PROFILE_KEY });
      toast.success('Profile image uploaded successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
