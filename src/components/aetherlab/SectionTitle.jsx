import React from 'react';

export default function SectionTitle({
  pretitle,
  title,
  description,
  alignment = 'center',
  className = '',
}) {
  const alignmentStyles = {
    center: {
      textAlign: 'center',
      paddingLeft: 0,
      paddingRight: 0,
    },
    left: {
      textAlign: 'left',
      paddingLeft: 0,
      paddingRight: '600px',
    },
    right: {
      textAlign: 'right',
      paddingLeft: '600px',
      paddingRight: 0,
    },
  };

  return (
    <div
      style={{
        textAlign: alignmentStyles[alignment]?.textAlign || 'center',
        marginBottom: 'var(--spacing-2xl)',
        paddingLeft: alignmentStyles[alignment]?.paddingLeft || 0,
        paddingRight: alignmentStyles[alignment]?.paddingRight || 0,
        position: 'relative',
        zIndex: 5,
      }}
      className={className}
    >
      {/* Pretitle */}
      {pretitle && (
        <h4
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            display: 'inline-block',
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--color-primary)',
            textTransform: 'capitalize',
          }}
        >
          {pretitle}
        </h4>
      )}

      {/* Main Title */}
      {title && (
        <h2
          style={{
            fontSize: 'var(--font-size-2xl)',
            marginBottom: 'var(--spacing-lg)',
            lineHeight: 'var(--line-height-relaxed)',
            textTransform: 'capitalize',
            position: 'relative',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-heading)',
          }}
        >
          {title}
          {alignment === 'left' && (
            <span
              style={{
                position: 'absolute',
                left: 0,
                bottom: '-8px',
                height: '2px',
                width: '50px',
                backgroundColor: 'var(--color-primary)',
                content: '""',
              }}
            />
          )}
          {alignment === 'right' && (
            <span
              style={{
                position: 'absolute',
                right: 0,
                bottom: '-8px',
                height: '2px',
                width: '50px',
                backgroundColor: 'var(--color-primary)',
                content: '""',
              }}
            />
          )}
        </h2>
      )}

      {/* Description */}
      {description && (
        <p
          style={{
            fontSize: 'var(--font-size-base)',
            lineHeight: 'var(--line-height-relaxed)',
            color: 'var(--color-body)',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}