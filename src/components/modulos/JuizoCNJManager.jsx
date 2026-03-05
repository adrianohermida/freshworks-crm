import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit2, Trash2, MapPin } from 'lucide-react';

export default function JuizoCNJManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [juizos, setJuizos] = useState([
    { codigo: '00001001', nome: '1ª Vara Cível', tribunal: 'TJSP', municipio: 'São Paulo', nível: '1º grau', tipo: 'vara', status: 'ativo' },
    { codigo: '00001002', nome: '2ª Vara Cível', tribunal: 'TJSP', municipio: 'São Paulo', nível: '1º grau', tipo: 'vara', status: 'ativo' },
    { codigo: '00001900', nome: 'Tribunal de Justiça', tribunal: 'TJSP', municipio: 'São Paulo', nível: '2º grau', tipo: 'tribunal', status: 'ativo' }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddNew = () => {
    setFormData({ nível: '1º grau', tipo: 'vara', status: 'ativo' });
    setEditingId(null);
    setOpenDialog(true);
  };

  const handleEdit = (juizo) => {
    setFormData(juizo);
    setEditingId(juizo.codigo);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editingId) {
      setJuizos(juizos.map(j => j.codigo === editingId ? { ...formData, codigo: editingId } : j));
    } else {
      setJuizos([...juizos, { ...formData, codigo: `00${Math.random().toString().slice(2, 7)}` }]);
    }
    setOpenDialog(false);
    setFormData({});
  };

  const handleDelete = (codigo) => {
    setJuizos(juizos.filter(j => j.codigo !== codigo));
  };

  const filteredJuizos = juizos.filter(j =>
    JSON.stringify(j).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <MapPin className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Gerenciador de Juízos CNJ</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">CRUD de órgãos judiciários</p>
          </div>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2 bg-indigo-600">
              <Plus className="w-4 h-4" />
              Novo Juízo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Novo'} Juízo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome do Juízo"
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
              <Select value={formData.nível || '1º grau'} onValueChange={(v) => setFormData({ ...formData, nível: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1º grau">1º Grau</SelectItem>
                  <SelectItem value="2º grau">2º Grau</SelectItem>
                  <SelectItem value="superior">Superior</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formData.tipo || 'vara'} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vara">Vara</SelectItem>
                  <SelectItem value="tribunal">Tribunal</SelectItem>
                  <SelectItem value="juizado">Juizado</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSave} className="w-full bg-indigo-600">
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
          <CardTitle className="text-base">Juízos Cadastrados ({filteredJuizos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left">Código</th>
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Tribunal</th>
                  <th className="px-4 py-2 text-left">Município</th>
                  <th className="px-4 py-2 text-left">Nível</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredJuizos.map((juizo) => (
                  <tr key={juizo.codigo} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 font-mono text-xs">{juizo.codigo}</td>
                    <td className="px-4 py-2">{juizo.nome}</td>
                    <td className="px-4 py-2">{juizo.tribunal}</td>
                    <td className="px-4 py-2">{juizo.municipio}</td>
                    <td className="px-4 py-2"><Badge variant="outline">{juizo.nível}</Badge></td>
                    <td className="px-4 py-2">
                      <Badge className={juizo.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {juizo.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-right gap-2 flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(juizo)}
                        className="gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(juizo.codigo)}
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
            <p className="text-3xl font-bold text-indigo-600">{filteredJuizos.length}</p>
            <p className="text-sm text-gray-600">Total de Juízos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{filteredJuizos.filter(j => j.nível === '1º grau').length}</p>
            <p className="text-sm text-gray-600">1º Grau</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{filteredJuizos.filter(j => j.status === 'ativo').length}</p>
            <p className="text-sm text-gray-600">Ativos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}