import React from 'react';
import TeamMember from './TeamMember';
import { Container, Section } from './Container';
import { SPACING } from './theme/ThemeConfig';

export default function TeamGrid({ 
  members = [],
  cols = 3,
  title = null
}) {
  if (members.length === 0) return null;

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <Section>
      <Container>
        {title && (
          <div style={{ marginBottom: '50px' }} className="md:mb-[30px] xs:mb-[30px]">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              {title}
            </h2>
          </div>
        )}
        
        <div className={`grid ${colClasses[cols]} gap-8`}>
          {members.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </Container>
    </Section>
  );
}