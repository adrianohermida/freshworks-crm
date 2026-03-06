import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, RefreshCw, Database } from 'lucide-react';

export default function BibliotecaCNJ() {
  const [activeTab, setActiveTab] = useState('classes');
  const [searchTerm, setSearchTerm] = useState('');
  const [syncStatus, setSyncStatus] = useState('idle');

  const classes = [
    { id: 1, code: 1, name: 'Ação de Consignação em Pagamento', ramo: 'Cível' },
    { id: 2, code: 2, name: 'Ação de Depósito', ramo: 'Cível' },
    { id: 3, code: 3, name: 'Ação Monitória', ramo: 'Cível' },
    { id: 4, code: 100, name: 'Ação Penal Privada', ramo: 'Penal' },
    { id: 5, code: 101, name: 'Ação Penal Pública', ramo: 'Penal' }
  ];

  const subjects = [
    { id: 1, code: 1, name: 'Direito Civil', ramo: 'Cível' },
    { id: 2, code: 2, name: 'Direito Penal', ramo: 'Penal' },
    { id: 3, code: 3, name: 'Direito Trabalhista', ramo: 'Trabalhista' },
    { id: 4, code: 4, name: 'Direito Administrativo', ramo: 'Administrativo' }
  ];

  const movements = [
    { id: 1, code: 1001, name: 'Ajuizamento', categoria: 'Magistrado' },
    { id: 2, code: 2000, name: 'Sentença', categoria: 'Magistrado' },
    { id: 3, code: 2001, name: 'Despacho', categoria: 'Magistrado' },
    { id: 4, code: 3000, name: 'Intimação', categoria: 'Serventuário' }
  ];

  const handleSync = async () => {
    setSyncStatus('syncing');
    await new Promise(r => setTimeout(r, 2000));
    setSyncStatus('done');
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const TableView = ({ data, columns }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 dark:bg-gray-700">
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-2 text-left font-semibold">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.filter(item =>
            JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
          ).map((item, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
              {Object.values(item).map((val, i) => (
                <td key={i} className="px-4 py-2">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-cyan-600" />
          <div>
            <h1 className="text-2xl font-bold">Biblioteca CNJ</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tabelas de Processos Unificadas</p>
          </div>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncStatus !== 'idle'}
          className="gap-2 bg-cyan-600"
        >
          <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          {syncStatus === 'idle' ? 'Sincronizar' : syncStatus === 'syncing' ? 'Sincronizando...' : 'Sincronizado!'}
        </Button>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-gray-400 mt-2" />
            <Input
              placeholder="Buscar por código, nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="classes">Classes ({classes.length})</TabsTrigger>
          <TabsTrigger value="subjects">Assuntos ({subjects.length})</TabsTrigger>
          <TabsTrigger value="movements">Movimentos ({movements.length})</TabsTrigger>
        </TabsList>

        {/* CLASSES */}
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Classes de Processos</CardTitle>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TableView data={classes} columns={['Código', 'Nome', 'Ramo']} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUBJECTS */}
        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Assuntos Processuais</CardTitle>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TableView data={subjects} columns={['Código', 'Nome', 'Ramo']} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* MOVEMENTS */}
        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Movimentos Processuais</CardTitle>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TableView data={movements} columns={['Código', 'Nome', 'Categoria']} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* STATUS */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6 text-sm text-blue-900 dark:text-blue-100 space-y-1">
          <p>✅ <strong>Classes:</strong> {classes.length} registros</p>
          <p>✅ <strong>Assuntos:</strong> {subjects.length} registros</p>
          <p>✅ <strong>Movimentos:</strong> {movements.length} registros</p>
          <p>✅ <strong>Última sincronização:</strong> {new Date().toLocaleString('pt-BR')}</p>
        </CardContent>
      </Card>
    </div>
  );
}