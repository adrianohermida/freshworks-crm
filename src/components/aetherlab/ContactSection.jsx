import React from 'react';
import { Container, Section } from './Container';

export default function ContactSection({ 
  children
}) {
  return (
    <Section bgColor="gray">
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'start'
          }}
          className="xs:grid-cols-1 xs:gap-[40px]"
        >
          {children}
        </div>
      </Container>
    </Section>
  );
}