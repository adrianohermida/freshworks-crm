import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Alert({
  variant = 'info',
  title = '',
  message,
  closable = false,
  onClose,
  icon = null,
  className = '',
}) {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  const icons = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
  };

  const variants = {
    info: {
      backgroundColor: '#EFF6FF',
      borderColor: 'var(--color-info)',
      color: '#1e40af',
      iconColor: 'var(--color-info)',
    },
    success: {
      backgroundColor: '#F0FDF4',
      borderColor: 'var(--color-success)',
      color: '#166534',
      iconColor: 'var(--color-success)',
    },
    warning: {
      backgroundColor: '#FFFBEB',
      borderColor: 'var(--color-warning)',
      color: '#92400e',
      iconColor: 'var(--color-warning)',
    },
    error: {
      backgroundColor: '#FEF2F2',
      borderColor: 'var(--color-error)',
      color: '#991b1b',
      iconColor: 'var(--color-error)',
    },
  };

  const selectedVariant = variants[variant];

  return (
    <div
      style={{
        backgroundColor: selectedVariant.backgroundColor,
        borderLeft: `4px solid ${selectedVariant.borderColor}`,
        borderRadius: 'var(--border-radius-sm)',
        padding: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-md)',
        display: 'flex',
        gap: 'var(--spacing-md)',
        alignItems: 'flex-start',
        color: selectedVariant.color,
      }}
      className={className}
    >
      {(icon || icons[variant]) && (
        <div style={{ marginTop: '2px', flexShrink: 0 }}>
          {icon || icons[variant]}
        </div>
      )}
      
      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{
            margin: '0 0 var(--spacing-sm) 0',
            fontWeight: 'var(--font-weight-semibold)',
          }}>
            {title}
          </h4>
        )}
        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
          {message}
        </p>
      </div>
      
      {closable && (
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
            color: 'inherit',
          }}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}