import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { experienceApi } from '../api/experience.api';
import { getErrorMessage } from '../api/client';
import type { Experience } from '../types';

export const EXP_KEY = 'experience';

export const useExperience = () =>
  useQuery({ queryKey: [EXP_KEY], queryFn: experienceApi.getAll, staleTime: 5 * 60 * 1000 });

export const useCreateExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Experience>) => experienceApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [EXP_KEY] }); toast.success('Experience added'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Experience> }) => experienceApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [EXP_KEY] }); toast.success('Experience updated'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: experienceApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [EXP_KEY] }); toast.success('Experience deleted'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
