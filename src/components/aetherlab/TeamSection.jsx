import React from 'react';
import TeamMember from './TeamMember';

export default function TeamSection({
  title = 'Team',
  subtitle = 'Our Team',
  teamMembers = []
}) {
  return (
    <section
      style={{
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

        {/* Team Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginTop: '50px'
        }}>
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              image={member.image}
              name={member.name}
              role={member.role}
              socialLinks={member.socialLinks || []}
            />
          ))}
        </div>

        {/* Empty State */}
        {teamMembers.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#727272'
          }}>
            <p>Nenhum membro do time disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}