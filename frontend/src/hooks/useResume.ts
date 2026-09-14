import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { resumeApi } from '../api/resume.api';
import { getErrorMessage } from '../api/client';
import { INITIAL_RESUME, getCached, setCached, removeCached } from '../data/initialPortfolioData';

export const RESUME_KEY = 'resume';

export const useResume = () =>
  useQuery({ queryKey: [RESUME_KEY], queryFn: resumeApi.getAll, staleTime: 30 * 1000 });

export const useCurrentResume = () =>
  useQuery({
    queryKey: [RESUME_KEY, 'current'],
    queryFn: async () => {
      const res = await resumeApi.getCurrent();
      if (res?.data) setCached('portfolio_resume_current', res.data);
      return res;
    },
    initialData: () => ({
      success: true,
      message: 'Cached',
      data: getCached('portfolio_resume_current', INITIAL_RESUME),
    }),
    initialDataUpdatedAt: 0,
    staleTime: 30 * 1000,
  });

export const useUploadResume = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: resumeApi.upload,
    onSuccess: () => {
      removeCached('portfolio_resume_current');
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
      removeCached('portfolio_resume_current');
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
      removeCached('portfolio_resume_current');
      qc.invalidateQueries({ queryKey: [RESUME_KEY] });
      toast.success('Resume deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
