import { useState } from 'react';
import { Trash2, Eye, Archive, Mail } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { useMessages, useUpdateMessageStatus, useDeleteMessage } from '../../hooks/useMessages';
import { formatDate } from '../../utils/formatters';
import type { MessageStatus, ContactMessage } from '../../types';
import { Modal } from '../../components/ui/Modal';

const STATUS_TABS: Array<{ label: string; value: MessageStatus | '' }> = [
  { label: 'All', value: '' },
  { label: 'Unread', value: 'unread' },
  { label: 'Read', value: 'read' },
  { label: 'Archived', value: 'archived' },
];

export default function MessagesAdminPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<MessageStatus | ''>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMsg, setViewMsg] = useState<ContactMessage | null>(null);
  const { data, isLoading } = useMessages({ page, limit: 15, status: status || undefined });
  const updateStatus = useUpdateMessageStatus();
  const deleteMsg = useDeleteMessage();
  const messages = data?.data ?? [];
  const pagination = data?.pagination;

  const handleView = (msg: ContactMessage) => {
    setViewMsg(msg);
    if (msg.status === 'unread') updateStatus.mutate({ id: msg._id, status: 'read' });
  };

  const statusBadgeVariant = (s: MessageStatus) => s === 'unread' ? 'error' as const : s === 'read' ? 'success' as const : 'default' as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Messages</h1>
        <p className="text-muted text-sm">{pagination?.total ?? 0} total messages</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button key={tab.value} onClick={() => { setStatus(tab.value); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${status === tab.value ? 'bg-primary text-white' : 'bg-card border border-border text-muted hover:text-text'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : messages.length === 0 ? (
        <EmptyState icon={Mail} title="No messages" description="Contact form messages will appear here." />
      ) : (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Sender</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase hidden md:table-cell">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {messages.map((msg) => (
                  <tr key={msg._id} className={`hover:bg-surface/50 transition-colors ${msg.status === 'unread' ? 'font-semibold' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="text-text">{msg.name}</p>
                      <p className="text-xs text-muted">{msg.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted max-w-xs truncate">{msg.subject}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted">{formatDate(msg.createdAt, 'short')}</td>
                    <td className="px-4 py-3"><Badge variant={statusBadgeVariant(msg.status)} size="sm">{msg.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleView(msg)} className="p-1.5 hover:text-primary transition-colors text-muted" title="View"><Eye className="w-4 h-4" /></button>
                        {msg.status !== 'archived' && (
                          <button onClick={() => updateStatus.mutate({ id: msg._id, status: 'archived' })} className="p-1.5 hover:text-warning transition-colors text-muted" title="Archive"><Archive className="w-4 h-4" /></button>
                        )}
                        <button onClick={() => setDeleteId(msg._id)} className="p-1.5 hover:text-error transition-colors text-muted" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
          {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
        </>
      )}

      {/* View modal */}
      <Modal open={!!viewMsg} onClose={() => setViewMsg(null)} title="Message" size="md">
        {viewMsg && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted text-xs">From</p><p className="text-text font-medium">{viewMsg.name}</p></div>
              <div><p className="text-muted text-xs">Email</p><a href={`mailto:${viewMsg.email}`} className="text-primary">{viewMsg.email}</a></div>
              <div className="col-span-2"><p className="text-muted text-xs">Subject</p><p className="text-text font-medium">{viewMsg.subject}</p></div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <p className="text-sm text-text whitespace-pre-line">{viewMsg.message}</p>
            </div>
            <p className="text-xs text-muted">Received: {formatDate(viewMsg.createdAt)}</p>
            <div className="flex gap-2 justify-end">
              <a href={`mailto:${viewMsg.email}?subject=Re: ${encodeURIComponent(viewMsg.subject)}`}>
                <Button variant="outline" size="sm" icon={<Mail className="w-4 h-4" />}>Reply via Email</Button>
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteMsg.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        loading={deleteMsg.isPending} title="Delete Message" />
    </div>
  );
}