import React from 'react';
import AdvancedSearch from '@/components/AdvancedSearch';
import RegistryLayout from '@/components/registry/RegistryLayout';

export default function AdvancedSearchPage() {
  return (
    <RegistryLayout activeTab="search" onTabChange={() => {}}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Advanced Search</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search across all your documents and digital collections with advanced filters
          </p>
        </div>
        
        <AdvancedSearch />
      </div>
    </RegistryLayout>
  );
}