import React from 'react';
import PageLayout from '../components/common/PageLayout';
import AgentList from '../components/agents/AgentList';

export default function AgentsPage() {
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <AgentList />
      </div>
    </PageLayout>
  );
}