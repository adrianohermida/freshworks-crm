import React from 'react';
import PricingTableCard from './PricingTableCard';
import SectionTitle from './SectionTitle';

export default function PricingTable({ 
  title,
  subtitle,
  description,
  plans = [],
  columns = 3,
  onSelectPlan
}) {
  if (plans.length === 0) return null;

  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="bg-[#F4F7FA] dark:bg-gray-900 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        {(title || subtitle || description) && (
          <div className="mb-16">
            <SectionTitle
              subtitle={subtitle}
              title={title}
              description={description}
              centered
            />
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className={`grid grid-cols-1 gap-8 ${columnClasses[columns] || columnClasses[3]}`}>
          {plans.map((plan, idx) => (
            <PricingTableCard
              key={idx}
              title={plan.title}
              subtitle={plan.subtitle}
              currency={plan.currency || 'R$'}
              amount={plan.amount}
              duration={plan.duration || '/mês'}
              description={plan.description}
              features={plan.features || []}
              buttonText={plan.buttonText || 'Começar Agora'}
              onButtonClick={() => onSelectPlan?.(idx, plan)}
              popular={plan.popular}
              highlighted={plan.highlighted}
            />
          ))}
        </div>
      </div>
    </section>
  );
}