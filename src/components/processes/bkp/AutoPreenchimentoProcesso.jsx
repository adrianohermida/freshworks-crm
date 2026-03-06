import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

/**
 * Componente para auto-preenchimento de processo via número CNJ
 * Busca dados em DataJud + JuizoCNJ + Serventia + SGT
 */
export default function AutoPreenchimentoProcesso({ clienteId, onProcessoCarregado }) {
  const [numeroCNJ, setNumeroCNJ] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erros, setErros] = useState([]);
  const [avisos, setAvisos] = useState([]);

  const handlePreencherAutomatico = async () => {
    if (!numeroCNJ.trim()) {
      setErros(['Informe um número CNJ']);
      return;
    }

    setLoading(true);
    setErros([]);
    setAvisos([]);
    setResultado(null);

    try {
      const { data } = await base44.functions.invoke('preencherProcessoAutomatico', {
        numeroCNJ: numeroCNJ.trim(),
        clienteId: clienteId || null,
      });

      if (data.erros?.length > 0) {
        setErros(data.erros);
      }

      if (data.avisos?.length > 0) {
        setAvisos(data.avisos);
      }

      if (data.processoDados) {
        setResultado(data.processoDados);
        if (onProcessoCarregado) {
          onProcessoCarregado(data.processoDados);
        }
      }
    } catch (error) {
      setErros([error.message || 'Erro ao consultar processo']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Auto-preenchimento de Processo</CardTitle>
        <CardDescription>
          Digite o número CNJ para auto-preencher os dados do processo
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input + Botão */}
        <div className="flex gap-2">
          <Input
            placeholder="Ex: 0000832-35.2018.4.01.3202 ou 00008323520184013202"
            value={numeroCNJ}
            onChange={(e) => setNumeroCNJ(e.target.value)}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && handlePreencherAutomatico()}
          />
          <Button
            onClick={handlePreencherAutomatico}
            disabled={loading}
            className="whitespace-nowrap"
          >
            {loading ? 'Carregando...' : 'Auto-preencher'}
          </Button>
        </div>

        {/* Erros */}
        {erros.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-1">
            {erros.map((erro, i) => (
              <div key={i} className="flex gap-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{erro}</span>
              </div>
            ))}
          </div>
        )}

        {/* Avisos */}
        {avisos.length > 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 space-y-1">
            {avisos.map((aviso, i) => (
              <div key={i} className="flex gap-2 text-sm text-yellow-700">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{aviso}</span>
              </div>
            ))}
          </div>
        )}

        {/* Resultado */}
        {resultado && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-2">
            <div className="flex gap-2 items-center text-green-700 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Processo carregado com sucesso!
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-3">
              {resultado.numero_processo && (
                <div className="space-y-1">
                  <div className="text-gray-600 text-xs uppercase tracking-wide">Número</div>
                  <div className="font-mono">{resultado.numero_processo}</div>
                </div>
              )}

              {resultado.tribunal && (
                <div className="space-y-1">
                  <div className="text-gray-600 text-xs uppercase tracking-wide">Tribunal</div>
                  <div>{resultado.tribunal}</div>
                </div>
              )}

              {resultado.classe_judicial && (
                <div className="space-y-1">
                  <div className="text-gray-600 text-xs uppercase tracking-wide">Classe Judicial</div>
                  <div>{resultado.classe_judicial}</div>
                </div>
              )}

              {resultado.comarca && (
                <div className="space-y-1">
                  <div className="text-gray-600 text-xs uppercase tracking-wide">Comarca</div>
                  <div>{resultado.comarca}</div>
                </div>
              )}

              {resultado.municipio && (
                <div className="space-y-1">
                  <div className="text-gray-600 text-xs uppercase tracking-wide">Município</div>
                  <div>{resultado.municipio}</div>
                </div>
              )}

              {resultado.orgao_julgador && (
                <div className="space-y-1">
                  <div className="text-gray-600 text-xs uppercase tracking-wide">Órgão Julgador</div>
                  <div className="text-xs">{resultado.orgao_julgador}</div>
                </div>
              )}

              {resultado.data_abertura && (
                <div className="space-y-1">
                  <div className="text-gray-600 text-xs uppercase tracking-wide">Data Abertura</div>
                  <div>
                    {new Date(resultado.data_abertura).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              )}

              {resultado.assuntos?.length > 0 && (
                <div className="space-y-1">
                  <div className="text-gray-600 text-xs uppercase tracking-wide">Assuntos</div>
                  <div className="text-xs space-y-0.5">
                    {resultado.assuntos.slice(0, 2).map((a, i) => {
                      const nome = typeof a === 'string' ? a : (a.nome || '—');
                      return <div key={i}>{nome}</div>;
                    })}
                    {resultado.assuntos.length > 2 && (
                      <div className="text-gray-500">
                        +{resultado.assuntos.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!resultado && !loading && !erros.length && !avisos.length && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 flex gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>Aguardando número CNJ...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}