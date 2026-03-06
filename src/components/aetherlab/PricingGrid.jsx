import React from 'react';
import PricingCard from './PricingCard';
import { Container, Section } from './Container';

export default function PricingGrid({ 
  plans = [],
  title = "Nossos Planos",
  cols = 3
}) {
  if (plans.length === 0) return null;

  const colClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  // Find the popular/highlighted plan
  const highlightedIndex = plans.findIndex(p => p.isPopular || p.isHighlighted);

  return (
    <Section bgColor="gray">
      <Container>
        {title && (
          <div className="mb-[50px] md:mb-[30px] xs:mb-[20px]">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              {title}
            </h2>
          </div>
        )}

        <div className={`grid ${colClasses[cols]} gap-8`}>
          {plans.map((plan, index) => (
            <PricingCard 
              key={index} 
              {...plan}
              isHighlighted={highlightedIndex === index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}