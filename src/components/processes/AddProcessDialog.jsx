import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import Button from '@/components/aetherlab/Button';

// Parsing completo de CNJ - aceita com ou sem pontuação
const parseAndValidateCNJ = (cnjNumber) => {
  // Remove qualquer caractere que não seja dígito
  const clean = cnjNumber.replace(/\D/g, '');
  
  // CNJ deve ter exatamente 20 dígitos
  if (clean.length !== 20) return null;
  
  // Formato padrão: NNNNNNN-DD.AAAA.J.TT.OOOO
  const formatted = `${clean.slice(0, 7)}-${clean.slice(7, 9)}.${clean.slice(9, 13)}.${clean.slice(13, 14)}.${clean.slice(14, 16)}.${clean.slice(16, 20)}`;
  
  // Validar padrão
  const pattern = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/;
  if (!pattern.test(formatted)) return null;
  
  // Extração dos componentes
  const sequencial = clean.slice(0, 7);
  const digitos = clean.slice(7, 9);
  const ano = clean.slice(9, 13);
  const segmento = clean.slice(13, 14);
  const tribunal = clean.slice(14, 16); // Apenas 2 dígitos para tribunal
  const origem = clean.slice(16, 20);
  
  return {
    formatted,
    sequencial,
    digitos,
    ano,
    segmento,
    tribunal,
    origem,
    isValid: true
  };
};

// Mapa de tribunais por código
const TRIBUNAL_MAP = {
  '00001': { nome: 'STF', sigla: 'STF', nivel: 'superior', alias: 'stf' },
  '00002': { nome: 'STJ', sigla: 'STJ', nivel: 'superior', alias: 'stj' },
  '00003': { nome: 'TST', sigla: 'TST', nivel: 'superior', alias: 'tst' },
  '00011': { nome: 'TRF 1ª Região', sigla: 'TRF1', nivel: '2º_grau', alias: 'trf1' },
  '00012': { nome: 'TRF 2ª Região', sigla: 'TRF2', nivel: '2º_grau', alias: 'trf2' },
  '00013': { nome: 'TRF 3ª Região', sigla: 'TRF3', nivel: '2º_grau', alias: 'trf3' },
  '00014': { nome: 'TRF 4ª Região', sigla: 'TRF4', nivel: '2º_grau', alias: 'trf4' },
  '00015': { nome: 'TRF 5ª Região', sigla: 'TRF5', nivel: '2º_grau', alias: 'trf5' },
  '00016': { nome: 'TRF 6ª Região', sigla: 'TRF6', nivel: '2º_grau', alias: 'trf6' },
  '00035': { nome: 'TJ São Paulo', sigla: 'TJSP', nivel: '2º_grau', alias: 'tjsp' }
};

export default function AddProcessDialog({ isOpen, onClose, onAdd = () => {}, isLoading = false }) {
  const [cnj_number, setCnjNumber] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tribunalInfo, setTribunalInfo] = useState(null);
  const [cnjValidation, setCnjValidation] = useState(null);
  const [parsedInfo, setParsedInfo] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [datajudData, setDatajudData] = useState(null);
  const [useManualInput, setUseManualInput] = useState(false);
  const [datajudError, setDatajudError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Buscar detalhes do processo no DataJud com retry
  const fetchProcessDetails = async (cnjFormatted, tribunal) => {
    if (!tribunal) return;
    
    setFetchingDetails(true);
    setDatajudError(false);
    let retries = 3;
    
    while (retries > 0) {
      try {
        const response = await base44.functions.invoke('datajudFetchProcess', {
          cnj_number: cnjFormatted
        });
        
        if (response.data) {
          setDatajudData(response.data);
          // Auto-preencher título se vazio
          if (!title && response.data.datajud_data?.assunto) {
            setTitle(response.data.datajud_data.assunto);
          }
          setFetchingDetails(false);
          return;
        }
      } catch (err) {
        retries--;
        if (retries === 0) {
          setDatajudError(true);
          console.log('DataJud não respondeu após 3 tentativas');
        } else {
          // Aguarda 1 segundo antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    setFetchingDetails(false);
  };

  // Validar e detectar tribunal automaticamente (apenas parsing, sem fetch automático)
  const handleCnjChange = (value) => {
    setCnjNumber(value);
    setError('');
    setSuccess('');
    setDatajudData(null);
    
    const parsed = parseAndValidateCNJ(value);
    if (parsed) {
      setCnjValidation(parsed);
      const tribunal = TRIBUNAL_MAP[parsed.tribunal];
      setTribunalInfo(tribunal);
      setParsedInfo({
        ano: parsed.ano,
        tribunal: tribunal?.nome || 'Tribunal desconhecido',
        segmento: parsed.segmento
      });
      
      // NÃO buscar automaticamente - deixar o usuário decidir se quer detalhes completos
    } else {
      setCnjValidation(null);
      setTribunalInfo(null);
      setParsedInfo(null);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setSubmitted(true);

    // Validações
    if (!cnj_number.trim()) {
      setError('✗ Número do processo é obrigatório');
      return;
    }

    if (!cnjValidation || !cnjValidation.isValid) {
      setError('✗ Número CNJ inválido. Use formato: 0000001-00.0000.0.00.0000 ou 00000010000000000000');
      return;
    }

    if (title.trim().length > 0 && title.trim().length < 5) {
      setError('✗ Descrição deve ter pelo menos 5 caracteres');
      return;
    }

    if (title.trim().length > 500) {
      setError('✗ Descrição deve ter no máximo 500 caracteres');
      return;
    }

    try {
      const payload = {
        cnj_number: cnjValidation.formatted,
        title: title.trim()
      };

      await onAdd(payload);

      setSuccess(`✓ Processo sincronizado com sucesso!`);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage = err?.message || err?.response?.data?.error || 'Erro ao sincronizar processo';
      setError(`✗ ${errorMessage}`);
    }
  };

  const resetForm = () => {
    setCnjNumber('');
    setTitle('');
    setTribunalInfo(null);
    setCnjValidation(null);
    setParsedInfo(null);
    setDatajudData(null);
    setFetchingDetails(false);
    setDatajudError(false);
    setUseManualInput(false);
    setSuccess('');
    setSubmitted(false);
  };

  const handleOpenChange = (open) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const handleRetryDataJud = async () => {
    if (cnjValidation?.formatted) {
      const tribunal = TRIBUNAL_MAP[cnjValidation.tribunal];
      await fetchProcessDetails(cnjValidation.formatted, tribunal);
    }
  };



  return (
    <div style={{ display: isOpen ? 'flex' : 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, alignItems: 'center', justifyContent: 'center' }} onClick={() => handleOpenChange(false)}>
      <div style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--border-radius-lg)', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--spacing-xl)', boxShadow: 'var(--shadow-xl)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, fontFamily: "'Spartan', sans-serif" }}>Adicionar Novo Processo</h2>
          <button onClick={() => handleOpenChange(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--font-size-2xl)', color: 'var(--color-secondary)' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--border-radius-md)', padding: 'var(--spacing-md)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: 'var(--spacing-md)' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--color-error)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-error)', margin: 0 }}>{error}</p>
            </div>
          )}

          {success && (
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--border-radius-md)', padding: 'var(--spacing-md)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', gap: 'var(--spacing-md)' }}>
              <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success)', margin: 0 }}>{success}</p>
            </div>
          )}

          {/* CNJ Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)' }}>
              Número do Processo (CNJ) *
            </label>
            <input
              type="text"
              placeholder="Com ou sem pontuação: 0000001-00.0000.0.00.0000 ou 00000010000000000000"
              value={cnj_number}
              onChange={(e) => handleCnjChange(e.target.value)}
              disabled={isLoading || fetchingDetails}
              maxLength="27"
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                borderRadius: 'var(--border-radius-md)',
                border: cnjValidation?.isValid ? '2px solid var(--color-success)' : cnj_number && !cnjValidation ? '2px solid var(--color-error)' : '1px solid var(--color-border)',
                fontSize: 'var(--font-size-sm)',
                fontFamily: 'monospace',
                backgroundColor: cnjValidation?.isValid ? 'rgba(16, 185, 129, 0.05)' : cnj_number && !cnjValidation ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-white)',
                color: 'var(--color-heading)',
                transition: 'all var(--transition-base)',
              }}
              aria-label="Número do processo CNJ"
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', margin: 0 }}>
                20 dígitos (com ou sem pontuação)
              </p>
              {cnjValidation?.isValid && (
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', fontWeight: 'var(--font-weight-semibold)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <CheckCircle2 style={{ width: '12px', height: '12px' }} /> Válido
                </span>
              )}
              {cnj_number && !cnjValidation && (
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', fontWeight: 'var(--font-weight-semibold)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <AlertCircle style={{ width: '12px', height: '12px' }} /> Inválido
                </span>
              )}
            </div>
          </div>

          {/* Tribunal Info */}
          {tribunalInfo && parsedInfo && (
            <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', margin: 0, fontWeight: 'var(--font-weight-semibold)' }}>Tribunal</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-info)', marginTop: 'var(--spacing-xs)', margin: 'var(--spacing-xs) 0 0 0' }}>{tribunalInfo.nome}</p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', margin: 0, fontWeight: 'var(--font-weight-semibold)' }}>Sigla</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-info)', marginTop: 'var(--spacing-xs)', margin: 'var(--spacing-xs) 0 0 0' }}>{tribunalInfo.sigla}</p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', margin: 0, fontWeight: 'var(--font-weight-semibold)' }}>Ano</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-info)', marginTop: 'var(--spacing-xs)', margin: 'var(--spacing-xs) 0 0 0' }}>{parsedInfo.ano}</p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', margin: 0, fontWeight: 'var(--font-weight-semibold)' }}>Nível</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-info)', marginTop: 'var(--spacing-xs)', margin: 'var(--spacing-xs) 0 0 0' }}>{tribunalInfo.nivel}</p>
                </div>
              </div>
            </div>
          )}

          {/* Opcional: Buscar detalhes completos do DataJud */}
          {cnjValidation?.isValid && !datajudData && !fetchingDetails && !datajudError && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-700 space-y-3">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                📋 Deseja carregar detalhes completos?
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Buscar movimentos, assunto e outros dados na API DataJud (opcional).
              </p>
              <Button
                size="sm"
                onClick={handleRetryDataJud}
                variant="outline"
                className="w-full dark:border-blue-600"
              >
                🔍 Carregar Detalhes do DataJud
              </Button>
            </div>
          )}

          {/* Loading DataJud */}
          {fetchingDetails && cnjValidation?.isValid && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/40 rounded-lg border border-yellow-200 dark:border-yellow-700 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">Buscando detalhes do processo no DataJud...</p>
            </div>
          )}

          {/* DataJud Error - Offer Fallback Options */}
          {datajudError && cnjValidation?.isValid && !useManualInput && (
            <div className="p-4 bg-red-50 dark:bg-red-900/40 rounded-lg border border-red-200 dark:border-red-700 space-y-3">
              <p className="text-sm font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                DataJud indisponível no momento
              </p>
              <p className="text-xs text-red-800 dark:text-red-200">
                Não conseguimos buscar os dados do processo. Você pode continuar com os dados parseados do CNJ.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRetryDataJud}
                  disabled={fetchingDetails}
                  className="dark:border-red-600 w-full"
                >
                  {fetchingDetails ? 'Tentando...' : '🔄 Tentar Novamente'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setDatajudError(false)}
                  variant="outline"
                  className="w-full"
                >
                  ✓ Continuar sem DataJud
                </Button>
              </div>
            </div>
          )}

          {/* DataJud Success */}
          {datajudData && !fetchingDetails && !useManualInput && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/40 rounded-lg border border-purple-200 dark:border-purple-700 space-y-3">
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> ✓ Dados encontrados no DataJud
              </p>
              <div className="space-y-1 bg-white/50 dark:bg-black/20 rounded p-2">
                {datajudData.datajud_data?.assunto && (
                  <p className="text-xs text-purple-800 dark:text-purple-200">
                    <span className="font-semibold">Assunto:</span> {datajudData.datajud_data.assunto}
                  </p>
                )}
                {datajudData.datajud_data?.origem && (
                  <p className="text-xs text-purple-800 dark:text-purple-200">
                    <span className="font-semibold">Origem:</span> {datajudData.datajud_data.origem}
                  </p>
                )}
                {datajudData.movement_count > 0 && (
                  <p className="text-xs text-purple-800 dark:text-purple-200">
                    <span className="font-semibold">Movimentos:</span> {datajudData.movement_count}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUseManualInput(true)}
                className="w-full dark:border-purple-600"
              >
                Editar Informações
              </Button>
            </div>
          )}

          {/* Manual Input Mode */}
          {useManualInput && cnjValidation?.isValid && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/40 rounded-lg border border-amber-200 dark:border-amber-700 space-y-3">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                📝 Modo Manual - Preencha os detalhes do processo
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setUseManualInput(false);
                  if (datajudError) handleRetryDataJud();
                }}
                className="w-full dark:border-amber-600"
              >
                ← Voltar para Busca Automática
              </Button>
            </div>
          )}

          {/* Description */}
          {(!datajudData || useManualInput) && cnjValidation?.isValid && (
            <div className="space-y-2">
              <Label htmlFor="title" className="dark:text-gray-300 font-semibold flex items-center gap-2">
                Descrição (Opcional)
              </Label>
              <Textarea
                id="title"
                placeholder="Ex: Ação de cobrança, Recurso extraordinário, etc."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (submitted) setError('');
                }}
                disabled={isLoading || fetchingDetails}
                maxLength="500"
                rows={3}
                className={`dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  submitted && !title.trim() ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : ''
                }`}
                aria-label="Descrição do processo"
              />
              <div className="flex items-center justify-between">
                <p className={`text-xs ${title.length > 450 ? 'text-orange-600' : 'text-gray-500'}`}>
                  {title.length}/500 caracteres
                </p>
                {title.length >= 5 && title.length <= 500 && (
                  <span className="text-xs text-green-600">✓ Válido</span>
                )}
              </div>
            </div>
          )}

          {/* Ready to Submit */}
          {cnjValidation?.isValid && !fetchingDetails && !datajudError && (
            <div className="p-4 bg-green-50 dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-700 space-y-2">
              <p className="text-sm text-green-800 dark:text-green-200">
                <span className="font-semibold">✓ Dados Parseados e Validados:</span> <span className="font-mono text-xs">{cnjValidation.formatted}</span>
              </p>
              {datajudData && (
                <p className="text-xs text-green-700 dark:text-green-300">
                  📊 Detalhes do DataJud carregados com sucesso
                </p>
              )}
              {!datajudData && (
                <p className="text-xs text-green-700 dark:text-green-300">
                  💡 Você pode carregar detalhes adicionais do DataJud ou sincronizar agora
                </p>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={() => handleOpenChange(false)}
            disabled={isLoading || fetchingDetails}
            style={{
              padding: '10px 24px',
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius-md)',
              color: 'var(--color-heading)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: isLoading || fetchingDetails ? 'not-allowed' : 'pointer',
              opacity: isLoading || fetchingDetails ? 0.5 : 1,
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={(e) => !isLoading && !fetchingDetails && (e.target.style.backgroundColor = 'var(--color-gray)')}
            onMouseLeave={(e) => !isLoading && !fetchingDetails && (e.target.style.backgroundColor = 'var(--color-white)')}
          >
            Cancelar
          </button>
          {cnjValidation?.isValid && !fetchingDetails && (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                padding: '10px 24px',
                backgroundColor: 'var(--color-primary)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                color: 'var(--color-white)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all var(--transition-base)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = 'var(--color-primary-dark)')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = 'var(--color-primary)')}
            >
              {isLoading && <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />}
              {isLoading ? 'Sincronizando...' : 'Sincronizar Processo'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}