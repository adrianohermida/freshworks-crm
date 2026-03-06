import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { base44 } from '@/api/base44Client';

const TABELAS = [
  { id: 'assuntos', label: '📋 Assuntos' },
  { id: 'classes', label: '📑 Classes' },
  { id: 'movimentos', label: '⚡ Movimentos' },
  { id: 'documentos', label: '📄 Documentos' }
];

// Regras de validação granular
const VALIDACAO_REGRAS = {
  assuntos: {
    camposObrigatorios: ['cod_item', 'nome'],
    camposOpcionais: ['descricao_glossario', 'situacao'],
    validacoes: [
      { nome: 'Código único', fn: (item) => typeof item.cod_item === 'number' || !isNaN(parseInt(item.cod_item)) },
      { nome: 'Nome não vazio', fn: (item) => item.nome && item.nome.trim().length > 0 },
      { nome: 'Situação válida', fn: (item) => !item.situacao || ['A', 'I'].includes(item.situacao) },
      { nome: 'Hierarquia consistente', fn: (item) => !item.cod_item_pai || item.cod_item_pai !== item.cod_item }
    ]
  },
  classes: {
    camposObrigatorios: ['cod_item', 'nome'],
    camposOpcionais: ['sigla', 'descricao_glossario', 'situacao'],
    validacoes: [
      { nome: 'Código único', fn: (item) => typeof item.cod_item === 'number' || !isNaN(parseInt(item.cod_item)) },
      { nome: 'Nome não vazio', fn: (item) => item.nome && item.nome.trim().length > 0 },
      { nome: 'Sigla coerente', fn: (item) => !item.sigla || item.sigla.length <= 10 },
      { nome: 'Situação válida', fn: (item) => !item.situacao || ['A', 'I'].includes(item.situacao) }
    ]
  },
  movimentos: {
    camposObrigatorios: ['cod_item', 'nome'],
    camposOpcionais: ['descricao_glossario', 'situacao'],
    validacoes: [
      { nome: 'Código único', fn: (item) => typeof item.cod_item === 'number' || !isNaN(parseInt(item.cod_item)) },
      { nome: 'Nome não vazio', fn: (item) => item.nome && item.nome.trim().length > 0 },
      { nome: 'Situação válida', fn: (item) => !item.situacao || ['A', 'I'].includes(item.situacao) },
      { nome: 'Visibilidade consistente', fn: (item) => !item.visibilidadeExterna || ['S', 'N'].includes(item.visibilidadeExterna) }
    ]
  },
  documentos: {
    camposObrigatorios: ['cod_item', 'nome'],
    camposOpcionais: ['descricao_glossario', 'situacao'],
    validacoes: [
      { nome: 'Código único', fn: (item) => typeof item.cod_item === 'number' || !isNaN(parseInt(item.cod_item)) },
      { nome: 'Nome não vazio', fn: (item) => item.nome && item.nome.trim().length > 0 },
      { nome: 'Situação válida', fn: (item) => !item.situacao || ['A', 'I'].includes(item.situacao) }
    ]
  }
};

export default function TPUValidationPanel() {
  const [tabelaSelecionada, setTabelaSelecionada] = useState('assuntos');
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historico, setHistorico] = useState([]);

  const executarValidacoes = (item) => {
    const regras = VALIDACAO_REGRAS[tabelaSelecionada] || {};
    const avisos = [];

    // Validar campos obrigatórios
    (regras.camposObrigatorios || []).forEach(campo => {
      if (!item[campo]) {
        avisos.push({ tipo: 'erro', msg: `Campo obrigatório ausente: ${campo}` });
      }
    });

    // Executar validações customizadas
    (regras.validacoes || []).forEach(validacao => {
      try {
        if (!validacao.fn(item)) {
          avisos.push({ tipo: 'aviso', msg: `Falhou: ${validacao.nome}` });
        }
      } catch (e) {
        avisos.push({ tipo: 'erro', msg: `Erro validando ${validacao.nome}` });
      }
    });

    return avisos;
  };

  const validar = async () => {
    if (!codigo.trim()) {
      setResultado({ error: 'Digite um código para validar' });
      return;
    }

    setIsLoading(true);
    setResultado(null);

    try {
      const res = await base44.functions.invoke('validarCodigoTPU', {
        codigo: codigo.trim(),
        tabela: tabelaSelecionada
      });

      const data = res.data;
      
      // Executar validações granulares se houver item válido
      if (data.valido && data.item) {
        const avisos = executarValidacoes(data.item);
        data.avisos = avisos;
        data.temAvisosIntegridade = avisos.length > 0;
      }

      setResultado(data);

      // Adicionar ao histórico
      setHistorico(prev => [{
        id: Date.now(),
        codigo,
        tabela: tabelaSelecionada,
        valido: data.valido,
        temAvisos: data.temAvisosIntegridade || false,
        timestamp: new Date()
      }, ...prev].slice(0, 10));
    } catch (error) {
      setResultado({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-2xl font-bold flex items-center gap-2">
          ✅ Validação de Códigos TPU
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Verifique se um código existe na API oficial do CNJ
        </p>
      </div>

      {/* PAINEL DE VALIDAÇÃO */}
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-2">Tabela</label>
            <Select value={tabelaSelecionada} onValueChange={setTabelaSelecionada}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TABELAS.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-2">Código</label>
            <Input
              placeholder="Ex: 1001"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && validar()}
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={validar}
              disabled={isLoading || !codigo.trim()}
              className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Validar
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* RESULTADO */}
      {resultado && (
        <div className="space-y-4">
          <Card className={`p-6 space-y-3 ${
            resultado.valido 
              ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700' 
              : 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
          }`}>
            <div className="flex items-start gap-3">
              {resultado.valido ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Código Válido ✓</h4>
                    <div className="mt-2 space-y-2 text-sm text-green-800 dark:text-green-200">
                      <p><strong>Nome:</strong> {resultado.item.nome}</p>
                      {resultado.item.descricao && (
                        <p><strong>Descrição:</strong> {resultado.item.descricao}</p>
                      )}
                      <p><strong>Status:</strong> {resultado.item.ativo ? 'Ativo' : 'Inativo'}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-900 dark:text-red-100">Código Inválido ✗</h4>
                    <p className="text-sm text-red-800 dark:text-red-200 mt-1">{resultado.erro}</p>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* VALIDAÇÕES DE INTEGRIDADE */}
          {resultado.valido && resultado.avisos && resultado.avisos.length > 0 && (
            <Alert variant="destructive" className="bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <div className="space-y-2">
                  <p className="font-semibold">⚠️ Avisos de Integridade de Dados</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    {resultado.avisos.map((aviso, i) => (
                      <li key={i} className="text-sm">
                        {aviso.tipo === 'erro' ? '❌' : '⚠️'} {aviso.msg}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* DADOS COMPLETOS */}
          {resultado.valido && resultado.item && (
            <Card className="p-4 bg-gray-50 dark:bg-gray-800">
              <h5 className="font-semibold mb-3 text-sm">📋 Dados Completos</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {Object.entries(resultado.item).map(([k, v]) => (
                  <div key={k} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <p className="text-gray-500 dark:text-gray-400 font-semibold">{k}</p>
                    <p className="text-gray-700 dark:text-gray-300 break-all">{String(v)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* HISTÓRICO */}
      {historico.length > 0 && (
        <Card className="p-6 space-y-3">
          <h4 className="font-semibold">Histórico de Validações</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {historico.map(item => (
              <div key={item.id} className={`flex items-center justify-between p-2 rounded text-sm ${item.valido ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
                <div className="flex items-center gap-2">
                  {item.valido ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      {item.temAvisos && (
                        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" title="Com avisos de integridade" />
                      )}
                    </>
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                  <span className="font-mono">{item.codigo}</span>
                  <Badge variant="outline" className="text-xs">{item.tabela}</Badge>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.timestamp.toLocaleTimeString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}