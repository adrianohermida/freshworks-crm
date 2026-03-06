import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { FileSpreadsheet, Loader } from 'lucide-react';
import Button from '@/components/aetherlab/Button';

export default function ExportToSheetsButton({ processes, disabled = false }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    if (!processes || processes.length === 0) {
      setMessage('Nenhum processo para exportar');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await base44.functions.invoke('exportProcessesToGoogleSheets', {
        processes: processes.map(p => ({
          cnj_number: p.cnj_number,
          tribunal_nome: p.tribunal_nome,
          status: p.status_repositorio,
          classe_nome: p.classe_nome,
          assunto_nome: p.assunto_nome,
          last_movement_date: p.updated_date,
          data_verificacao_datajud: p.data_verificacao_datajud,
          created_by: p.created_by,
        })),
        sheetName: 'Processos',
      });

      if (response.data.success) {
        setMessage(`✓ ${response.data.rowsExported} processos exportados!`);
        // Open the sheet
        window.open(response.data.url, '_blank');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Erro ao exportar');
      }
    } catch (err) {
      console.error('Export error:', err);
      setMessage('Erro na exportação: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
      <Button
        onClick={handleExport}
        variant="secondary"
        size="sm"
        disabled={disabled || isLoading || !processes || processes.length === 0}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
      >
        {isLoading ? (
          <>
            <Loader style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
            Exportando...
          </>
        ) : (
          <>
            <FileSpreadsheet style={{ width: '14px', height: '14px' }} />
            Google Sheets
          </>
        )}
      </Button>
      {message && (
        <p style={{
          fontSize: 'var(--font-size-xs)',
          color: message.includes('Erro') ? 'var(--color-error)' : 'var(--color-success)',
          margin: 0,
          opacity: 0.8,
        }}>
          {message}
        </p>
      )}
    </div>
  );
}