import React from 'react';
import ClientLogo from './ClientLogo';
import SectionTitle from './SectionTitle';

export default function ClientLogosSection({
  title = 'Our Clients',
  subtitle = 'Trusted By',
  description = '',
  clients = [],
  columns = 6,
  showTitle = true,
  onLogoClick
}) {
  return (
    <section
      style={{
        backgroundColor: '#F4F7FA',
        padding: '60px 0'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}
      >
        {/* Section Title */}
        {showTitle && (title || subtitle) && (
          <div style={{ marginBottom: '50px', textAlign: 'center' }}>
            <SectionTitle
              subtitle={subtitle}
              title={title}
              description={description}
            />
          </div>
        )}

        {/* Clients Grid */}
        {clients.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(calc(100% / ${Math.min(columns, clients.length)}), 1fr))`,
              gap: '0',
              alignItems: 'center'
            }}
          >
            {clients.map((client, index) => (
              <ClientLogo
                key={index}
                logo={client.logo}
                alt={client.name || 'Client Logo'}
                link={client.link}
                onLogoClick={() => onLogoClick && onLogoClick(client)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#888'
            }}
          >
            <p>No clients to display.</p>
          </div>
        )}
      </div>
    </section>
  );
}