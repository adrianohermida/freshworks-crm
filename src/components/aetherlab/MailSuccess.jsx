import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function MailSuccess({ 
  title = "Mensagem Enviada com Sucesso!", 
  subtitle = "Obrigado!",
  message = "Sua mensagem foi recebida. Entraremos em contato em breve.",
  onClose = () => window.history.back()
}) {
  return (
    <div className="mail-success d-table">
      <div className="d-table-cell">
        <div className="success-content">
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <CheckCircle 
              size={64} 
              style={{ color: 'var(--color-primary)' }}
              strokeWidth={1.5}
            />
          </div>
          
          <h1>{title}</h1>
          <h2>{subtitle}</h2>
          <p>{message}</p>

          <div style={{ marginTop: 'var(--spacing-xl)' }}>
            <button
              onClick={onClose}
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '30px',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'var(--transition-base)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-heading)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary)';
              }}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}