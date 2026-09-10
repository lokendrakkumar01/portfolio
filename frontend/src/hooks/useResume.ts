import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { resumeApi } from '../api/resume.api';
import { getErrorMessage } from '../api/client';

export const RESUME_KEY = 'resume';

export const useResume = () =>
  useQuery({ queryKey: [RESUME_KEY], queryFn: resumeApi.getAll, staleTime: 5 * 60 * 1000 });

export const useCurrentResume = () =>
  useQuery({ queryKey: [RESUME_KEY, 'current'], queryFn: resumeApi.getCurrent, staleTime: 5 * 60 * 1000 });

export const useUploadResume = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: resumeApi.upload,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [RESUME_KEY] });
      toast.success('Resume uploaded');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useSetCurrentResume = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: resumeApi.setCurrent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [RESUME_KEY] });
      toast.success('Set as current resume');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteResume = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: resumeApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [RESUME_KEY] });
      toast.success('Resume deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
