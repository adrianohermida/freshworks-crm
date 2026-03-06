import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import Card from '@/components/aetherlab/Card';

export default function QAChecklist() {
  const [checkedItems, setCheckedItems] = useState({});

  const qaItems = {
    'Frontend Validation': [
      { id: 'ui-responsive', name: 'UI Responsivo (Mobile, Tablet, Desktop)', critical: true },
      { id: 'ui-dark-mode', name: 'Dark Mode funcional em todas as páginas', critical: false },
      { id: 'ui-accessibility', name: 'WCAG 2.1 AA compliance (contraste, labels)', critical: true },
      { id: 'ui-performance', name: 'Lighthouse score > 80', critical: true }
    ],
    'Backend Validation': [
      { id: 'api-rate-limit', name: 'Rate limiting funcionando', critical: true },
      { id: 'api-errors', name: 'Tratamento de erros completo', critical: true },
      { id: 'api-docs', name: 'Documentação OpenAPI atualizada', critical: false },
      { id: 'api-cache', name: 'Cache strategy implementada', critical: false }
    ],
    'Integration Testing': [
      { id: 'google-sheets-sync', name: 'Google Sheets sync (end-to-end)', critical: true },
      { id: 'google-calendar-sync', name: 'Google Calendar event creation', critical: true },
      { id: 'data-integrity', name: 'Data integrity validation', critical: true },
      { id: 'error-recovery', name: 'Error recovery (retry logic)', critical: true }
    ],
    'Security': [
      { id: 'xss-protection', name: 'XSS prevention (input sanitization)', critical: true },
      { id: 'csrf-protection', name: 'CSRF token validation', critical: true },
      { id: 'auth-validation', name: 'Authentication & authorization checks', critical: true },
      { id: 'data-encryption', name: 'Sensitive data encryption at rest', critical: true }
    ]
  };

  const toggleCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getCompletionStats = () => {
    let total = 0;
    let checked = 0;
    Object.values(qaItems).forEach(section => {
      section.forEach(item => {
        total++;
        if (checkedItems[item.id]) checked++;
      });
    });
    return { total, checked, percentage: Math.round((checked / total) * 100) };
  };

  const stats = getCompletionStats();

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            ✅ QA Testing Checklist
          </h1>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            Sprint 38 Quality Assurance - {stats.checked}/{stats.total} itens completados
          </p>
          
          {/* PROGRESS BAR */}
          <div style={{
            height: '8px',
            backgroundColor: 'var(--color-border)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: 'var(--color-success)',
              width: `${stats.percentage}%`,
              transition: 'width 300ms ease'
            }} />
          </div>
          
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
            {stats.percentage}% Completo
          </div>
        </div>

        {/* SECTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {Object.entries(qaItems).map(([sectionName, items]) => (
            <Card key={sectionName} variant="elevated">
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
                🔍 {sectionName}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      padding: 'var(--spacing-md)',
                      backgroundColor: checkedItems[item.id] ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-light)',
                      borderRadius: 'var(--border-radius-md)',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                      borderLeft: `4px solid ${item.critical ? 'var(--color-error)' : 'var(--color-border)'}`
                    }}
                  >
                    {checkedItems[item.id] ? (
                      <CheckCircle2 style={{ width: '24px', height: '24px', color: 'var(--color-success)', flexShrink: 0 }} />
                    ) : (
                      <Circle style={{ width: '24px', height: '24px', color: 'var(--color-border)', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: 'var(--font-size-base)',
                        color: 'var(--color-heading)',
                        margin: 0,
                        textDecoration: checkedItems[item.id] ? 'line-through' : 'none'
                      }}>
                        {item.name}
                      </p>
                    </div>
                    {item.critical && (
                      <span style={{ padding: '4px 8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', borderRadius: '4px' }}>
                        CRITICAL
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* SUMMARY */}
        <Card variant="default" style={{ marginTop: 'var(--spacing-2xl)', backgroundColor: stats.percentage === 100 ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-light)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            📊 Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Status
              </p>
              <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: stats.percentage === 100 ? 'var(--color-success)' : 'var(--color-warning)', margin: 0 }}>
                {stats.percentage === 100 ? '✅ READY' : '⏳ IN PROGRESS'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Completion
              </p>
              <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', margin: 0 }}>
                {stats.checked}/{stats.total}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}