import React from 'react';
import ProcessCard from './ProcessCard';

export default function ProcessListMobile({ processes, selectedId, onSelect, isLoading }) {
  if (isLoading) {
    return (
      <div style={{ padding: 'var(--spacing-md)', textAlign: 'center', color: 'var(--color-body)' }}>
        Carregando processos...
      </div>
    );
  }

  if (!processes || processes.length === 0) {
    return (
      <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--color-body)' }}>
        Nenhum processo encontrado
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 'var(--spacing-md)',
      padding: 'var(--spacing-md)',
    }}>
      {processes.map((process) => (
        <div
          key={process.id}
          onClick={() => onSelect(process)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(process)}
          style={{ cursor: 'pointer', outline: selectedId === process.id ? '2px solid var(--color-primary)' : 'none', borderRadius: 'var(--border-radius)' }}
          aria-selected={selectedId === process.id}
          aria-label={`Processo ${process.cnj_number}`}
        >
          <ProcessCard
            process={process}
            isSelected={selectedId === process.id}
            onSelect={() => onSelect(process)}
            isLoading={false}
          />
        </div>
      ))}
    </div>
  );
}