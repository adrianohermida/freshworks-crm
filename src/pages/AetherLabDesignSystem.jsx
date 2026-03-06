import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function AetherLabDesignSystem() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const colors = [
    { name: 'Primary', value: '#7E57FF', css: 'var(--color-primary)' },
    { name: 'Primary Dark', value: '#6b46c1', css: 'var(--color-primary-dark)' },
    { name: 'Primary Light', value: '#E8DFFB', css: 'var(--color-primary-light)' },
    { name: 'Heading', value: '#081828', css: 'var(--color-heading)' },
    { name: 'Body', value: '#727272', css: 'var(--color-body)' },
    { name: 'Border', value: '#F4EEFB', css: 'var(--color-border)' },
    { name: 'Light BG', value: '#F9F7FF', css: 'var(--color-light)' },
    { name: 'Success', value: '#10B981', css: 'var(--color-success)' },
    { name: 'Warning', value: '#F59E0B', css: 'var(--color-warning)' },
    { name: 'Error', value: '#EF4444', css: 'var(--color-error)' },
  ];

  const typography = [
    { size: 'H1', px: '50px', weight: '700', family: 'Spartan' },
    { size: 'H2', px: '40px', weight: '700', family: 'Spartan' },
    { size: 'H3', px: '30px', weight: '700', family: 'Spartan' },
    { size: 'H4', px: '25px', weight: '700', family: 'Spartan' },
    { size: 'Body', px: '16px', weight: '400', family: 'DM Sans' },
    { size: 'Small', px: '14px', weight: '400', family: 'DM Sans' },
  ];

  const spacing = [
    { token: '--spacing-xs', value: '4px', label: 'Extra Small' },
    { token: '--spacing-sm', value: '8px', label: 'Small' },
    { token: '--spacing-md', value: '16px', label: 'Medium' },
    { token: '--spacing-lg', value: '24px', label: 'Large' },
    { token: '--spacing-xl', value: '32px', label: 'Extra Large' },
    { token: '--spacing-2xl', value: '48px', label: '2X Large' },
  ];

  const borderRadius = [
    { token: '--border-radius-sm', value: '6px' },
    { token: '--border-radius-md', value: '10px' },
    { token: '--border-radius-lg', value: '16px' },
    { token: '--border-radius-full', value: '9999px' },
  ];

  const shadows = [
    { name: 'Shadow SM', value: '0 1px 2px rgba(0, 0, 0, 0.05)' },
    { name: 'Shadow MD', value: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    { name: 'Shadow LG', value: '0 10px 15px rgba(0, 0, 0, 0.1)' },
    { name: 'Shadow XL', value: '0 20px 25px rgba(0, 0, 0, 0.15)' },
  ];

  return (
    <div style={{ padding: 'var(--spacing-2xl)', fontFamily: 'var(--font-primary)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)', textAlign: 'center' }}>
          <h1 style={{
            color: 'var(--color-heading)',
            marginBottom: 'var(--spacing-lg)',
            fontSize: 'var(--font-size-3xl)',
            fontFamily: "'Spartan', sans-serif",
            fontWeight: '700'
          }}>
            ✨ Aetherlab Design System
          </h1>
          <p style={{
            color: 'var(--color-body)',
            fontSize: 'var(--font-size-lg)',
            lineHeight: 'var(--line-height-relaxed)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Sistema de design completo para o LegalDock • Cores, tipografia, espaçamento, componentes e muito mais
          </p>
        </div>

        {/* Color Palette */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{
            color: 'var(--color-heading)',
            fontSize: 'var(--font-size-2xl)',
            marginBottom: 'var(--spacing-lg)',
            fontFamily: "'Spartan', sans-serif"
          }}>
            🎨 Paleta de Cores
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {colors.map((color) => (
              <div
                key={color.name}
                style={{
                  border: `1px solid var(--color-border)`,
                  borderRadius: 'var(--border-radius)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'var(--transition-base)'
                }}
                onClick={() => copyToClipboard(color.value, color.name)}
                title="Clique para copiar"
              >
                <div style={{
                  height: '80px',
                  backgroundColor: color.value,
                }}></div>
                <div style={{ padding: 'var(--spacing-md)' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--color-heading)' }}>
                    {color.name}
                  </p>
                  <code style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', display: 'block' }}>
                    {color.value}
                  </code>
                  <code style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', opacity: 0.7 }}>
                    {color.css}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{
            color: 'var(--color-heading)',
            fontSize: 'var(--font-size-2xl)',
            marginBottom: 'var(--spacing-lg)',
            fontFamily: "'Spartan', sans-serif"
          }}>
            📝 Tipografia
          </h2>

          <div style={{
            border: `1px solid var(--color-border)`,
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-lg)',
            backgroundColor: '#ffffff'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid var(--color-border)` }}>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: '700', color: 'var(--color-heading)' }}>Tipo</th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: '700', color: 'var(--color-heading)' }}>Tamanho</th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: '700', color: 'var(--color-heading)' }}>Peso</th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: '700', color: 'var(--color-heading)' }}>Família</th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: '700', color: 'var(--color-heading)' }}>Exemplo</th>
                </tr>
              </thead>
              <tbody>
                {typography.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid var(--color-border)` }}>
                    <td style={{ padding: 'var(--spacing-md)', fontWeight: '600', color: 'var(--color-heading)' }}>{item.size}</td>
                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--color-body)' }}>{item.px}</td>
                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--color-body)' }}>{item.weight}</td>
                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--color-body)' }}>{item.family}</td>
                    <td style={{ padding: 'var(--spacing-md)', fontSize: item.px, fontWeight: item.weight, fontFamily: item.family }}>
                      Preview
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Spacing */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{
            color: 'var(--color-heading)',
            fontSize: 'var(--font-size-2xl)',
            marginBottom: 'var(--spacing-lg)',
            fontFamily: "'Spartan', sans-serif"
          }}>
            📐 Sistema de Espaçamento
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {spacing.map((space) => (
              <div
                key={space.token}
                style={{
                  border: `1px solid var(--color-border)`,
                  borderRadius: 'var(--border-radius)',
                  padding: 'var(--spacing-lg)',
                  backgroundColor: '#ffffff'
                }}
              >
                <p style={{ margin: '0 0 var(--spacing-md) 0', fontWeight: '600', color: 'var(--color-heading)' }}>
                  {space.label}
                </p>
                <code style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                  {space.token}
                </code>
                <div style={{ height: space.value, backgroundColor: 'var(--color-primary)', borderRadius: 'var(--border-radius-sm)', marginBottom: 'var(--spacing-sm)' }}></div>
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                  {space.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{
            color: 'var(--color-heading)',
            fontSize: 'var(--font-size-2xl)',
            marginBottom: 'var(--spacing-lg)',
            fontFamily: "'Spartan', sans-serif"
          }}>
            ⌗ Raio das Bordas
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {borderRadius.map((br) => (
              <div key={br.token} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: br.value,
                    margin: '0 auto var(--spacing-md)'
                  }}
                ></div>
                <code style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', display: 'block' }}>
                  {br.token}
                </code>
                <p style={{ margin: 'var(--spacing-xs) 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                  {br.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Shadows */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{
            color: 'var(--color-heading)',
            fontSize: 'var(--font-size-2xl)',
            marginBottom: 'var(--spacing-lg)',
            fontFamily: "'Spartan', sans-serif"
          }}>
            ⬚ Sombras
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {shadows.map((shadow) => (
              <div
                key={shadow.name}
                style={{
                  padding: 'var(--spacing-lg)',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--border-radius)',
                  boxShadow: shadow.value
                }}
              >
                <p style={{ margin: '0 0 var(--spacing-sm) 0', fontWeight: '600', color: 'var(--color-heading)' }}>
                  {shadow.name}
                </p>
                <code style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', display: 'block', wordBreak: 'break-all' }}>
                  {shadow.value}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Components */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{
            color: 'var(--color-heading)',
            fontSize: 'var(--font-size-2xl)',
            marginBottom: 'var(--spacing-lg)',
            fontFamily: "'Spartan', sans-serif"
          }}>
            🧩 Componentes Base
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
            {/* Buttons */}
            <div style={{
              border: `1px solid var(--color-border)`,
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-lg)',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ color: 'var(--color-heading)', margin: '0 0 var(--spacing-lg) 0' }}>Buttons</h3>
              <button style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '30px',
                fontWeight: '600',
                cursor: 'pointer',
                marginRight: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Primary
              </button>
              <button style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: 'var(--color-heading)',
                color: '#fff',
                border: 'none',
                borderRadius: '30px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Secondary
              </button>
            </div>

            {/* Cards */}
            <div style={{
              border: `1px solid var(--color-border)`,
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-lg)',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ color: 'var(--color-heading)', margin: '0 0 var(--spacing-lg) 0' }}>Cards</h3>
              <div style={{
                border: `1px solid var(--color-border)`,
                borderRadius: 'var(--border-radius)',
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--color-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <p style={{ color: 'var(--color-heading)', fontWeight: '600', margin: 0 }}>Card Title</p>
                <p style={{ color: 'var(--color-body)', fontSize: 'var(--font-size-sm)', margin: 'var(--spacing-sm) 0 0' }}>
                  Card content goes here
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div style={{
              border: `1px solid var(--color-border)`,
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-lg)',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ color: 'var(--color-heading)', margin: '0 0 var(--spacing-lg) 0' }}>Inputs</h3>
              <input
                type="text"
                placeholder="Placeholder text"
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'var(--font-primary)'
                }}
              />
            </div>

            {/* Badges */}
            <div style={{
              border: `1px solid var(--color-border)`,
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-lg)',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ color: 'var(--color-heading)', margin: '0 0 var(--spacing-lg) 0' }}>Badges</h3>
              <span style={{
                display: 'inline-block',
                padding: 'var(--spacing-xs) var(--spacing-md)',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                borderRadius: '20px',
                fontSize: 'var(--font-size-xs)',
                fontWeight: '600',
                marginRight: 'var(--spacing-md)'
              }}>
                Primary
              </span>
              <span style={{
                display: 'inline-block',
                padding: 'var(--spacing-xs) var(--spacing-md)',
                backgroundColor: 'var(--color-success)',
                color: '#fff',
                borderRadius: '20px',
                fontSize: 'var(--font-size-xs)',
                fontWeight: '600'
              }}>
                Success
              </span>
            </div>
          </div>
        </section>

        {/* Implementation Info */}
        <section style={{
          border: `2px solid var(--color-primary)`,
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--color-light)'
        }}>
          <h2 style={{
            color: 'var(--color-heading)',
            fontSize: 'var(--font-size-2xl)',
            marginBottom: 'var(--spacing-lg)',
            fontFamily: "'Spartan', sans-serif"
          }}>
            ✅ Informações de Implementação
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2xl)' }}>
            <div>
              <h3 style={{ color: 'var(--color-heading)', marginBottom: 'var(--spacing-md)' }}>Conceluído</h3>
              <ul style={{ marginLeft: 'var(--spacing-lg)', color: 'var(--color-body)' }}>
                <li>✅ CSS Custom Properties (Variables)</li>
                <li>✅ Paleta de cores completa</li>
                <li>✅ Sistema de espaçamento</li>
                <li>✅ Tipografia (DM Sans + Spartan)</li>
                <li>✅ Sombras e transições</li>
                <li>✅ Componentes base</li>
              </ul>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-heading)', marginBottom: 'var(--spacing-md)' }}>Pendente</h3>
              <ul style={{ marginLeft: 'var(--spacing-lg)', color: 'var(--color-body)' }}>
                <li>🔄 Temas (Dark/Light)</li>
                <li>🔄 Componentes avançados</li>
                <li>🔄 Responsividade completa</li>
                <li>🔄 Documentação de padrões</li>
                <li>🔄 Storybook integration</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}