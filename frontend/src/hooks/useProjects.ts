import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { projectsApi, type GetProjectsParams } from '../api/projects.api';
import { getErrorMessage } from '../api/client';
import type { Project } from '../types';

export const PROJECTS_KEY = 'projects';

export const useProjects = (params: GetProjectsParams = {}) =>
  useQuery({
    queryKey: [PROJECTS_KEY, params],
    queryFn: () => projectsApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });

export const useProject = (slug: string) =>
  useQuery({
    queryKey: [PROJECTS_KEY, 'slug', slug],
    queryFn: () => projectsApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useProjectById = (id: string) =>
  useQuery({
    queryKey: [PROJECTS_KEY, 'id', id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Project>) => projectsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [PROJECTS_KEY] }); toast.success('Project created'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) => projectsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [PROJECTS_KEY] }); toast.success('Project updated'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [PROJECTS_KEY] }); toast.success('Project deleted'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUploadProjectCover = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => projectsApi.uploadCover(id, file),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [PROJECTS_KEY] }); toast.success('Cover image uploaded'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useAddProjectScreenshot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file, caption }: { id: string; file: File; caption?: string }) => projectsApi.addScreenshot(id, file, caption),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [PROJECTS_KEY] }); toast.success('Screenshot added'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteProjectScreenshot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, screenshotId }: { projectId: string; screenshotId: string }) => projectsApi.deleteScreenshot(projectId, screenshotId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [PROJECTS_KEY] }); toast.success('Screenshot deleted'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
