import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { projectsApi, type GetProjectsParams } from '../api/projects.api';
import { getErrorMessage } from '../api/client';
import type { Project } from '../types';
import { INITIAL_PROJECTS, INITIAL_PAGINATION, getCached, setCached } from '../data/initialPortfolioData';

export const PROJECTS_KEY = 'projects';

export const useProjects = (params: GetProjectsParams = {}) =>
  useQuery({
    queryKey: [PROJECTS_KEY, params],
    queryFn: async () => {
      const res = await projectsApi.getAll(params);
      if (res?.data && (!params.q && !params.category && !params.level && (!params.page || params.page === 1))) {
        const cacheKey = params.featured ? 'portfolio_projects_featured' : 'portfolio_projects_all';
        setCached(cacheKey, res.data);
      }
      return res;
    },
    initialData: () => {
      if (params.q || params.category || params.level || (params.page && params.page > 1)) {
        return undefined;
      }
      const cacheKey = params.featured ? 'portfolio_projects_featured' : 'portfolio_projects_all';
      const cached = getCached(cacheKey, INITIAL_PROJECTS);
      return {
        success: true,
        message: 'Cached',
        data: cached,
        pagination: INITIAL_PAGINATION,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

export const useProject = (slug: string) =>
  useQuery({
    queryKey: [PROJECTS_KEY, 'slug', slug],
    queryFn: async () => {
      const res = await projectsApi.getBySlug(slug);
      if (res?.data) setCached(`portfolio_project_${slug}`, res.data);
      return res;
    },
    initialData: () => {
      const matched = INITIAL_PROJECTS.find((p) => p.slug === slug);
      const cached = getCached(`portfolio_project_${slug}`, matched);
      if (cached) {
        return { success: true, message: 'Cached', data: cached };
      }
      return undefined;
    },
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROJECTS_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Project created');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) => projectsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: [PROJECTS_KEY] });
      const previousData = qc.getQueriesData({ queryKey: [PROJECTS_KEY] });
      qc.setQueriesData({ queryKey: [PROJECTS_KEY] }, (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((item: Project) => (item._id === id ? { ...item, ...data } : item));
        }
        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((item: Project) => (item._id === id ? { ...item, ...data } : item)),
          };
        }
        return old;
      });
      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
      toast.error(getErrorMessage(err));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: [PROJECTS_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROJECTS_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Project deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUploadProjectCover = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => projectsApi.uploadCover(id, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROJECTS_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Cover image uploaded');
    },
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
