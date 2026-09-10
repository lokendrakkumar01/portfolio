import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { achievementsApi, type GetAchievementsParams } from '../api/achievements.api';
import { getErrorMessage } from '../api/client';
import type { Achievement } from '../types';

export const ACH_KEY = 'achievements';

export const useAchievements = (params: GetAchievementsParams = {}) =>
  useQuery({
    queryKey: [ACH_KEY, params],
    queryFn: () => achievementsApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });

export const useCreateAchievement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Achievement>) => achievementsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ACH_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Achievement created');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateAchievement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Achievement> }) => achievementsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ACH_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Achievement updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteAchievement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: achievementsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ACH_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Achievement deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
