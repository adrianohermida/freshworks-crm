import React from 'react';
import AboutFeatureItem from './AboutFeatureItem';

export default function AboutSection({
  image,
  subtitle = 'About Us',
  title = 'About Our Process',
  description = '',
  features = [],
  layout = 'side-by-side' // 'side-by-side' or 'stacked'
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: layout === 'side-by-side' ? '1fr 1fr' : '1fr',
            gap: '40px',
            alignItems: 'start'
          }}
        >
          {/* Image */}
          {image && (
            <div style={{
              width: '100%',
              order: layout === 'side-by-side' ? 0 : -1
            }}>
              <img
                src={image}
                alt="About Section"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px'
                }}
              />
            </div>
          )}

          {/* Content */}
          <div
            style={{
              paddingLeft: layout === 'side-by-side' ? '50px' : '0',
              marginTop: layout === 'side-by-side' ? '0' : '50px'
            }}
          >
            {/* Subtitle */}
            {subtitle && (
              <h4
                style={{
                  color: '#7E57FF',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '20px',
                  margin: 0,
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                {subtitle}
              </h4>
            )}

            {/* Title */}
            {title && (
              <h2
                style={{
                  fontSize: '35px',
                  fontWeight: 700,
                  lineHeight: '48px',
                  color: '#081828',
                  margin: 0,
                  marginBottom: '20px'
                }}
              >
                {title}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p
                style={{
                  fontSize: '16px',
                  marginTop: '25px',
                  color: '#727272',
                  lineHeight: '28px'
                }}
              >
                {description}
              </p>
            )}

            {/* Features List */}
            {features.length > 0 && (
              <div
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}
              >
                {features.map((feature, index) => (
                  <div key={index} style={{ width: 'calc(50% - 10px)', minWidth: '200px' }}>
                    <AboutFeatureItem
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}