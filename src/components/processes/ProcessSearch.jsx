import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';

// Mapa de siglasde tribunais
const TRIBUNAL_SIGLA_MAP = {
  '00001': 'STF', '00002': 'STJ', '00003': 'TST', '00011': 'TRF1', '00012': 'TRF2',
  '00013': 'TRF3', '00014': 'TRF4', '00015': 'TRF5', '00016': 'TRF6',
  '00035': 'TJSP', '00031': 'TJMG', '00020': 'TJRJ', '00021': 'TJRS', '00005': 'TJBA',
  '00029': 'TJDF', '00019': 'TJCE', '00032': 'TJES', '00024': 'TJGO', '00017': 'TJMA',
  '00033': 'TJMS', '00022': 'TJMT', '00015': 'TJPA', '00012': 'TJPB', '00026': 'TJPE',
  '00016': 'TJPI', '00011': 'TJPR', '00014': 'TJRN', '00025': 'TJRO', '00027': 'TJRR',
  '00013': 'TJSC', '00023': 'TJSE', '00028': 'TJTO'
};

export default function ProcessSearch({ onSelectResult, onClear }) {
  const [searchType, setSearchType] = useState('by_cnj');
  const [searchValue, setSearchValue] = useState('');
  const [className, setClassName] = useState('');
  const [orgaoValue, setOrgaoValue] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setError('');
    setResults([]);
    setSearched(false);

    if (!searchValue.trim()) {
      setError('Por favor, preencha o campo de busca');
      return;
    }

    if (searchType === 'by_classe_orgao' && !className.trim()) {
      setError('Por favor, selecione uma classe processual');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        query_type: searchType,
        ...(searchType === 'by_cnj' && { cnj_number: searchValue }),
        ...(searchType === 'by_classe_orgao' && { classe: className, orgao: searchValue }),
        ...(searchType === 'by_litigante' && { litigante: searchValue })
      };

      const response = await base44.functions.invoke('consultarDataJudCompleto', payload);
      setResults(response.data.results?.processes || [response.data.results?.process].filter(Boolean));
      setSearched(true);
    } catch (err) {
      setError(err.message || 'Erro ao buscar processos');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProcess = (process) => {
    onSelectResult({
      cnj_number: process.numero,
      title: process.assunto || `Processo ${process.numero}`
    });
    handleClear();
  };

  const handleClear = () => {
    setSearchValue('');
    setClassName('');
    setOrgaoValue('');
    setResults([]);
    setError('');
    setSearched(false);
    onClear?.();
  };

  return (
    <div className="space-y-4">
      {/* Search Type Selector */}
      <div className="space-y-2">
        <Label className="dark:text-gray-300">Tipo de Busca</Label>
        <Select value={searchType} onValueChange={setSearchType} disabled={loading}>
          <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="by_cnj">Por Número CNJ</SelectItem>
            <SelectItem value="by_classe_orgao">Por Classe + Órgão</SelectItem>
            <SelectItem value="by_litigante">Por Litigante</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Inputs */}
      <div className="space-y-2">
        {searchType === 'by_cnj' && (
          <div className="space-y-2">
            <Label htmlFor="cnj-search" className="dark:text-gray-300">Número CNJ</Label>
            <Input
              id="cnj-search"
              placeholder="Ex: 0000001-00.2023.8.26.0100"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={loading}
              className="font-mono dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
        )}

        {searchType === 'by_classe_orgao' && (
          <>
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Classe Processual</Label>
              <Select value={className} onValueChange={setClassName} disabled={loading}>
                <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  <SelectValue placeholder="Selecionar classe..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ação Ordinária</SelectItem>
                  <SelectItem value="2">Ação Sumária</SelectItem>
                  <SelectItem value="4">Mandado de Segurança</SelectItem>
                  <SelectItem value="21">Ação de Cobrança</SelectItem>
                  <SelectItem value="30">Embargos de Terceiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgao-search" className="dark:text-gray-300">Órgão Julgador</Label>
              <Input
                id="orgao-search"
                placeholder="Ex: 0100"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                disabled={loading}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </>
        )}

        {searchType === 'by_litigante' && (
          <div className="space-y-2">
            <Label htmlFor="litigante-search" className="dark:text-gray-300">Nome do Litigante</Label>
            <Input
              id="litigante-search"
              placeholder="Ex: João Silva"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={loading}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
        )}
      </div>

      {/* Search Button */}
      <div className="flex gap-2">
        <Button
          onClick={handleSearch}
          disabled={loading || !searchValue.trim()}
          className="gap-2 bg-cyan-600 hover:bg-cyan-700"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
        {searched && (
          <Button
            onClick={handleClear}
            variant="outline"
            className="dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Limpar
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {searched && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {results.length === 0 ? 'Nenhum processo encontrado' : `${results.length} processo(s) encontrado(s)`}
          </p>
          {results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((process, idx) => {
                // Extrai tribunal do número CNJ
                const cnjClean = process.numero?.replace(/\D/g, '') || '';
                const tribunalCode = cnjClean.slice(14, 19);
                const year = cnjClean.slice(9, 13);
                const sigla = TRIBUNAL_SIGLA_MAP[tribunalCode] || 'TRIB';

                return (
                  <Card
                    key={idx}
                    className="p-3 cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-all border border-cyan-300 dark:border-cyan-700"
                    onClick={() => handleSelectProcess(process)}
                  >
                    <div className="space-y-2">
                      {/* Header com número e sigla */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300">{process.numero}</p>
                        <span className="px-2 py-1 bg-cyan-600 dark:bg-cyan-700 text-white rounded text-xs font-bold">
                          {sigla}
                        </span>
                      </div>

                      {/* Assunto destaque */}
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{process.assunto}</p>

                      {/* Info secundária em linha */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
                        {year && <span><strong>Ano:</strong> {year}</span>}
                        {process.classe && <span><strong>Classe:</strong> {process.classe}</span>}
                        {process.origem && <span><strong>Origem:</strong> {process.origem}</span>}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-500">
                          {process.dataAtualizacao ? new Date(process.dataAtualizacao).toLocaleDateString('pt-BR') : 'sem data'}
                        </span>
                        {process.status && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                            {process.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}