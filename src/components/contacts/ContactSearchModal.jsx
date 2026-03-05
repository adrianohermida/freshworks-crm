import React, { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { debounce } from 'lodash';

export default function ContactSearchModal({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await base44.functions.invoke('searchContacts', { query: searchQuery });
        
        if (response.data?.success) {
          setResults(response.data.contacts || []);
        } else {
          toast.error(response.data?.error || 'Erro na busca');
        }
      } catch (error) {
        toast.error('Erro: ' + error.message);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const handleSelectContact = (contact) => {
    onSelect(contact);
    setQuery('');
    setResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Buscar Contato</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Nome ou email..."
              value={query}
              onChange={handleQueryChange}
              className="pl-10"
              autoFocus
            />
          </div>

          {loading && (
            <div className="flex justify-center py-4">
              <Loader className="w-5 h-5 animate-spin" />
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="border rounded-lg max-h-60 overflow-y-auto">
              {results.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-slate-800 border-b last:border-0"
                >
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                  {contact.phone && <p className="text-xs text-gray-500">{contact.phone}</p>}
                </button>
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <p className="text-center text-gray-500 py-4">Nenhum contato encontrado</p>
          )}

          {!query && (
            <p className="text-center text-gray-500 py-4">Digite para buscar</p>
          )}
        </div>
      </div>
    </div>
  );
}