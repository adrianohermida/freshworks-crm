import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import TribunalSelector from '../TribunalSelector';

export default function TribunalConfigPanel() {
  const [user, setUser] = useState(null);
  const [selectedTribunal, setSelectedTribunal] = useState('tjsp');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      // Buscar configuração existente
      const configs = await base44.entities.TribunalConfig.filter(
        { user_id: currentUser.email },
        null,
        1
      );

      if (configs && configs.length > 0) {
        setConfig(configs[0]);
        setSelectedTribunal(configs[0].tribunal_alias);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const salvarConfiguracao = async () => {
    try {
      setLoading(true);
      setSaved(false);

      if (config?.id) {
        // Atualizar existente
        await base44.entities.TribunalConfig.update(config.id, {
          tribunal_alias: selectedTribunal,
          ativo: true
        });
      } else {
        // Criar novo
        await base44.entities.TribunalConfig.create({
          user_id: user.email,
          tribunal_alias: selectedTribunal,
          ativo: true
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await carregarDados();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          ⚖️ Configuração de Tribunal
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Selecione qual tribunal usar por padrão nas buscas de processos
        </p>
      </div>

      {loading && !selectedTribunal ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 mx-auto text-gray-400 animate-spin mb-2" />
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      ) : (
        <>
          <TribunalSelector
            value={selectedTribunal}
            onChange={setSelectedTribunal}
          />

          {config && (
            <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800 dark:text-green-200">
                  <p className="font-semibold">Configuração ativa</p>
                  <p className="text-xs mt-1">
                    Última atualização: {new Date(config.updated_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {saved && (
            <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800 dark:text-green-200 font-semibold">
                  Configuração salva com sucesso!
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 Como funciona?
              </h4>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Suas buscas usarão este tribunal por padrão</li>
                <li>• Você ainda pode escolher outro tribunal em cada busca</li>
                <li>• Os processos serão sincronizados com os dados deste tribunal</li>
              </ul>
            </div>
          </div>

          <Button
            onClick={salvarConfiguracao}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Configuração'
            )}
          </Button>
        </>
      )}
    </Card>
  );
}