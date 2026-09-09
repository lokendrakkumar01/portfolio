import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { educationApi } from '../api/education.api';
import { getErrorMessage } from '../api/client';
import type { Education } from '../types';

export const EDU_KEY = 'education';

export const useEducation = () =>
  useQuery({ queryKey: [EDU_KEY], queryFn: educationApi.getAll, staleTime: 5 * 60 * 1000 });

export const useCreateEducation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Education>) => educationApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [EDU_KEY] }); toast.success('Education added'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateEducation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Education> }) => educationApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [EDU_KEY] }); toast.success('Education updated'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteEducation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: educationApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [EDU_KEY] }); toast.success('Education deleted'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
