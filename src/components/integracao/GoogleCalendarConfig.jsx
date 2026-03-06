import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, AlertCircle, Calendar } from 'lucide-react';

export default function GoogleCalendarConfig({ onConfigured }) {
  const [autorizado, setAutorizado] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [erroMsg, setErroMsg] = useState(null);

  const handleAutorizar = async () => {
    try {
      setSincronizando(true);
      setErroMsg(null);
      
      // Solicitar autorização
      await base44.connectors.authorize('googlecalendar', 
        'Sincronizar tarefas e prazos com seu Google Calendar',
        ['calendar']
      );

      setAutorizado(true);
      setMensagem('Google Calendar autorizado com sucesso!');
      onConfigured?.();
    } catch (error) {
      console.error('Erro ao autorizar:', error);
      setErroMsg('Erro ao autorizar Google Calendar. Tente novamente.');
    } finally {
      setSincronizando(false);
    }
  };

  const handleSincronizar = async () => {
    try {
      setSincronizando(true);
      setErroMsg(null);

      const response = await base44.functions.invoke('syncTarefasGoogleCalendar', {});
      
      setMensagem(`✅ ${response.data.eventosriados} eventos criados, ${response.data.eventosatualizados} atualizados`);
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      setErroMsg('Erro ao sincronizar com Google Calendar');
    } finally {
      setSincronizando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Integração Google Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Sincronize automaticamente seus prazos legais e tarefas com o Google Calendar para não perder nenhuma data importante.
        </p>

        {!autorizado ? (
          <Button
            onClick={handleAutorizar}
            disabled={sincronizando}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {sincronizando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Autorizando...
              </>
            ) : (
              'Autorizar Google Calendar'
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-800">Autorizado e pronto para sincronizar</span>
            </div>

            <Button
              onClick={handleSincronizar}
              disabled={sincronizando}
              className="w-full"
            >
              {sincronizando ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                'Sincronizar Agora'
              )}
            </Button>
          </div>
        )}

        {mensagem && (
          <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{mensagem}</p>
          </div>
        )}

        {erroMsg && (
          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{erroMsg}</p>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1 pt-4 border-t">
          <p>✓ Cria eventos para cada tarefa de prazo</p>
          <p>✓ Envia lembretes 1 dia e 2 horas antes</p>
          <p>✓ Sincronização automática a cada 30 minutos</p>
        </div>
      </CardContent>
    </Card>
  );
}