import React from 'react';
import FAQItem from './FAQItem';

export default function FAQAccordion({ 
  items = [],
  className = ''
}) {
  return (
    <div className={`space-y-0 ${className}`}>
      {items.map((item, idx) => (
        <FAQItem
          key={idx}
          question={item.question}
          answer={item.answer}
          defaultOpen={item.defaultOpen}
        />
      ))}
    </div>
  );
}