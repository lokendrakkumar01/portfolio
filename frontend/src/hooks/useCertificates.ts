import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { certificatesApi, type GetCertificatesParams } from '../api/certificates.api';
import { getErrorMessage } from '../api/client';
import type { Certificate } from '../types';

export const CERTS_KEY = 'certificates';

export const useCertificates = (params: GetCertificatesParams = {}) =>
  useQuery({
    queryKey: [CERTS_KEY, params],
    queryFn: () => certificatesApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });

export const useCertificate = (id: string) =>
  useQuery({
    queryKey: [CERTS_KEY, id],
    queryFn: () => certificatesApi.getById(id),
    enabled: !!id,
  });

export const useCreateCertificate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Certificate>) => certificatesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CERTS_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Certificate created');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateCertificate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Certificate> }) => certificatesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CERTS_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Certificate updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteCertificate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: certificatesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CERTS_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Certificate deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
