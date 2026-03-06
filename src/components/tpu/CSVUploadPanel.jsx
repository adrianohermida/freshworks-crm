import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2, FileUp, DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';

const TIPOS_ENTIDADES = [
  { 
    valor: 'serventias', 
    label: 'Serventias (Cartórios)',
    campos_obrigatorios: ['codigo', 'nome', 'tribunal', 'municipio'],
    descricao: 'Importar dados de cartórios/serventias'
  },
  { 
    valor: 'juizocnj', 
    label: 'JuizoCNJ (Órgãos Julgadores)',
    campos_obrigatorios: ['codigo', 'nome', 'tribunal', 'tipo'],
    descricao: 'Importar dados de órgãos julgadores CNJ'
  },
  { 
    valor: 'codigoforotjsp', 
    label: 'CodigoForoTJSP (Foros TJSP)',
    campos_obrigatorios: ['codigo_foro', 'nome_foro', 'municipio'],
    descricao: 'Importar dados de foros TJSP'
  }
];

export default function CSVUploadPanel() {
  const [tipoSelecionado, setTipoSelecionado] = useState('serventias');
  const [csvContent, setCSVContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const tipoAtual = TIPOS_ENTIDADES.find(t => t.valor === tipoSelecionado);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCSVContent(e.target?.result || '');
      setError(null);
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csvContent.trim()) {
      setError('Por favor, carregue um arquivo CSV');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await base44.functions.invoke('importarCSVReferencia', {
        csv_content: csvContent,
        tipo_entidade: tipoSelecionado
      });

      if (response.data?.success) {
        setResult(response.data.import_summary);
        setCSVContent('');
      } else {
        setError(response.data?.error || 'Erro desconhecido');
      }
    } catch (err) {
      setError(err.message || 'Erro ao processar importação');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    let csv = '';
    if (tipoSelecionado === 'serventias') {
      csv = 'codigo,nome,tribunal,municipio,endereco,telefone,email,tipo,ativo\nSRV001,Serventias Central,TJSP,São Paulo,Rua A 100,1133334444,srv@email.com,cartorio_distribuidor,sim';
    } else if (tipoSelecionado === 'juizocnj') {
      csv = 'codigo,nome,tribunal,municipio,codigo_ibge,tipo,grau,especialidade,ativo\n0000001,1ª Vara Cível,TJSP,São Paulo,3550308,vara,1º_grau,Cível,sim';
    } else {
      csv = 'codigo_foro,nome_foro,municipio,codigo_ibge,comarca,nivel,ativo\n1,Foro de São Paulo,São Paulo,3550308,São Paulo,1º_grau,sim';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `template_${tipoSelecionado}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Importar Dados de Referência (CSV)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bulk import de Serventias, JuizoCNJ e Foros
          </p>
        </div>
      </div>

      {/* SELEÇÃO DE TIPO */}
      <Card className="p-4 space-y-3">
        <label className="text-sm font-semibold">Tipo de Entidade</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TIPOS_ENTIDADES.map(tipo => (
            <button
              key={tipo.valor}
              onClick={() => {
                setTipoSelecionado(tipo.valor);
                setCSVContent('');
                setResult(null);
              }}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                tipoSelecionado === tipo.valor
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-sm">{tipo.label}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {tipo.descricao}
              </p>
            </button>
          ))}
        </div>
      </Card>

      {/* CAMPOS OBRIGATÓRIOS */}
      {tipoAtual && (
        <Card className="p-4 bg-amber-50 dark:bg-amber-900 border-amber-200 dark:border-amber-700">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
            ✓ Campos Obrigatórios:
          </p>
          <div className="flex flex-wrap gap-2">
            {tipoAtual.campos_obrigatorios.map(campo => (
              <Badge key={campo} variant="outline" className="bg-white dark:bg-amber-800">
                {campo}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* UPLOAD AREA */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <label htmlFor="csv-upload" className="cursor-pointer">
              <FileUp className="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <p className="font-semibold mb-1">Clique ou arraste um arquivo CSV</p>
              <p className="text-sm text-gray-500">
                {csvContent ? '✓ Arquivo carregado' : 'Máximo 50MB'}
              </p>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {csvContent && (
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3">
              <p className="text-sm text-green-800 dark:text-green-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Arquivo carregado ({csvContent.split('\n').length - 1} linhas)
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleImport}
              disabled={isLoading || !csvContent}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Dados
                </>
              )}
            </Button>

            <Button 
              onClick={downloadTemplate}
              variant="outline"
            >
              <DownloadCloud className="w-4 h-4 mr-2" />
              Template
            </Button>
          </div>
        </div>
      </Card>

      {/* RESULTADO */}
      {result && (
        <Card className="p-4 bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ✓ Importação Concluída!
              </h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-green-700 dark:text-green-200">Total de linhas</p>
                  <p className="font-bold text-lg text-green-800 dark:text-green-100">
                    {result.total_linhas}
                  </p>
                </div>
                <div>
                  <p className="text-green-700 dark:text-green-200">Importados</p>
                  <p className="font-bold text-lg text-green-800 dark:text-green-100">
                    {result.inseridos}
                  </p>
                </div>
                <div>
                  <p className="text-green-700 dark:text-green-200">Erros</p>
                  <p className="font-bold text-lg text-green-800 dark:text-green-100">
                    {result.erros}
                  </p>
                </div>
              </div>
              {result.status === 'sucesso' && (
                <Progress value={100} className="mt-3 h-2" />
              )}
            </div>
          </div>
        </Card>
      )}

      {/* ERRO */}
      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-100">
                Erro na Importação
              </h4>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}