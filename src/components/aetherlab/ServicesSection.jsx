import React from 'react';
import ServiceCard from './ServiceCard';

export default function ServicesSection({
  title = 'Serviços',
  subtitle = 'O que oferecemos',
  description = '',
  buttonText = 'Saiba Mais',
  onButtonClick = null,
  services = []
}) {
  return (
    <section
      style={{
        position: 'relative',
        zIndex: 0,
        backgroundColor: '#F4F7FA',
        padding: '110px 0'
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Section Title */}
        {(title || subtitle) && (
          <div style={{
            textAlign: 'center',
            marginBottom: '50px',
            position: 'relative',
            zIndex: 5
          }}>
            {subtitle && (
              <h3 style={{
                fontSize: '15px',
                fontWeight: 600,
                display: 'inline-block',
                marginBottom: '20px',
                color: '#7E57FF',
                textTransform: 'capitalize',
                margin: 0
              }}>
                {subtitle}
              </h3>
            )}
            {title && (
              <h2 style={{
                fontSize: '34px',
                marginBottom: '20px',
                lineHeight: '42px',
                textTransform: 'capitalize',
                position: 'relative',
                fontWeight: 700,
                color: '#081828',
                margin: '20px 0 0 0'
              }}>
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Upper Content */}
        {description && (
          <div style={{
            paddingRight: '100px',
            marginBottom: '50px'
          }}>
            <p
              style={{
                marginTop: '20px',
                fontSize: '16px',
                color: '#727272',
                lineHeight: '28px'
              }}
            >
              {description}
            </p>

            {buttonText && (
              <div style={{ marginTop: '40px' }}>
                <button
                  onClick={onButtonClick}
                  style={{
                    display: 'inline-block',
                    textTransform: 'capitalize',
                    fontSize: '15px',
                    fontWeight: 500,
                    padding: '14px 30px',
                    backgroundColor: '#7E57FF',
                    color: '#ffffff',
                    border: 'none',
                    transition: 'all 0.4s ease',
                    borderRadius: '30px',
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#081828';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#7E57FF';
                  }}
                >
                  {buttonText}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginTop: '50px'
        }}>
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>

        {/* Empty State */}
        {services.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#727272'
          }}>
            <p>Nenhum serviço disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}