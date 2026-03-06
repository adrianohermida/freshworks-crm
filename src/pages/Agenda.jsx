import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Calendar, MapPin, Users, Clock, Trash2 } from 'lucide-react';
import Button from '@/components/aetherlab/Button';
import Input from '@/components/aetherlab/Input';
import Card from '@/components/aetherlab/Card';

export default function Agenda() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', type: 'reuniao', start_date: '', location: '' });
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery({
    queryKey: ['agenda'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Agenda.filter({ created_by: user.email }, '-start_date', 100);
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Agenda.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
      setFormData({ title: '', type: 'reuniao', start_date: '', location: '' });
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Agenda.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
    },
  });

  // Eventos do mês atual
  const monthEvents = events.filter(e => {
    const eDate = new Date(e.start_date);
    return eDate.getMonth() === currentMonth.getMonth() && eDate.getFullYear() === currentMonth.getFullYear();
  });

  // Próximos eventos
  const upcomingEvents = events.filter(e => new Date(e.start_date) >= new Date()).sort((a, b) => new Date(a.start_date) - new Date(b.start_date)).slice(0, 5);

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
              Agenda
            </h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)' }}>
              {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} variant="primary" size="md">
            <Plus style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-sm)' }} />
            Novo Evento
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
          {/* Calendário simples */}
          <Card>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)', margin: 0 }}>
              {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: 'var(--font-size-lg)' }}
              >
                ←
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', fontSize: 'var(--font-size-sm)' }}
              >
                Hoje
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: 'var(--font-size-lg)' }}
              >
                →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-xs)', textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(d => (
                <div key={d} style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-body)' }}>{d}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--spacing-sm)' }}>
              {Array.from({ length: 35 }, (_, i) => {
                const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
                const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
                const day = i - firstDay + 1;

                if (day <= 0 || day > daysInMonth) {
                  return <div key={i} style={{ padding: 'var(--spacing-sm)', textAlign: 'center', opacity: 0.3 }}></div>;
                }

                const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
                const dayEvents = monthEvents.filter(e => e.start_date.startsWith(dateStr));
                const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

                return (
                  <div
                    key={i}
                    style={{
                      padding: 'var(--spacing-sm)',
                      textAlign: 'center',
                      borderRadius: 'var(--border-radius-sm)',
                      backgroundColor: isToday ? 'var(--color-primary)' : dayEvents.length > 0 ? 'var(--color-primary-light)' : 'transparent',
                      color: isToday ? 'var(--color-white)' : 'var(--color-heading)',
                      cursor: 'pointer',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: isToday ? 'var(--font-weight-semibold)' : 'normal',
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Próximos eventos */}
          <div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)', margin: 0 }}>
              Próximos Eventos
            </h2>
            {upcomingEvents.length === 0 ? (
              <Card>
                <p style={{ color: 'var(--color-body)', textAlign: 'center', margin: 0 }}>Nenhum evento agendado</p>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {upcomingEvents.map((event) => (
                  <Card key={event.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                      <div>
                        <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                          {event.title}
                        </h3>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', margin: 0, textTransform: 'uppercase' }}>
                          {event.type}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteMutation.mutate(event.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', opacity: 0.7 }}
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                        <Clock style={{ width: '14px', height: '14px' }} />
                        {new Date(event.start_date).toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {event.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                          <MapPin style={{ width: '14px', height: '14px' }} />
                          {event.location}
                        </div>
                      )}
                      {event.description && (
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, marginTop: 'var(--spacing-sm)', lineHeight: '1.4' }}>
                          {event.description}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dialog */}
        {isDialogOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <Card style={{ maxWidth: '400px', width: '90%' }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)', margin: 0 }}>
                Novo Evento
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <Input
                  placeholder="Título do evento"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Input
                  placeholder="Data e hora"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'var(--font-primary)'
                  }}
                >
                  <option value="reuniao">Reunião</option>
                  <option value="audiencia">Audiência</option>
                  <option value="prazo">Prazo</option>
                  <option value="despacho">Despacho</option>
                </select>
                <Input
                  placeholder="Local (opcional)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                  <Button onClick={() => setIsDialogOpen(false)} variant="secondary">
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => createMutation.mutate(formData)}
                    variant="primary"
                    disabled={!formData.title || !formData.start_date || createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Criando...' : 'Criar'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}