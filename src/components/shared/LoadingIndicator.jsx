import React from 'react';
import { Loader, Zap } from 'lucide-react';

/**
 * LoadingIndicator - Multiple loading states
 * Types: spinner, pulse, bar, skeleton
 */
export function LoadingSpinner({ size = 'md', label = 'Carregando...' }) {
  const sizeMap = {
    sm: '20px',
    md: '32px',
    lg: '48px',
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-md)',
    }}>
      <Loader
        style={{
          width: sizeMap[size], height: sizeMap[size],
          color: 'var(--color-primary)',
          animation: 'spin 1s linear infinite',
        }}
      />
      {label && (
        <p style={{
          color: 'var(--color-body)', fontSize: 'var(--font-size-sm)',
          margin: 0,
        }}>
          {label}
        </p>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Pulse effect for skeleton loading
 */
export function LoadingPulse({ width = '100%', height = '20px' }) {
  return (
    <div style={{
      width, height,
      backgroundColor: 'var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

/**
 * Progress bar for file uploads, data sync
 */
export function LoadingBar({ progress = 0, label = '' }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%', height: '6px',
        backgroundColor: 'var(--color-border)', borderRadius: '3px',
        overflow: 'hidden', marginBottom: 'var(--spacing-sm)',
      }}>
        <div style={{
          width: `${Math.min(progress, 100)}%`, height: '100%',
          backgroundColor: 'var(--color-primary)',
          transition: 'width 0.3s ease',
        }} />
      </div>
      {label && (
        <p style={{
          fontSize: 'var(--font-size-xs)', color: 'var(--color-body)',
          margin: 0, textAlign: 'center',
        }}>
          {label} {progress}%
        </p>
      )}
    </div>
  );
}

/**
 * Skeleton loader for table rows, cards
 */
export function SkeletonLoader({ rows = 3, columns = 3 }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 'var(--spacing-md)',
        }}>
          {Array.from({ length: columns }).map((_, j) => (
            <LoadingPulse key={j} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Page-level loading overlay
 */
export function PageLoading() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: '#fff', padding: 'var(--spacing-2xl)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-xl)',
      }}>
        <LoadingSpinner size="lg" label="Carregando aplicação..." />
      </div>
    </div>
  );
}