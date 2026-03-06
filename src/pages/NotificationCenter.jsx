import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Bell, Trash2, CheckCircle2, Filter, AlertCircle } from 'lucide-react';
import Card from '@/components/aetherlab/Card';
import Button from '@/components/aetherlab/Button';

export default function NotificationCenterPage() {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const result = await base44.entities.Notification.list('-timestamp');
      return result || [];
    },
    initialData: [],
  });

  // Mark as read mutation
  const markReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { read: true, read_at: new Date().toISOString() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  // Mark all as read
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter((n) => !n.read);
      await Promise.all(unread.map((n) => base44.entities.Notification.update(n.id, { read: true, read_at: new Date().toISOString() })));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  // Filter notifications
  const filtered = notifications.filter((n) => {
    const typeMatch = filterType === 'all' || n.type === filterType;
    const statusMatch = filterStatus === 'all' || (filterStatus === 'unread' ? !n.read : n.read);
    return typeMatch && statusMatch;
  });

  // Stats
  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    today: notifications.filter((n) => new Date(n.timestamp).toDateString() === new Date().toDateString()).length,
  };

  const typeLabels = {
    new_movement: 'Nova Movimentação',
    process_synced: 'Processo Sincronizado',
    deadline_alert: 'Alerta de Prazo',
    system: 'Sistema',
  };

  const typeColors = {
    new_movement: 'bg-blue-100 text-blue-700',
    process_synced: 'bg-green-100 text-green-700',
    deadline_alert: 'bg-orange-100 text-orange-700',
    system: 'bg-gray-100 text-gray-700',
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-light)' }}>
        <p style={{ color: 'var(--color-body)' }}>Carregando notificações...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
            Centro de Notificações
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)' }}>
            Gerencie todas as suas notificações e alertas
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
          <Card variant="default">
            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-body)', margin: 0 }}>Total</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 'var(--spacing-md) 0 0' }}>
              {stats.total}
            </p>
          </Card>
          <Card variant="default" style={{ borderTop: '2px solid var(--color-primary)' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-primary)', margin: 0 }}>Não Lidas</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', margin: 'var(--spacing-md) 0 0' }}>
              {stats.unread}
            </p>
          </Card>
          <Card variant="default">
            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-body)', margin: 0 }}>Hoje</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 'var(--spacing-md) 0 0' }}>
              {stats.today}
            </p>
          </Card>
        </div>

        {/* Controls */}
        <Card variant="default" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)',
                  backgroundColor: '#fff', color: 'var(--color-heading)',
                }}
              >
                <option value="all">Todos os Tipos</option>
                <option value="new_movement">Nova Movimentação</option>
                <option value="process_synced">Processo Sincronizado</option>
                <option value="deadline_alert">Alerta de Prazo</option>
                <option value="system">Sistema</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)',
                  backgroundColor: '#fff', color: 'var(--color-heading)',
                }}
              >
                <option value="all">Todas</option>
                <option value="unread">Não Lidas</option>
                <option value="read">Lidas</option>
              </select>
            </div>

            {stats.unread > 0 && (
              <Button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                variant="primary"
              >
                <CheckCircle2 style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                {markAllReadMutation.isPending ? 'Processando...' : 'Marcar todas como lidas'}
              </Button>
            )}
          </div>
        </Card>

        {/* Notifications List */}
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          {filtered.length === 0 ? (
            <Card variant="default" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <Bell style={{ width: '48px', height: '48px', margin: '0 auto var(--spacing-lg)', color: 'var(--color-border)', opacity: 0.5 }} />
              <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-body)', margin: 0 }}>Nenhuma notificação encontrada</p>
            </Card>
          ) : (
            filtered.map((notification) => (
              <Card
                key={notification.id}
                variant="default"
                style={{
                  borderLeft: `4px solid ${!notification.read ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: !notification.read ? 'var(--color-primary-light)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-lg)', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '9999px', fontSize: 'var(--font-size-xs)', fontWeight: '600',
                        backgroundColor: typeColors[notification.type]?.split(' ')[0] === 'bg-blue-100' ? '#dbeafe' :
                          typeColors[notification.type]?.split(' ')[0] === 'bg-green-100' ? '#dcfce7' :
                          typeColors[notification.type]?.split(' ')[0] === 'bg-orange-100' ? '#fed7aa' : '#f3f4f6',
                        color: typeColors[notification.type]?.split(' ')[1].replace('text-', ''),
                      }}>
                        {typeLabels[notification.type] || notification.type}
                      </span>
                      {!notification.read && <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-primary)', borderRadius: '50%' }} />}
                    </div>
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: '0 0 var(--spacing-sm)' }}>
                      {notification.title}
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0 0 var(--spacing-md)' }}>
                      {notification.message}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', opacity: 0.7 }}>
                      <p style={{ margin: 0 }}>
                        {new Date(notification.timestamp).toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {notification.process_id && (
                        <p style={{ margin: 0, color: 'var(--color-primary)', fontWeight: '500' }}>
                          ID: {notification.process_id.substring(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!notification.read && (
                      <button
                        onClick={() => markReadMutation.mutate(notification.id)}
                        disabled={markReadMutation.isPending}
                        style={{
                          padding: '8px', backgroundColor: 'transparent', border: 'none',
                          cursor: 'pointer', color: 'var(--color-primary)', borderRadius: '8px',
                          transition: 'background 0.15s',
                        }}
                        title="Marcar como lida"
                      >
                        <CheckCircle2 style={{ width: '18px', height: '18px' }} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(notification.id)}
                      disabled={deleteMutation.isPending}
                      style={{
                        padding: '8px', backgroundColor: 'transparent', border: 'none',
                        cursor: 'pointer', color: 'var(--color-body)', borderRadius: '8px',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#EF4444';
                        e.currentTarget.style.backgroundColor = '#FEE2E2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-body)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Deletar notificação"
                    >
                      <Trash2 style={{ width: '18px', height: '18px' }} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}