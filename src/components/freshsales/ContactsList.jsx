import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, Building2, Search, Trash2 } from 'lucide-react';
import ContactDialog from './ContactDialog';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function ContactsList({ contacts, isLoading, tenantId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.FreshsalesContact.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  });

  const filteredContacts = contacts.filter(c =>
    c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    prospect: 'bg-blue-100 text-blue-800',
    lead: 'bg-purple-100 text-purple-800',
    customer: 'bg-green-100 text-green-800',
    inactive: 'bg-slate-100 text-slate-800'
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-slate-500">Carregando contatos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Search and Add Button */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome, email ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <ContactDialog tenantId={tenantId} />
      </div>

      {/* Contacts Table */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">Nome</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">Empresa</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">Score</th>
                   <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                      Nenhum contato encontrado
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {contact.first_name} {contact.last_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Building2 className="w-4 h-4" />
                          {contact.company_name || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={statusColors[contact.status] || 'bg-slate-100'}>
                          {contact.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold text-cyan-600">
                        {contact.lead_score || 0}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                         <ContactDialog contact={contact} tenantId={tenantId} />
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="text-xs text-red-600 hover:text-red-700"
                           onClick={() => {
                             if (window.confirm('Tem certeza?')) {
                               deleteMutation.mutate(contact.id);
                             }
                           }}
                           disabled={deleteMutation.isPending}
                         >
                           <Trash2 className="w-3 h-3" />
                         </Button>
                       </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}