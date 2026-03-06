import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Loader, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactList({ onEdit, onDelete, onAdd }) {
  const [page, setPage] = useState(1);
  const { data: contactsData = {}, isLoading, refetch } = useQuery({
    queryKey: ['contacts', page],
    queryFn: async () => {
      const response = await base44.functions.invoke('listContacts', { page, per_page: 20 });
      return response.data || {};
    }
  });

  const contacts = contactsData.contacts || [];
  const total = contactsData.total || 0;
  const totalPages = Math.ceil(total / 20);

  const handleDelete = async (contactId) => {
    if (!confirm('Tem certeza que deseja deletar este contato?')) return;

    try {
      const response = await base44.functions.invoke('deleteContact', { contact_id: contactId });
      
      if (response.data?.success) {
        toast.success('Contato deletado com sucesso!');
        refetch();
      } else {
        toast.error(response.data?.error || 'Erro ao deletar');
      }
    } catch (error) {
      toast.error('Erro: ' + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contatos</h2>
        <Button onClick={onAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Contato
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="w-6 h-6 animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            Nenhum contato disponível
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {contacts.map(contact => (
              <Card key={contact.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{contact.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(contact)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}