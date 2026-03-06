import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Mail, Phone } from 'lucide-react';

export default function AdminContacts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['admin_contacts'],
    queryFn: () => base44.entities.Contact.list('-created_date', 100)
  });

  const filteredContacts = contacts.filter(c => {
    const matchSearch = c.name?.includes(searchTerm) || c.email?.includes(searchTerm) || c.document?.includes(searchTerm);
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const stats = {
    total: contacts.length,
    partes: contacts.filter(c => c.type === 'parte').length,
    clientes: contacts.filter(c => c.type === 'cliente').length,
    advogados: contacts.filter(c => c.type === 'advogado').length,
    outros: contacts.filter(c => c.type === 'contact').length
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center"><p className="text-gray-600">Carregando contatos...</p></div>;
  }

  const typeColors = {
    parte: 'bg-blue-100 text-blue-800',
    cliente: 'bg-green-100 text-green-800',
    advogado: 'bg-purple-100 text-purple-800',
    contact: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin - Contatos</h1>
          <p className="text-gray-600 mt-1">Gestão centralizada de contatos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-cyan-600">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Partes</p>
              <p className="text-3xl font-bold text-blue-600">{stats.partes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-3xl font-bold text-green-600">{stats.clientes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Advogados</p>
              <p className="text-3xl font-bold text-purple-600">{stats.advogados}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Outros</p>
              <p className="text-3xl font-bold text-gray-600">{stats.outros}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Buscar por nome, email ou documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-48"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Todos os Tipos</option>
            <option value="parte">Partes</option>
            <option value="cliente">Clientes</option>
            <option value="advogado">Advogados</option>
            <option value="contact">Outros</option>
          </select>
        </div>

        {/* Contacts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Contatos ({filteredContacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredContacts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum contato encontrado</p>
            ) : (
              <div className="space-y-2">
                {filteredContacts.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{contact.name}</p>
                      <div className="flex gap-3 mt-1 text-xs text-gray-600">
                        {contact.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {contact.email}
                          </span>
                        )}
                        {contact.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {contact.phone}
                          </span>
                        )}
                      </div>
                      {(contact.document || contact.oab_number) && (
                        <p className="text-xs text-gray-600 mt-1">
                          {contact.document && `CPF/CNPJ: ${contact.document}`}
                          {contact.oab_number && ` | OAB: ${contact.oab_number}`}
                        </p>
                      )}
                    </div>
                    <Badge className={typeColors[contact.type] || 'bg-gray-100 text-gray-800'}>
                      {contact.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}