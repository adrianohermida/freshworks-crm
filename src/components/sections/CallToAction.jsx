import React from 'react';
import Button from '@/components/aetherlab/Button';

export default function CallToAction({ 
  title = "Comece Agora", 
  subtitle = "Transforme seus processos legais",
  buttonText = "Iniciar Gratuitamente",
  onButtonClick 
}) {
  return (
    <section style={{
      backgroundColor: '#F4F7FA',
      padding: 'var(--spacing-2xl) 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
        <div style={{
          position: 'relative',
          padding: '80px 0',
          borderRadius: '10px',
          backgroundColor: '#ffffff',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.075)',
          overflow: 'hidden',
          zIndex: 0,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          gap: 'var(--spacing-2xl)'
        }}>
          {/* Text Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 700,
              lineHeight: '42px',
              color: '#081828',
              margin: 0,
              marginBottom: 'var(--spacing-md)'
            }}>
              {title}
            </h2>
            
            {subtitle && (
              <p style={{
                fontSize: 'var(--font-size-lg)',
                color: '#7E57FF',
                fontWeight: 600,
                margin: 0,
                display: 'block'
              }}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Button */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Button
              variant="primary"
              size="lg"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          </div>

          {/* Background Shape */}
          <div style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '300px',
            height: '300px',
            backgroundColor: 'rgba(126, 87, 255, 0.05)',
            borderRadius: '50% 0 0 50%',
            zIndex: 0
          }} />
        </div>
      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          [data-call-to-action] {
            padding: 50px 0;
          }
          
          [data-call-to-action] > div {
            grid-template-columns: 1fr;
            padding: 50px 0;
            text-align: center;
          }
          
          [data-call-to-action] h2 {
            font-size: 25px;
            line-height: 38px;
          }
        }
        
        @media (max-width: 480px) {
          [data-call-to-action] h2 {
            font-size: 22px;
            line-height: 32px;
          }
        }
      `}</style>
    </section>
  );
}