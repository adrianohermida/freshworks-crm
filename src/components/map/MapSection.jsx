import React from 'react';

export default function MapSection() {
  return (
    <section style={{
      backgroundColor: '#F4F7FA',
      paddingBottom: 'var(--spacing-2xl)',
      padding: 'var(--spacing-2xl) 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          marginBottom: 'var(--spacing-2xl)',
          color: 'var(--color-heading)',
          textAlign: 'center'
        }}>
          Onde Nos Encontrar
        </h2>

        <div style={{
          padding: 'var(--spacing-md)',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.089)',
          overflow: 'hidden'
        }}>
          <iframe
            title="Mapa de localização"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197040246971!2d-46.6560521!3d-23.5613777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce582c0b951d15%3A0x5f99f888d0000000!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890"
            style={{
              width: '100%',
              height: '450px',
              border: 'none',
              borderRadius: '6px'
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}