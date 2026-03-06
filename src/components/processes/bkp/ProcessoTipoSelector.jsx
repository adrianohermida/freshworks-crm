import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

const TIPOS_PROCESSO = {
  extrajudicial: {
    label: 'Extrajudicial',
    options: [
      { value: 'cejusc', label: 'CEJUSC - Mediação/Conciliação' },
      { value: 'procon', label: 'Denúncia PROCON' },
      { value: 'reclamacao_pre_processual', label: 'Reclamação Pré-Processual' },
      { value: 'denuncia_bacen', label: 'Denúncia BACEN' },
      { value: 'denuncia_cvm', label: 'Denúncia CVM' },
    ]
  },
  estadual: {
    label: 'Justiça Estadual',
    options: [
      { value: 'judicial_estadual', label: 'Processo Estadual (TJ)' }
    ]
  },
  federal: {
    label: 'Justiça Federal',
    options: [
      { value: 'judicial_federal', label: 'Processo Federal (TRF)' }
    ]
  },
  trabalho: {
    label: 'Justiça do Trabalho',
    options: [
      { value: 'judicial_trabalho', label: 'Processo Trabalhista (TRT)' }
    ]
  },
  eleitoral: {
    label: 'Justiça Eleitoral',
    options: [
      { value: 'judicial_eleitoral', label: 'Processo Eleitoral (TRE)' }
    ]
  },
  militar: {
    label: 'Justiça Militar',
    options: [
      { value: 'judicial_militar', label: 'Processo Militar (TJM)' }
    ]
  },
  superior: {
    label: 'Tribunais Superiores',
    options: [
      { value: 'stj', label: 'STJ - Superior Tribunal de Justiça' },
      { value: 'stf', label: 'STF - Supremo Tribunal Federal' },
      { value: 'tst', label: 'TST - Tribunal Superior do Trabalho' },
      { value: 'tse', label: 'TSE - Tribunal Superior Eleitoral' }
    ]
  }
};

export default function ProcessoTipoSelector({ value, onChangeJurisdicao, onChangeTipo }) {
  const [jurisdicao, setJurisdicao] = React.useState('extrajudicial');

  const handleJurisdicaoChange = (novaJurisdicao) => {
    setJurisdicao(novaJurisdicao);
    if (onChangeJurisdicao) onChangeJurisdicao(novaJurisdicao);
    // Reset tipo
    const opcoes = TIPOS_PROCESSO[novaJurisdicao]?.options;
    if (opcoes && opcoes[0] && onChangeTipo) {
      onChangeTipo(opcoes[0].value);
    }
  };

  const handleTipoChange = (novoTipo) => {
    if (onChangeTipo) onChangeTipo(novoTipo);
  };

  const opcoesJurisdicao = Object.entries(TIPOS_PROCESSO).map(([key, data]) => ({
    value: key,
    label: data.label
  }));

  const opcoesAtivas = TIPOS_PROCESSO[jurisdicao]?.options || [];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 flex gap-2">
         <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
         <p className="text-xs text-blue-700 dark:text-blue-300">
           Selecione a esfera de atuação (extrajudicial ou judicial) e o tipo de processo
         </p>
       </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-semibold mb-2 block">Jurisdição</Label>
          <Select value={jurisdicao} onValueChange={handleJurisdicaoChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {opcoesJurisdicao.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">Tipo de Processo</Label>
          <Select value={value} onValueChange={handleTipoChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {opcoesAtivas.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}