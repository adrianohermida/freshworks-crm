import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ModuleCard from '@/components/shared/ModuleCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2, Mail, Phone, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ContactsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('contact');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '', type: 'contact', email: '', phone: '', document: '', oab_number: ''
  });
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list('-created_date', 100)
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Contact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setFormData({ name: '', type: 'contact', email: '', phone: '', document: '', oab_number: '' });
      setIsCreating(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Contact.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] })
  });

  const handleCreateContact = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    createMutation.mutate({
      ...formData,
      process_ids: []
    });
  };

  const filteredContacts = contacts.filter(c =>
    (c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeType === 'all' || c.type === activeType)
  );

  const typeColors = {
    parte: 'bg-blue-100 text-blue-800',
    cliente: 'bg-green-100 text-green-800',
    advogado: 'bg-purple-100 text-purple-800',
    contact: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="space-y-4">
      <ModuleCard 
        title="Gerenciador de Contatos"
        icon={FileText}
        action={<Button size="sm" onClick={() => setIsCreating(!isCreating)}><Plus className="w-4 h-4 mr-1" />Novo</Button>}
      >
        <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeType} onValueChange={setActiveType}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="parte">Partes</TabsTrigger>
              <TabsTrigger value="cliente">Clientes</TabsTrigger>
              <TabsTrigger value="advogado">Advogados</TabsTrigger>
              <TabsTrigger value="contact">Contatos</TabsTrigger>
            </TabsList>

            {['all', 'parte', 'cliente', 'advogado', 'contact'].map(type => (
              <TabsContent key={type} value={type} className="space-y-3">
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum contato encontrado
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredContacts.map(contact => (
                      <div key={contact.id} className="p-4 border rounded-lg bg-white hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{contact.name}</h4>
                            <Badge className={typeColors[contact.type]}>{contact.type}</Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(contact.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {contact.email}
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                            </div>
                          )}
                          {contact.oab_number && <div>OAB: {contact.oab_number}</div>}
                          {contact.document && <div>Doc: {contact.document}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

        {/* Create Form */}
        {isCreating && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
              <form onSubmit={handleCreateContact} className="space-y-3">
                <Input
                  placeholder="Nome"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded text-sm"
                >
                  <option value="contact">Contato</option>
                  <option value="parte">Parte</option>
                  <option value="cliente">Cliente</option>
                  <option value="advogado">Advogado</option>
                </select>
                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Input
                  placeholder="Telefone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <Input
                  placeholder="CPF/CNPJ"
                  value={formData.document}
                  onChange={(e) => setFormData({...formData, document: e.target.value})}
                />
                {formData.type === 'advogado' && (
                  <Input
                    placeholder="Número OAB"
                    value={formData.oab_number}
                    onChange={(e) => setFormData({...formData, oab_number: e.target.value})}
                  />
                )}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Criar</Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
                </div>
              </form>
            </div>
          )}

        </div>
      </ModuleCard>
    </div>
  );
}