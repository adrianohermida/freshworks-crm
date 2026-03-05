import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

export default function ModuloJuizos() {
  const [activeTab, setActiveTab] = useState('juizos');
  const [searchTerm, setSearchTerm] = useState('');

  const juizos = [
    { codigo: '00001001', nome: '1ª Vara Cível', tribunal: 'TJSP', municipio: 'São Paulo', nível: '1º grau' },
    { codigo: '00001002', nome: '2ª Vara Cível', tribunal: 'TJSP', municipio: 'São Paulo', nível: '1º grau' },
    { codigo: '00001900', nome: 'Tribunal de Justiça de SP', tribunal: 'TJSP', municipio: 'São Paulo', nível: '2º grau' }
  ];

  const serventias = [
    { codigo: '00001', nome: 'Cartório Distribuidor', tribunal: 'TJSP', municipio: 'São Paulo' },
    { codigo: '00002', nome: 'Cartório Executor', tribunal: 'TJSP', municipio: 'São Paulo' }
  ];

  const foruns = [
    { codigo: 1001, nome: 'Foro de São Paulo', municipio: 'São Paulo', comarca: 'SP' },
    { codigo: 1002, nome: 'Foro de Campinas', municipio: 'Campinas', comarca: 'SP' }
  ];

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
        <div>
          <h1 className="text-2xl font-bold">Módulo Juízos & Serventias</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciamento de órgãos judiciários</p>
        </div>
        <Button className="gap-2 bg-cyan-600">
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-gray-400 mt-2" />
            <Input
              placeholder="Buscar juízos, serventias ou fóruns..."
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
          <TabsTrigger value="juizos">Juízos ({juizos.length})</TabsTrigger>
          <TabsTrigger value="serventias">Serventias ({serventias.length})</TabsTrigger>
          <TabsTrigger value="foruns">Fóruns ({foruns.length})</TabsTrigger>
        </TabsList>

        {/* JUIZOS */}
        <TabsContent value="juizos">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Juízos CNJ</CardTitle>
            </CardHeader>
            <CardContent>
              <TableView data={juizos} columns={['Código', 'Nome', 'Tribunal', 'Município', 'Nível']} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SERVENTIAS */}
        <TabsContent value="serventias">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Serventias/Cartórios</CardTitle>
            </CardHeader>
            <CardContent>
              <TableView data={serventias} columns={['Código', 'Nome', 'Tribunal', 'Município']} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* FORUNS */}
        <TabsContent value="foruns">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fóruns TJSP</CardTitle>
            </CardHeader>
            <CardContent>
              <TableView data={foruns} columns={['Código', 'Nome', 'Município', 'Comarca']} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* INFO */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6 text-sm text-blue-900 dark:text-blue-100 space-y-1">
          <p>ℹ️ <strong>Juízos:</strong> Órgãos judiciários cadastrados no CNJ</p>
          <p>ℹ️ <strong>Serventias:</strong> Cartórios e unidades administrativas</p>
          <p>ℹ️ <strong>Fóruns:</strong> Locais físicos onde funcionam os juízos</p>
        </CardContent>
      </Card>
    </div>
  );
}