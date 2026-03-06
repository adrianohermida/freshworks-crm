# 🎨 TEMPLATE FRONTEND IDEAL - BEST PRACTICES

## ESTRUTURA PADRÃO DE PÁGINA

### Anatomy Básica

```typescript
// pages/YourPage.jsx
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const YourPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const queryClient = useQueryClient();

  // ✅ DATA FETCHING
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: () => base44.entities.YourEntity.list('-created_date', 50),
    staleTime: 60000,
    retry: 2,
    onError: (error) => {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'error', message: error.message }
      }));
    }
  });

  // ✅ MUTATIONS
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.YourEntity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'success', message: 'Item criado com sucesso' }
      }));
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Page
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {isLoading && <div>Carregando...</div>}
        {items?.map((item) => (
          <div key={item.id} className="rounded-lg border p-4">
            {item.title}
          </div>
        ))}
      </main>
    </div>
  );
};

export default YourPage;
```

### Key Patterns

✅ **Data Fetching** - useQuery com React Query
✅ **Mutations** - Create/Update/Delete com feedback
✅ **Error Handling** - Toast notifications
✅ **Dark Mode** - dark: classes
✅ **Mobile-first** - Responsive breakpoints
✅ **Accessibility** - ARIA labels + keyboard nav

---

## CUSTOM HOOK PATTERN

```typescript
// hooks/useYourEntity.js
export const useYourEntity = (filters = {}) => {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['entity', filters],
    queryFn: () => base44.entities.YourEntity.filter(filters),
    staleTime: 60000
  });

  const create = useMutation({
    mutationFn: (data) => base44.entities.YourEntity.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entity'] })
  });

  return { items, isLoading, create: create.mutateAsync };
};
```

---

## BEST PRACTICES ✅

- [x] Imports organized
- [x] React Query for data
- [x] Toast notifications
- [x] Error handling
- [x] Dark mode support
- [x] Mobile-responsive
- [x] ARIA labels
- [x] Lucide icons
- [x] Tailwind CSS
- [x] Custom hooks

---

**Version:** 1.0.0 | **Status:** ✅ Production Template