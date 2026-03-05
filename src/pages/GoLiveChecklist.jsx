import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, AlertTriangle } from 'lucide-react';
import Card from '@/components/aetherlab/Card';
import Button from '@/components/aetherlab/Button';

export default function GoLiveChecklistPage() {
  const [checklist, setChecklist] = useState({
    infrastructure: [
      { id: 1, name: 'Database backups configurados', completed: true, critical: true },
      { id: 2, name: 'SSL/TLS certificates válidos', completed: true, critical: true },
      { id: 3, name: 'DNS e CDN configurados', completed: true, critical: false },
      { id: 4, name: 'Monitoring e alertas ativos', completed: true, critical: true },
    ],
    functionality: [
      { id: 5, name: 'Header navegação funcional', completed: true, critical: true },
      { id: 6, name: 'Autenticação end-to-end', completed: true, critical: true },
      { id: 7, name: 'Profile & Settings operacionais', completed: true, critical: true },
      { id: 8, name: 'NotificationCenter testado', completed: true, critical: false },
      { id: 9, name: 'Processos CRUD completo', completed: true, critical: true },
    ],
    security: [
      { id: 10, name: 'LGPD compliance validado', completed: true, critical: true },
      { id: 11, name: 'Rate limiting ativo', completed: true, critical: false },
      { id: 12, name: 'Input sanitization implementado', completed: true, critical: true },
      { id: 13, name: 'Error handling sem exposição', completed: true, critical: true },
    ],
    performance: [
      { id: 14, name: 'Loading indicators em todas pages', completed: false, critical: false },
      { id: 15, name: 'Caching strategies implementadas', completed: true, critical: false },
      { id: 16, name: 'Mobile responsiveness testado', completed: true, critical: true },
      { id: 17, name: 'Query performance otimizado', completed: true, critical: false },
    ],
    documentation: [
      { id: 18, name: 'README atualizado', completed: false, critical: false },
      { id: 19, name: 'API documentation completa', completed: false, critical: false },
      { id: 20, name: 'User guide preparado', completed: false, critical: false },
    ],
  });

  const toggleItem = (category, itemId) => {
    setChecklist(prev => ({
      ...prev,
      [category]: prev[category].map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const calculateProgress = () => {
    const allItems = Object.values(checklist).flat();
    const completed = allItems.filter(item => item.completed).length;
    return Math.round((completed / allItems.length) * 100);
  };

  const getReadiness = () => {
    const allItems = Object.values(checklist).flat();
    const criticalItems = allItems.filter(item => item.critical);
    const criticalCompleted = criticalItems.filter(item => item.completed);
    
    if (criticalCompleted.length === criticalItems.length) return 'GO';
    if (criticalCompleted.length > criticalItems.length * 0.8) return 'CAUTION';
    return 'STOP';
  };

  const progress = calculateProgress();
  const readiness = getReadiness();

  const categories = [
    { key: 'infrastructure', label: '🏗️ Infraestrutura', icon: '🏗️' },
    { key: 'functionality', label: '⚙️ Funcionalidades', icon: '⚙️' },
    { key: 'security', label: '🔒 Segurança', icon: '🔒' },
    { key: 'performance', label: '⚡ Performance', icon: '⚡' },
    { key: 'documentation', label: '📖 Documentação', icon: '📖' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
            Go-Live Checklist
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)' }}>
            Validação pré-produção - Sprint 13
          </p>
        </div>

        {/* Readiness Status */}
        <Card variant="default" style={{ marginBottom: 'var(--spacing-2xl)', borderTop: `4px solid ${readiness === 'GO' ? '#10B981' : readiness === 'CAUTION' ? '#F59E0B' : '#EF4444'}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2xl)', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: '600', color: 'var(--color-body)', margin: '0 0 var(--spacing-sm)' }}>
                Status de Pronto
              </h2>
              <p style={{
                fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)',
                color: readiness === 'GO' ? '#10B981' : readiness === 'CAUTION' ? '#F59E0B' : '#EF4444',
                margin: 0,
              }}>
                {readiness === 'GO' ? '🟢 GO' : readiness === 'CAUTION' ? '🟡 CAUTION' : '🔴 STOP'}
              </p>
            </div>

            <div>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-body)', margin: '0 0 var(--spacing-md)' }}>
                Progresso Geral
              </p>
              <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${progress}%`, height: '100%',
                  backgroundColor: readiness === 'GO' ? '#10B981' : readiness === 'CAUTION' ? '#F59E0B' : '#EF4444',
                  transition: 'width 0.3s',
                }} />
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-heading)', margin: 'var(--spacing-md) 0 0', textAlign: 'right' }}>
                {progress}%
              </p>
            </div>
          </div>
        </Card>

        {/* Checklist Items */}
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          {categories.map(category => {
            const items = checklist[category.key];
            const completed = items.filter(item => item.completed).length;
            const percentage = Math.round((completed / items.length) * 100);

            return (
              <Card key={category.key} variant="default">
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: '600', color: 'var(--color-heading)', margin: 0 }}>
                      {category.label}
                    </h3>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-body)' }}>
                      {completed}/{items.length}
                    </span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 0.3s' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                  {items.map(item => (
                    <label
                      key={item.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-md)',
                        backgroundColor: item.completed ? 'var(--color-primary-light)' : 'transparent',
                        cursor: 'pointer', transition: 'background 0.15s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem(category.key, item.id)}
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                      />
                      <span style={{
                        flex: 1, fontSize: 'var(--font-size-sm)',
                        color: item.completed ? 'var(--color-primary)' : 'var(--color-heading)',
                        fontWeight: item.critical ? '600' : '500',
                        textDecoration: item.completed ? 'line-through' : 'none',
                      }}>
                        {item.name}
                      </span>
                      {item.critical && (
                        <AlertTriangle style={{ width: '14px', height: '14px', color: '#F59E0B', flexShrink: 0 }} />
                      )}
                      {item.completed && (
                        <CheckCircle2 style={{ width: '18px', height: '18px', color: 'var(--color-primary)', flexShrink: 0 }} />
                      )}
                    </label>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: 'var(--spacing-2xl)', display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button variant="primary" disabled={progress < 100}>
            {progress === 100 ? '🚀 LIBERAR PARA PRODUÇÃO' : `${progress}% Completo`}
          </Button>
          <Button variant="primary">
            📋 Baixar Relatório
          </Button>
        </div>

        {/* Notes */}
        {progress < 100 && (
          <Card variant="default" style={{ marginTop: 'var(--spacing-lg)', borderLeft: '4px solid #F59E0B' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: '#F59E0B', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-heading)', margin: 0 }}>
                  Itens pendentes
                </p>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0' }}>
                  Complete todos os itens críticos antes de liberar para produção.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}