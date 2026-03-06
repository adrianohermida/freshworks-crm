import React, { useEffect, useState } from 'react';
import { Bell, AlertCircle, CheckCircle2, Clock, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

export default function NotificacaoAlerta() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [expandidos, setExpandidos] = useState({});

  useEffect(() => {
    carregarNotificacoes();
    // Atualizar a cada 30 segundos
    const interval = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(interval);
  }, []);

  const carregarNotificacoes = async () => {
    try {
      const user = await base44.auth.me();
      if (!user) return;

      const notifs = await base44.entities.Notification.filter(
        { user_id: user.email, status: 'pending' },
        '-created_date',
        10
      );
      setNotificacoes(notifs || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const marcarComoLida = async (notifId) => {
    try {
      await base44.entities.Notification.update(notifId, {
        status: 'read',
        read_at: new Date().toISOString()
      });
      setNotificacoes(notificacoes.filter(n => n.id !== notifId));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  if (notificacoes.length === 0) {
    return null;
  }

  const getIconeAlerta = (tipo) => {
    switch (tipo) {
      case 'movement': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'deadline': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'publication': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 max-w-md space-y-2 z-50">
      {notificacoes.slice(0, 3).map(notif => (
        <Card
          key={notif.id}
          className="p-4 border-l-4 border-l-orange-500 bg-white dark:bg-gray-800 shadow-lg animate-slideInUp"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              {getIconeAlerta(notif.type)}
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {notif.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {notif.message}
                </p>
                {notif.metadata?.alerta_severidade && (
                  <Badge
                    className={`mt-2 ${
                      notif.metadata.alerta_severidade === 'critico'
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}
                  >
                    {notif.metadata.alerta_severidade}
                  </Badge>
                )}
              </div>
            </div>
            <button
              onClick={() => marcarComoLida(notif.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}