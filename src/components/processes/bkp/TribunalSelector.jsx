import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const TRIBUNAIS_POR_TIPO = {
  judicial_estadual: [
    { label: 'TJ - SP', value: 'tjsp' },
    { label: 'TJ - RJ', value: 'tjrj' },
    { label: 'TJ - MG', value: 'tjmg' },
    { label: 'TJ - BA', value: 'tjba' },
    { label: 'TJ - RS', value: 'tjrs' },
    { label: 'TJ - PR', value: 'tjpr' },
    { label: 'TJ - PE', value: 'tjpe' },
    { label: 'TJ - SC', value: 'tjsc' },
    { label: 'TJ - GO', value: 'tjgo' },
    { label: 'TJ - PA', value: 'tjpa' },
    { label: 'TJ - ES', value: 'tjes' },
    { label: 'TJ - CE', value: 'tjce' },
    { label: 'TJ - MA', value: 'tjma' },
    { label: 'TJ - PB', value: 'tjpb' },
    { label: 'TJ - PI', value: 'tjpi' },
    { label: 'TJ - AL', value: 'tjal' },
    { label: 'TJ - AM', value: 'tjam' },
    { label: 'TJ - RN', value: 'tjrn' },
    { label: 'TJ - RO', value: 'tjro' },
    { label: 'TJ - RR', value: 'tjrr' },
    { label: 'TJ - MS', value: 'tjms' },
    { label: 'TJ - MT', value: 'tjmt' },
    { label: 'TJ - AC', value: 'tjac' },
    { label: 'TJ - AP', value: 'tjap' },
    { label: 'TJ - TO', value: 'tjto' },
    { label: 'TJ - DF', value: 'tjdft' },
    { label: 'TJ - SE', value: 'tjse' }
  ],
  judicial_federal: [
    { label: 'TRF 1ª Região', value: 'trf1' },
    { label: 'TRF 2ª Região', value: 'trf2' },
    { label: 'TRF 3ª Região', value: 'trf3' },
    { label: 'TRF 4ª Região', value: 'trf4' },
    { label: 'TRF 5ª Região', value: 'trf5' },
    { label: 'TRF 6ª Região', value: 'trf6' }
  ],
  judicial_trabalho: [
    { label: 'TRT 1ª Região', value: 'trt1' },
    { label: 'TRT 2ª Região', value: 'trt2' },
    { label: 'TRT 3ª Região', value: 'trt3' },
    { label: 'TRT 4ª Região', value: 'trt4' },
    { label: 'TRT 5ª Região', value: 'trt5' },
    { label: 'TRT 6ª Região', value: 'trt6' },
    { label: 'TRT 7ª Região', value: 'trt7' },
    { label: 'TRT 8ª Região', value: 'trt8' },
    { label: 'TRT 9ª Região', value: 'trt9' },
    { label: 'TRT 10ª Região', value: 'trt10' },
    { label: 'TRT 11ª Região', value: 'trt11' },
    { label: 'TRT 12ª Região', value: 'trt12' },
    { label: 'TRT 13ª Região', value: 'trt13' },
    { label: 'TRT 14ª Região', value: 'trt14' },
    { label: 'TRT 15ª Região', value: 'trt15' },
    { label: 'TRT 16ª Região', value: 'trt16' },
    { label: 'TRT 17ª Região', value: 'trt17' },
    { label: 'TRT 18ª Região', value: 'trt18' },
    { label: 'TRT 19ª Região', value: 'trt19' },
    { label: 'TRT 20ª Região', value: 'trt20' },
    { label: 'TRT 21ª Região', value: 'trt21' },
    { label: 'TRT 22ª Região', value: 'trt22' },
    { label: 'TRT 23ª Região', value: 'trt23' },
    { label: 'TRT 24ª Região', value: 'trt24' }
  ],
  judicial_eleitoral: [
    { label: 'TRE - AC', value: 'tre_ac' },
    { label: 'TRE - AL', value: 'tre_al' },
    { label: 'TRE - AM', value: 'tre_am' },
    { label: 'TRE - AP', value: 'tre_ap' },
    { label: 'TRE - BA', value: 'tre_ba' },
    { label: 'TRE - CE', value: 'tre_ce' },
    { label: 'TRE - DF', value: 'tre_df' },
    { label: 'TRE - ES', value: 'tre_es' },
    { label: 'TRE - GO', value: 'tre_go' },
    { label: 'TRE - MA', value: 'tre_ma' },
    { label: 'TRE - MG', value: 'tre_mg' },
    { label: 'TRE - MS', value: 'tre_ms' },
    { label: 'TRE - MT', value: 'tre_mt' },
    { label: 'TRE - PA', value: 'tre_pa' },
    { label: 'TRE - PB', value: 'tre_pb' },
    { label: 'TRE - PE', value: 'tre_pe' },
    { label: 'TRE - PI', value: 'tre_pi' },
    { label: 'TRE - PR', value: 'tre_pr' },
    { label: 'TRE - RJ', value: 'tre_rj' },
    { label: 'TRE - RN', value: 'tre_rn' },
    { label: 'TRE - RO', value: 'tre_ro' },
    { label: 'TRE - RR', value: 'tre_rr' },
    { label: 'TRE - RS', value: 'tre_rs' },
    { label: 'TRE - SC', value: 'tre_sc' },
    { label: 'TRE - SE', value: 'tre_se' },
    { label: 'TRE - SP', value: 'tre_sp' },
    { label: 'TRE - TO', value: 'tre_to' }
  ],
  judicial_militar: [
    { label: 'TJM - SP', value: 'tjm_sp' },
    { label: 'TJM - MG', value: 'tjm_mg' },
    { label: 'TJM - RJ', value: 'tjm_rj' },
    { label: 'TJM - BA', value: 'tjm_ba' }
  ]
};

export default function TribunalSelector({ tipo, value, onChange, disabled = false }) {
  const opcoes = TRIBUNAIS_POR_TIPO[tipo] || [];

  if (opcoes.length === 0) return null;

  return (
    <div>
      <Label className="text-sm font-semibold mb-2 block">Tribunal</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {opcoes.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}