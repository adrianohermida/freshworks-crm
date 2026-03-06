import React, { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Gerenciador TPU - Interface para editar/corrigir dados
 */
export default function TPUManager() {
  const [cnj, setCNJ] = useState('');
  const [validation, setValidation] = useState(null);
  const [process, setProcess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updates, setUpdates] = useState({});
  const [message, setMessage] = useState('');

  const validateCNJ = useCallback(async () => {
    if (!cnj.trim()) return;
    
    setLoading(true);
    try {
      const response = await base44.functions.invoke('tpuManager', {
        action: 'validate_cnj',
        data: { cnj_number: cnj }
      });
      
      setValidation(response.data);
      
      if (response.data.is_valid) {
        fetchProcess(cnj);
      }
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [cnj]);

  const fetchProcess = async (cnj_num) => {
    try {
      const response = await base44.functions.invoke('tpuManager', {
        action: 'get_process',
        data: { cnj_number: cnj_num }
      });
      setProcess(response.data.data);
    } catch (error) {
      setMessage(`Erro ao buscar processo: ${error.message}`);
    }
  };

  const updateProcess = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('tpuManager', {
        action: 'update_process',
        data: {
          process_id: process.id,
          updates
        }
      });
      
      setProcess(response.data.data);
      setUpdates({});
      setMessage('✅ Processo atualizado com sucesso!');
    } catch (error) {
      setMessage(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">📚 Gerenciador TPU</h2>
        
        <Tabs defaultValue="validate" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="validate">Validar</TabsTrigger>
            <TabsTrigger value="edit">Editar</TabsTrigger>
            <TabsTrigger value="bulk">Bulk</TabsTrigger>
          </TabsList>

          {/* TAB: VALIDAR */}
          <TabsContent value="validate" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ex: 0000001-00.0000.0.00000.0000000"
                value={cnj}
                onChange={(e) => setCNJ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && validateCNJ()}
              />
              <Button onClick={validateCNJ} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validar'}
              </Button>
            </div>

            {validation && (
              <div className={`p-4 rounded-lg ${validation.is_valid ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {validation.is_valid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-semibold">
                    {validation.is_valid ? 'CNJ Válido' : 'CNJ Inválido'}
                  </span>
                </div>

                {validation.parsed && (
                  <div className="text-sm space-y-1 text-gray-700">
                    <p>Sequencial: {validation.parsed.numero_sequencial}</p>
                    <p>Tribunal: {validation.tribunal_info?.sigla}</p>
                    <p>Segmento: {validation.parsed.segmento}</p>
                    <p>Ano: {validation.parsed.ano}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* TAB: EDITAR */}
          <TabsContent value="edit" className="space-y-4">
            {process ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold">Título</label>
                    <Input
                      value={updates.title || process.title || ''}
                      onChange={(e) => setUpdates({ ...updates, title: e.target.value })}
                      placeholder="Título do processo"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Status</label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg"
                      value={updates.status || process.status || ''}
                      onChange={(e) => setUpdates({ ...updates, status: e.target.value })}
                    >
                      <option value="active">Ativo</option>
                      <option value="archived">Arquivado</option>
                      <option value="paused">Pausado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold">Notas</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg"
                    value={updates.notes || process.notes || ''}
                    onChange={(e) => setUpdates({ ...updates, notes: e.target.value })}
                    placeholder="Notas do processo"
                    rows="3"
                  />
                </div>

                <Button onClick={updateProcess} disabled={loading} className="w-full bg-blue-600">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : '💾'} Salvar Alterações
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">Valide um CNJ primeiro para editar</p>
            )}
          </TabsContent>

          {/* TAB: BULK */}
          <TabsContent value="bulk" className="space-y-4">
            <p className="text-sm text-gray-600">Atualize múltiplos processos de uma vez</p>
            <Button className="w-full">🔄 Atualizar em Massa</Button>
          </TabsContent>
        </Tabs>

        {message && (
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm">
            {message}
          </div>
        )}
      </Card>
    </div>
  );
}