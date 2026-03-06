import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { MessageSquare, Share2, CheckSquare, Activity, User } from 'lucide-react';

export default function TimelineColaboracao({ idProcesso }) {
  const [eventos, setEventos] = useState([]);

  const { data: timeline } = useQuery({
    queryKey: ['timeline', idProcesso],
    queryFn: async () => {
      const { data } = await base44.functions.invoke('colaboracao/obterTimeline', {
        idProcesso,
        limite: 100
      });
      return data;
    },
    refetchInterval: 30000
  });

  useEffect(() => {
    if (timeline?.eventos) {
      setEventos(timeline.eventos);
    }
  }, [timeline]);

  const getIconForTipo = (tipo) => {
    switch (tipo) {
      case 'comentario':
        return <MessageSquare className="w-5 h-5" />;
      case 'compartilhamento':
        return <Share2 className="w-5 h-5" />;
      case 'atribuicao':
        return <CheckSquare className="w-5 h-5" />;
      case 'movimento':
        return <Activity className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getColorForTipo = (tipo) => {
    switch (tipo) {
      case 'comentario':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'compartilhamento':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900';
      case 'atribuicao':
        return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'movimento':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const renderEventoContent = (evento) => {
    switch (evento.tipo) {
      case 'comentario':
        return (
          <div>
            <p className="font-semibold">{evento.autor} comentou</p>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{evento.conteudo}</p>
            {evento.mencoes > 0 && <p className="text-xs text-blue-600 mt-1">@{evento.mencoes} menção(ões)</p>}
          </div>
        );
      case 'compartilhamento':
        return (
          <div>
            <p className="font-semibold">Documento compartilhado</p>
            <p className="text-sm text-gray-600">{evento.documento}</p>
            <p className="text-xs text-gray-500 mt-1">Compartilhado com {evento.usuariosCount} usuários</p>
          </div>
        );
      case 'atribuicao':
        return (
          <div>
            <p className="font-semibold">Tarefa atribuída</p>
            <p className="text-sm text-gray-600">Atribuído a {evento.responsavel}</p>
            <div className="flex gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded ${evento.prioridade === 'alta' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {evento.prioridade}
              </span>
              {evento.prazo && <span className="text-xs text-gray-500">Prazo: {new Date(evento.prazo).toLocaleDateString('pt-BR')}</span>}
            </div>
          </div>
        );
      case 'movimento':
        return (
          <div>
            <p className="font-semibold">Movimento Processual</p>
            <p className="text-sm text-gray-600">{evento.descricao}</p>
            {evento.tribunal && <p className="text-xs text-gray-500 mt-1">{evento.tribunal}</p>}
          </div>
        );
      default:
        return <p className="font-semibold">Evento</p>;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Timeline de Colaboração</h2>
      
      {eventos.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          Nenhuma atividade ainda
        </Card>
      ) : (
        <div className="space-y-3">
          {eventos.map((evento) => (
            <div key={evento.id} className="flex gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getColorForTipo(evento.tipo)}`}>
                {getIconForTipo(evento.tipo)}
              </div>

              {/* Content */}
              <Card className="flex-1 p-4">
                {renderEventoContent(evento)}
                <p className="text-xs text-gray-500 mt-2">{formatDate(evento.timestamp)}</p>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}