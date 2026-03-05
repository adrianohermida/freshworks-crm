import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { FileText, Loader } from 'lucide-react';
import Button from '@/components/aetherlab/Button';

export default function ExportPDFButton({ process, movements = [], disabled = false }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    if (!process) {
      setMessage('Nenhum processo selecionado');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await base44.functions.invoke('generateProcessPDF', {
        process: {
          cnj_number: process.cnj_number,
          title: process.title,
          tribunal_nome: process.tribunal_nome,
          classe_nome: process.classe_nome,
          assunto_nome: process.assunto_nome,
          status_repositorio: process.status_repositorio,
        },
        movements: movements.map(m => ({
          movement_date: m.movement_date,
          description: m.description,
        })),
      });

      // Convert response to blob and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Processo_${process.cnj_number.replace(/\//g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      setMessage('✓ PDF gerado com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('PDF export error:', err);
      setMessage('Erro ao gerar PDF: ' + err.message);
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
        disabled={disabled || isLoading || !process}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
      >
        {isLoading ? (
          <>
            <Loader style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
            Gerando...
          </>
        ) : (
          <>
            <FileText style={{ width: '14px', height: '14px' }} />
            PDF
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