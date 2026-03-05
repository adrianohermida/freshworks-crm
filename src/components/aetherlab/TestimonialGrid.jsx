import React from 'react';
import TestimonialCard from './TestimonialCard';
import { Container, Section } from './Container';

export default function TestimonialGrid({ 
  testimonials = [],
  cols = 3,
  spacing = 'lg'
}) {
  if (testimonials.length === 0) return null;

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapValue = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  return (
    <Section bgColor="gray">
      <Container>
        <div className={`grid ${colClasses[cols]} ${gapValue[spacing]}`}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </Container>
    </Section>
  );
}