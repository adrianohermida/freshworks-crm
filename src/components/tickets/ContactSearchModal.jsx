import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactSearchModal({ isOpen, onClose, onSelectContact }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchMutation = useMutation({
    mutationFn: async (searchQuery) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }
      const response = await base44.functions.invoke('searchContacts', { query: searchQuery });
      if (response.data?.error) {
        throw new Error(response.data.error);
      }
      return response.data?.results || [];
    },
    onSuccess: (data) => {
      setResults(data);
    },
    onError: (error) => {
      toast.error('Erro na busca: ' + (error.message || 'Tente novamente'));
      setResults([]);
    }
  });

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchMutation.mutate(value);
  };

  const handleSelectContact = (contact) => {
    onSelectContact(contact);
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Buscar Contato</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por email..."
              value={query}
              onChange={handleSearch}
              disabled={searchMutation.isPending}
              autoFocus
            />
            {searchMutation.isPending && <Loader className="w-4 h-4 animate-spin" />}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.length === 0 && query.length >= 2 && !searchMutation.isPending && (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum contato encontrado</p>
            )}
            
            {results.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className="w-full text-left p-3 rounded-lg border hover:bg-blue-50 transition-colors"
              >
                <p className="font-medium text-sm">{contact.name}</p>
                <p className="text-xs text-gray-600">{contact.email}</p>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}