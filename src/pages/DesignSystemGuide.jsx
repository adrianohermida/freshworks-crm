import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function DesignSystemGuide() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ padding: 'var(--spacing-2xl)', fontFamily: 'var(--font-primary)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ 
            color: 'var(--color-heading)', 
            marginBottom: 'var(--spacing-lg)',
            fontSize: 'var(--font-size-3xl)',
            fontFamily: "'Spartan', sans-serif",
            fontWeight: '700'
          }}>
            LegalDock Design System
          </h1>
          <p style={{ 
            color: 'var(--color-body)',
            fontSize: 'var(--font-size-lg)',
            lineHeight: 'var(--line-height-relaxed)'
          }}>
            Guia completo de implementação do design system Aetherlab no projeto LegalDock
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
            Paleta de Cores
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {[
              { name: 'Primary', value: 'var(--color-primary)', hex: '#7E57FF' },
              { name: 'Primary Dark', value: 'var(--color-primary-dark)', hex: '#6b46c1' },
              { name: 'Heading', value: 'var(--color-heading)', hex: '#081828' },
              { name: 'Success', value: 'var(--color-success)', hex: '#10B981' },
              { name: 'Warning', value: 'var(--color-warning)', hex: '#F59E0B' },
              { name: 'Error', value: 'var(--color-error)', hex: '#EF4444' },
              { name: 'Border', value: 'var(--color-border)', hex: '#F4EEFB' },
              { name: 'Light', value: 'var(--color-light)', hex: '#F9F7FF' },
            ].map((color) => (
              <div 
                key={color.name}
                style={{
                  border: `1px solid var(--color-border)`,
                  borderRadius: 'var(--border-radius)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{
                  height: '80px',
                  backgroundColor: color.value,
                }}></div>
                <div style={{ padding: 'var(--spacing-md)' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--color-heading)' }}>
                    {color.name}
                  </p>
                  <code style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>
                    {color.hex}
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
            Tipografia
          </h2>
          
          <div style={{ 
            border: `1px solid var(--color-border)`,
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-lg)',
            backgroundColor: '#ffffff'
          }}>
            <h1>Heading 1 (50px)</h1>
            <h2>Heading 2 (40px)</h2>
            <h3>Heading 3 (30px)</h3>
            <h4>Heading 4 (25px)</h4>
            <h5>Heading 5 (20px)</h5>
            <h6>Heading 6 (16px)</h6>
            <p>Parágrafo (16px) - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <small style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
              Small text (14px)
            </small>
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
            Sistema de Espaçamento
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
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-md)' }}>Token</th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-md)' }}>Valor</th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-md)' }}>Exemplo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { token: '--spacing-xs', value: '4px' },
                  { token: '--spacing-sm', value: '8px' },
                  { token: '--spacing-md', value: '16px' },
                  { token: '--spacing-lg', value: '24px' },
                  { token: '--spacing-xl', value: '32px' },
                  { token: '--spacing-2xl', value: '48px' },
                ].map((space) => (
                  <tr key={space.token} style={{ borderBottom: `1px solid var(--color-border)` }}>
                    <td style={{ padding: 'var(--spacing-md)', fontFamily: 'monospace' }}>
                      {space.token}
                    </td>
                    <td style={{ padding: 'var(--spacing-md)' }}>{space.value}</td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      <div style={{ height: space.value.replace('px', '') + 'px', backgroundColor: 'var(--color-primary)', width: '60px' }}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Implementation Status */}
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{ 
            color: 'var(--color-heading)',
            fontSize: 'var(--font-size-2xl)',
            marginBottom: 'var(--spacing-lg)',
            fontFamily: "'Spartan', sans-serif"
          }}>
            Status de Implementação
          </h2>
          
          <div style={{ 
            border: `2px solid var(--color-primary)`,
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-light)'
          }}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                <span style={{ fontWeight: '600', color: 'var(--color-heading)' }}>Progresso Geral</span>
                <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>15%</span>
              </div>
              <div style={{ 
                height: '8px',
                backgroundColor: 'var(--color-border)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: '15%',
                  backgroundColor: 'var(--color-primary)',
                  transition: 'width 300ms ease'
                }}></div>
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              <h4 style={{ color: 'var(--color-heading)', marginBottom: 'var(--spacing-md)' }}>
                ✅ Concluído
              </h4>
              <ul style={{ marginLeft: 'var(--spacing-lg)' }}>
                <li>Design System variables no globals.css</li>
                <li>Layout component refatorado</li>
                <li>Footer com branding LegalDock</li>
                <li>Documentação do Design System</li>
              </ul>
            </div>

            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              <h4 style={{ color: 'var(--color-heading)', marginBottom: 'var(--spacing-md)' }}>
                🔄 Em Progresso
              </h4>
              <ul style={{ marginLeft: 'var(--spacing-lg)' }}>
                <li>Refatoração de componentes (Button, Card, Input)</li>
                <li>Header component com design system</li>
                <li>Páginas principais (Processes, Deadlines, Notifications)</li>
              </ul>
            </div>

            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              <h4 style={{ color: 'var(--color-heading)', marginBottom: 'var(--spacing-md)' }}>
                📋 Pendente
              </h4>
              <ul style={{ marginLeft: 'var(--spacing-lg)' }}>
                <li>Refatoração de todos os componentes UI</li>
                <li>Temas escuro/claro</li>
                <li>Componentes avançados (Modal, Dropdown, Toast)</li>
                <li>Guia de padrões e melhores práticas</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}