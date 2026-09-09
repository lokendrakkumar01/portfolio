import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { messagesApi } from '../api/messages.api';
import { getErrorMessage } from '../api/client';
import type { MessageStatus } from '../types';

export const MSGS_KEY = 'messages';

export const useMessages = (params: { page?: number; limit?: number; status?: MessageStatus } = {}) =>
  useQuery({
    queryKey: [MSGS_KEY, params],
    queryFn: () => messagesApi.getAll(params),
    staleTime: 60 * 1000,
  });

export const useUpdateMessageStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MessageStatus }) => messagesApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: [MSGS_KEY] }),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [MSGS_KEY] }); toast.success('Message deleted'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
