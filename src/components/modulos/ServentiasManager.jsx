import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit2, Trash2, Building2 } from 'lucide-react';

export default function ServentiasManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [serventias, setServentias] = useState([
    { codigo: '00001', nome: 'Cartório Distribuidor TJSP', tribunal: 'TJSP', municipio: 'São Paulo', tipo: 'distribuidor', telefone: '(11) 3000-0000', status: 'ativo' },
    { codigo: '00002', nome: 'Cartório Executor', tribunal: 'TJSP', municipio: 'São Paulo', tipo: 'executor', telefone: '(11) 3000-0001', status: 'ativo' },
    { codigo: '00003', nome: 'Cartório Escrivão', tribunal: 'TJSP', municipio: 'Campinas', tipo: 'escrivao', telefone: '(19) 3000-0000', status: 'ativo' }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddNew = () => {
    setFormData({ tipo: 'distribuidor', status: 'ativo' });
    setEditingId(null);
    setOpenDialog(true);
  };

  const handleEdit = (serventia) => {
    setFormData(serventia);
    setEditingId(serventia.codigo);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editingId) {
      setServentias(serventias.map(s => s.codigo === editingId ? { ...formData, codigo: editingId } : s));
    } else {
      setServentias([...serventias, { ...formData, codigo: `00${Math.random().toString().slice(2, 5)}` }]);
    }
    setOpenDialog(false);
    setFormData({});
  };

  const handleDelete = (codigo) => {
    setServentias(serventias.filter(s => s.codigo !== codigo));
  };

  const filteredServentias = serventias.filter(s =>
    JSON.stringify(s).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Gerenciador de Serventias</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">CRUD de cartórios e serventias</p>
          </div>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2 bg-purple-600">
              <Plus className="w-4 h-4" />
              Nova Serventia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Nova'} Serventia</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome da Serventia"
                value={formData.nome || ''}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
              <Input
                placeholder="Tribunal (ex: TJSP)"
                value={formData.tribunal || ''}
                onChange={(e) => setFormData({ ...formData, tribunal: e.target.value })}
              />
              <Input
                placeholder="Município"
                value={formData.municipio || ''}
                onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
              />
              <Input
                placeholder="Telefone"
                value={formData.telefone || ''}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
              <Input
                placeholder="Email (opcional)"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Select value={formData.tipo || 'distribuidor'} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distribuidor">Distribuidor</SelectItem>
                  <SelectItem value="executor">Executor</SelectItem>
                  <SelectItem value="escrivao">Escrivão</SelectItem>
                  <SelectItem value="contador">Contador</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSave} className="w-full bg-purple-600">
                {editingId ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-gray-400 mt-2" />
            <Input
              placeholder="Buscar por nome, tribunal ou município..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Serventias Cadastradas ({filteredServentias.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left">Código</th>
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Tribunal</th>
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Telefone</th>
                  <th className="px-4 py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredServentias.map((serventia) => (
                  <tr key={serventia.codigo} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 font-mono text-xs">{serventia.codigo}</td>
                    <td className="px-4 py-2">{serventia.nome}</td>
                    <td className="px-4 py-2">{serventia.tribunal}</td>
                    <td className="px-4 py-2"><Badge variant="outline">{serventia.tipo}</Badge></td>
                    <td className="px-4 py-2 text-xs">{serventia.telefone}</td>
                    <td className="px-4 py-2 text-right gap-2 flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(serventia)}
                        className="gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(serventia.codigo)}
                        className="gap-1 text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{filteredServentias.length}</p>
            <p className="text-sm text-gray-600">Total de Serventias</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{filteredServentias.filter(s => s.tipo === 'distribuidor').length}</p>
            <p className="text-sm text-gray-600">Distribuidoras</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{filteredServentias.filter(s => s.status === 'ativo').length}</p>
            <p className="text-sm text-gray-600">Ativas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}