import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function BrandingGuide() {
  const [copiedColor, setCopiedColor] = useState(null);

  const copyToClipboard = (text, colorId) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorId);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colors = [
    { name: 'Primary', hex: '#7E57FF', rgb: 'rgb(126, 87, 255)', description: 'Cor principal da marca' },
    { name: 'Dark', hex: '#081828', rgb: 'rgb(8, 24, 40)', description: 'Tom escuro para headers e texto' },
    { name: 'Light', hex: '#F4F7FA', rgb: 'rgb(244, 247, 250)', description: 'Fundo claro e superfícies' },
    { name: 'Primary Dark', hex: '#6B46C1', rgb: 'rgb(107, 70, 193)', description: 'Variação escura do primário' },
    { name: 'Primary Light', hex: '#E8DFFB', rgb: 'rgb(232, 223, 251)', description: 'Variação clara do primário' },
    { name: 'Border', hex: '#F4EEFB', rgb: 'rgb(244, 238, 251)', description: 'Cor para bordas' },
    { name: 'Success', hex: '#10B981', rgb: 'rgb(16, 185, 129)', description: 'Status positivo' },
    { name: 'Warning', hex: '#F59E0B', rgb: 'rgb(245, 158, 11)', description: 'Status de aviso' },
    { name: 'Error', hex: '#EF4444', rgb: 'rgb(239, 68, 68)', description: 'Status de erro' },
    { name: 'Info', hex: '#3B82F6', rgb: 'rgb(59, 130, 246)', description: 'Status informativo' },
  ];

  const typography = [
    { size: '32px', weight: '700', label: 'H1 / Heading 1', description: 'Títulos principais' },
    { size: '24px', weight: '600', label: 'H2 / Heading 2', description: 'Títulos secundários' },
    { size: '20px', weight: '600', label: 'H3 / Heading 3', description: 'Subtítulos' },
    { size: '18px', weight: '600', label: 'H4 / Heading 4', description: 'Títulos menores' },
    { size: '16px', weight: '400', label: 'Body / Paragraph', description: 'Texto corpo padrão' },
    { size: '14px', weight: '500', label: 'Button / Label', description: 'Botões e labels' },
    { size: '12px', weight: '400', label: 'Caption / Small', description: 'Texto pequeno' },
  ];

  const spacing = [
    { value: '4px', token: '--spacing-xs', description: 'Extra pequeno' },
    { value: '8px', token: '--spacing-sm', description: 'Pequeno' },
    { value: '16px', token: '--spacing-md', description: 'Médio' },
    { value: '24px', token: '--spacing-lg', description: 'Grande' },
    { value: '32px', token: '--spacing-xl', description: 'Extra grande' },
    { value: '48px', token: '--spacing-2xl', description: 'Duplo grande' },
  ];

  const borderRadius = [
    { value: '6px', token: '--border-radius-sm', description: 'Pequeno' },
    { value: '10px', token: '--border-radius-md', description: 'Médio' },
    { value: '16px', token: '--border-radius-lg', description: 'Grande' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-gray)', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: '0 0 var(--spacing-lg) 0' }}>
            Guia de Branding - Aetherlab
          </h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-body)', margin: 0 }}>
            Documentação completa do sistema de design e identidade visual da aplicação
          </p>
        </div>

        {/* Paleta de Cores */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)' }}>
            Paleta de Cores
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {colors.map((color, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: 'var(--border-radius-md)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
              }}>
                <div style={{
                  backgroundColor: color.hex,
                  height: '120px',
                  width: '100%',
                }} />
                <div style={{ padding: 'var(--spacing-lg)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: '0 0 var(--spacing-sm) 0' }}>
                    {color.name}
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0 0 var(--spacing-md) 0' }}>
                    {color.description}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    <button
                      onClick={() => copyToClipboard(color.hex, `hex-${index}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        backgroundColor: 'var(--color-light)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--border-radius-sm)',
                        cursor: 'pointer',
                        fontSize: 'var(--font-size-xs)',
                        fontFamily: 'monospace',
                        color: 'var(--color-heading)',
                        transition: 'all 250ms ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light)'}
                    >
                      {color.hex}
                      {copiedColor === `hex-${index}` ? (
                        <Check style={{ width: '14px', height: '14px', color: 'var(--color-success)' }} />
                      ) : (
                        <Copy style={{ width: '14px', height: '14px' }} />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(color.rgb, `rgb-${index}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        backgroundColor: 'var(--color-light)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--border-radius-sm)',
                        cursor: 'pointer',
                        fontSize: 'var(--font-size-xs)',
                        fontFamily: 'monospace',
                        color: 'var(--color-heading)',
                        transition: 'all 250ms ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light)'}
                    >
                      {color.rgb}
                      {copiedColor === `rgb-${index}` ? (
                        <Check style={{ width: '14px', height: '14px', color: 'var(--color-success)' }} />
                      ) : (
                        <Copy style={{ width: '14px', height: '14px' }} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tipografia */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)' }}>
            Tipografia
          </h2>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-body)', marginBottom: 'var(--spacing-lg)' }}>
            <strong>Font Family:</strong> DM Sans
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
            {typography.map((type, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: 'var(--border-radius-md)',
                boxShadow: 'var(--shadow-sm)',
                padding: 'var(--spacing-lg)',
                borderLeft: `4px solid var(--color-primary)`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                      {type.label}
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '4px 0 0 0' }}>
                      {type.description}
                    </p>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', textAlign: 'right' }}>
                    <div>{type.size}</div>
                    <div>Weight: {type.weight}</div>
                  </div>
                </div>
                <div style={{
                  fontSize: type.size,
                  fontWeight: type.weight,
                  color: 'var(--color-heading)',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  Lorem ipsum dolor sit amet
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Espaçamento */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)' }}>
            Espaçamento
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-md)' }}>
            {spacing.map((space, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: 'var(--border-radius-md)',
                boxShadow: 'var(--shadow-sm)',
                padding: 'var(--spacing-lg)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                  <div style={{
                    width: '200px',
                    height: space.value,
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'var(--border-radius-sm)',
                  }} />
                  <div>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)' }}>
                      {space.value}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                      {space.token} - {space.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)' }}>
            Border Radius
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {borderRadius.map((radius, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: 'var(--border-radius-md)',
                boxShadow: 'var(--shadow-sm)',
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: 'var(--color-primary)',
                  margin: '0 auto var(--spacing-lg) auto',
                  borderRadius: radius.value,
                }} />
                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)' }}>
                  {radius.value}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                  {radius.token}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guidelines */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)' }}>
            Diretrizes de Design
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {[
              { title: 'Tipografia', items: ['Use DM Sans em todos os textos', 'Respeite a hierarquia de tamanhos', 'Mantenha contraste de cores adequado'] },
              { title: 'Cores', items: ['Primário #7E57FF para elementos principais', 'Use tons secundários com moderação', 'Mantenha consistência de cores'] },
              { title: 'Espaçamento', items: ['Use a escala de spacing definida', 'Mantenha margem consistente de 24px', 'Espaçamento entre elementos 16px'] },
              { title: 'Componentes', items: ['Border radius mínimo de 6px', 'Sombras suaves para profundidade', 'Transições de 250ms padrão'] },
            ].map((guideline, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: 'var(--border-radius-md)',
                boxShadow: 'var(--shadow-sm)',
                padding: 'var(--spacing-lg)',
              }}>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginTop: 0 }}>
                  {guideline.title}
                </h3>
                <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)' }}>
                  {guideline.items.map((item, itemIndex) => (
                    <li key={itemIndex} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}