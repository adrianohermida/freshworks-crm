import React from 'react';
import Card from '@/components/aetherlab/Card';
import { RefreshCw } from 'lucide-react';

export default function ProcessCard({ process, onSelect, isSelected, onRefresh, isLoading }) {
  const getStatusColor = (status) => {
    const colors = {
      active: { bg: 'var(--color-success)', text: 'var(--color-white)' },
      archived: { bg: 'var(--color-border)', text: 'var(--color-heading)' },
      paused: { bg: 'var(--color-warning)', text: 'var(--color-white)' },
      synchronized_error: { bg: 'var(--color-error)', text: 'var(--color-white)' },
    };
    return colors[status] || { bg: 'var(--color-border)', text: 'var(--color-heading)' };
  };

  const statusColor = getStatusColor(process.status);

  return (
    <Card
      variant={isSelected ? 'elevated' : 'default'}
      style={{ 
        cursor: 'pointer',
        borderLeft: isSelected ? '4px solid var(--color-primary)' : 'none'
      }}
      onClick={onSelect}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-md)', padding: 'var(--spacing-lg)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, fontSize: 'var(--font-size-base)' }}>
            {process.title}
          </h3>
          <p style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'monospace', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)', margin: 0 }}>
            {process.cnj_number}
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginTop: 'var(--spacing-md)' }}>
            <div style={{ padding: '4px 8px', backgroundColor: statusColor.bg, color: statusColor.text, borderRadius: 'var(--border-radius-sm)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>
              {process.status}
            </div>
            {process.movement_count > 0 && (
              <div style={{ padding: '4px 8px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 'var(--border-radius-sm)', fontSize: 'var(--font-size-xs)' }}>
                {process.movement_count} mov.
              </div>
            )}
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
            disabled={isLoading}
            style={{ 
              padding: 'var(--spacing-md)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: isLoading ? 'wait' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              transition: 'all var(--transition-base)'
            }}
            title="Sincronizar"
          >
            <RefreshCw style={{ width: '16px', height: '16px', color: 'var(--color-primary)', animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        )}
      </div>
    </Card>
  );
}