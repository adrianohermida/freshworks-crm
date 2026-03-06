import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';

export default function ContactSelector({ onSelect, onCancel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data: result, isLoading } = useQuery({
    queryKey: ['contacts', page],
    queryFn: async () => {
      const response = await base44.functions.invoke('listContacts', { page, per_page: 20 });
      return response.data;
    }
  });

  const filteredContacts = (result?.contacts || []).filter(contact =>
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por email ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum contato encontrado</p>
          ) : (
            filteredContacts.map(contact => (
              <button
                key={contact.freshdesk_id}
                onClick={() => onSelect(contact)}
                className="w-full text-left p-2 rounded hover:bg-gray-100 border border-gray-200"
              >
                <div className="font-medium text-sm">{contact.name}</div>
                <div className="text-xs text-gray-500">{contact.email}</div>
                {contact.phone && <div className="text-xs text-gray-500">{contact.phone}</div>}
              </button>
            ))
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Página {page} de {Math.ceil((result?.count || 0) / 20)}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil((result?.count || 0) / 20)}
            >
              Próximo
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}