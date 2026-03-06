import React from 'react';
import PricingCard from './PricingCard';

export default function PricingSection({
  title = 'Pricing',
  subtitle = 'Our Plans',
  pricingPlans = [],
  onPlanSelect = null
}) {
  return (
    <section
      style={{
        backgroundColor: '#F4F7FA',
        padding: '110px 0',
        position: 'relative'
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

        {/* Pricing Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginTop: '40px'
        }}>
          {pricingPlans.map((plan, index) => (
            <div key={index} style={{ display: 'flex' }}>
              <PricingCard
                title={plan.title}
                subtitle={plan.subtitle}
                price={plan.price}
                currency={plan.currency || 'R$'}
                duration={plan.duration || '/mês'}
                features={plan.features || []}
                buttonText={plan.buttonText || 'Começar'}
                onButtonClick={() => onPlanSelect && onPlanSelect(plan)}
                isPopular={plan.isPopular}
                isFeatured={plan.isFeatured}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {pricingPlans.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#727272'
          }}>
            <p>Nenhum plano de preços disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}