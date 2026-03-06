import React, { useMemo } from 'react';
import Card from '@/components/aetherlab/Card';
import DeadlineCard from './DeadlineCard';

export default function DeadlineList({
  deadlines = [],
  isLoading = false,
  onEdit,
  onDelete,
  onComplete,
  filters = { status: 'all', priority: 'all' }
}) {
  const filteredDeadlines = useMemo(() => {
    return deadlines.filter((d) => {
      const statusMatch = filters.status === 'all' || d.status === filters.status;
      const priorityMatch = filters.priority === 'all' || d.priority === filters.priority;
      return statusMatch && priorityMatch;
    }).sort((a, b) => new Date(a.deadline_date) - new Date(b.deadline_date));
  }, [deadlines, filters]);

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
        {[1, 2, 3].map((i) => (
          <Card key={i} variant="default" style={{ height: '200px', backgroundColor: 'var(--color-gray)', animation: 'pulse 2s infinite' }} />
        ))}
      </div>
    );
  }

  if (filteredDeadlines.length === 0) {
    return (
      <Card variant="default" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>Nenhum prazo encontrado</p>
      </Card>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
      {filteredDeadlines.map((deadline) => (
        <DeadlineCard
          key={deadline.id}
          deadline={deadline}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
}