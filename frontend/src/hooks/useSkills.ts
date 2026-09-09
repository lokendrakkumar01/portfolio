import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { skillsApi, type GetSkillsParams } from '../api/skills.api';
import { getErrorMessage } from '../api/client';
import type { Skill } from '../types';

export const SKILLS_KEY = 'skills';

export const useSkills = (params: GetSkillsParams = {}) =>
  useQuery({
    queryKey: [SKILLS_KEY, params],
    queryFn: () => skillsApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });

export const useSkill = (id: string) =>
  useQuery({
    queryKey: [SKILLS_KEY, id],
    queryFn: () => skillsApi.getById(id),
    enabled: !!id,
  });

export const useCreateSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Skill>) => skillsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [SKILLS_KEY] }); toast.success('Skill created'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Skill> }) => skillsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [SKILLS_KEY] }); toast.success('Skill updated'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: skillsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [SKILLS_KEY] }); toast.success('Skill deleted'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useReorderSkills = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: skillsApi.reorder,
    onSuccess: () => qc.invalidateQueries({ queryKey: [SKILLS_KEY] }),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
