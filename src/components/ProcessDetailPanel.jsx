import React, { useState } from 'react';
import { X, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Card from '@/components/aetherlab/Card';

/**
 * Painel de detalhes do processo - usado no Dashboard e Processes page
 */

export default function ProcessDetailPanel({ process, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCNJ = () => {
    navigator.clipboard.writeText(process.cnj_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: { bg: 'var(--color-success)', text: 'var(--color-white)' },
      paused: { bg: 'var(--color-warning)', text: 'var(--color-white)' },
      archived: { bg: 'var(--color-border)', text: 'var(--color-heading)' },
      synchronized_error: { bg: 'var(--color-error)', text: 'var(--color-white)' }
    };
    return colors[status] || { bg: 'var(--color-border)', text: 'var(--color-heading)' };
  };

  const statusColor = getStatusColor(process.status);

  return (
    <Card variant="elevated">
      <div style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--border-radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)', gap: 'var(--spacing-md)' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, fontFamily: "'Spartan', sans-serif" }}>
              {process.title}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
              <div style={{ padding: '4px 12px', backgroundColor: statusColor.bg, color: statusColor.text, borderRadius: 'var(--border-radius-sm)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>
                {process.status}
              </div>
              {process.synced_at && (
                <div style={{ padding: '4px 12px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 'var(--border-radius-sm)', fontSize: 'var(--font-size-xs)' }}>
                  Sinc: {new Date(process.synced_at).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ 
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 'var(--spacing-sm)',
              color: 'var(--color-secondary)',
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-heading)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-secondary)'}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* CNJ Number */}
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <div style={{ backgroundColor: 'var(--color-gray)', borderRadius: 'var(--border-radius-md)', padding: 'var(--spacing-md)' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', marginBottom: 'var(--spacing-sm)', margin: 0, textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.5px' }}>Número CNJ</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <code style={{ fontSize: 'var(--font-size-sm)', fontFamily: 'monospace', color: 'var(--color-heading)', flex: 1, wordBreak: 'break-all' }}>
                {process.cnj_number}
              </code>
              <button
                onClick={handleCopyCNJ}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--spacing-sm)',
                  color: 'var(--color-primary)',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                {copied ? <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--color-success)' }} /> : <Copy style={{ width: '16px', height: '16px' }} />}
              </button>
            </div>
          </div>

          {/* Parsed Info */}
          {process.parsed_data && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
              {process.parsed_tribunal && (
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', margin: 0, textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>Tribunal</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginTop: 'var(--spacing-xs)', margin: 'var(--spacing-xs) 0 0 0' }}>{process.parsed_tribunal}</p>
                </div>
              )}
              {process.parsed_year && (
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', margin: 0, textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>Ano</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginTop: 'var(--spacing-xs)', margin: 'var(--spacing-xs) 0 0 0' }}>{process.parsed_year}</p>
                </div>
              )}
              {process.movement_count !== undefined && (
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', margin: 0, textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>Movimentos</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginTop: 'var(--spacing-xs)', margin: 'var(--spacing-xs) 0 0 0' }}>{process.movement_count || 0}</p>
                </div>
              )}
              {process.last_movement_date && (
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', margin: 0, textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>Última Atualização</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginTop: 'var(--spacing-xs)', margin: 'var(--spacing-xs) 0 0 0' }}>
                    {new Date(process.last_movement_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {process.notes && (
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--border-radius-md)', padding: 'var(--spacing-md)', border: '1px solid rgba(59, 130, 246, 0.2)', marginTop: 'var(--spacing-lg)' }}>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-info)', margin: 0 }}>{process.notes}</p>
            </div>
          )}

          {/* Status Alert */}
          {process.status === 'synchronized_error' && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--border-radius-md)', padding: 'var(--spacing-md)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
              <AlertCircle style={{ width: '16px', height: '16px', color: 'var(--color-error)', flexShrink: 0, marginTop: '4px' }} />
              <div>
                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-error)', margin: 0 }}>Erro de Sincronização</p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', marginTop: 'var(--spacing-sm)', margin: 'var(--spacing-sm) 0 0 0' }}>
                  Houve um erro ao sincronizar este processo. Tente sincronizar novamente.
                </p>
              </div>
            </div>
          )}
          </div>
          </div>
          </Card>
  );
}