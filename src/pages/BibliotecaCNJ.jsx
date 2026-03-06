import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Database, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function BibliotecaCNJ() {
  const [activeSubmodule, setActiveSubmodule] = useState('classes');
  const [searchTerm, setSearchTerm] = useState('');

  // TPU Classes Data Structure
  const tpuClasses = [
    { id: 1, nome: 'Ação de Alimentos', sigla: 'AA', natureza: 'Cível' },
    { id: 2, nome: 'Ação de Investigação de Paternidade', sigla: 'AIP', natureza: 'Cível' },
    { id: 3, nome: 'Ação Penal', sigla: 'AP', natureza: 'Penal' }
  ];

  const tpuMovimentos = [
    { id: 1001, nome: 'Distribuição', categoria: 'Serventuário', subcategoria: 'Distribuidor' },
    { id: 1002, nome: 'Juntada', categoria: 'Serventuário', subcategoria: 'Escrição' },
    { id: 2000, nome: 'Decisão', categoria: 'Magistrado', subcategoria: 'Decisão' }
  ];

  const tpuAssuntos = [
    { id: 1, nome: 'Alimentos', ramo: 'Direito Civil', dispositivo: 'CC, art. 1694' },
    { id: 2, nome: 'Indenização por Dano Material', ramo: 'Direito Civil', dispositivo: 'CC, art. 927' },
    { id: 3, nome: 'Crime contra Honra', ramo: 'Direito Penal', dispositivo: 'CP, art. 138' }
  ];

  const tpuDocumentos = [
    { id: 1, nome: 'Sentença', glossario: 'Decisão judicial que encerra a lide' },
    { id: 2, nome: 'Despacho', glossario: 'Ato do juiz que não encerra a lide' },
    { id: 3, nome: 'Decisão Interlocutória', glossario: 'Decisão que resolve questão incidental' }
  ];

  const renderTable = (data, columns) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((col) => (
              <th key={col} className="text-left py-2 px-4 font-semibold text-gray-700 dark:text-gray-300">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              {Object.values(row).map((val, i) => (
                <td key={i} className="py-3 px-4 text-gray-700 dark:text-gray-300">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Database className="w-8 h-8 text-cyan-600" />
              Biblioteca CNJ
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Tabelas TPU (Classes, Movimentos, Assuntos, Documentos) - Referência completa do Conselho Nacional de Justiça
            </p>
          </div>
          <Badge className="bg-cyan-600 text-lg px-4 py-2">4 Submódulos</Badge>
        </div>

        {/* TABS */}
        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classes">📋 Classes</TabsTrigger>
            <TabsTrigger value="movimentos">🔄 Movimentos</TabsTrigger>
            <TabsTrigger value="assuntos">📑 Assuntos</TabsTrigger>
            <TabsTrigger value="documentos">📄 Documentos</TabsTrigger>
          </TabsList>

          {/* CLASSES */}
          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tabela de Classes Processuais TPU</CardTitle>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {tpuClasses.length} classes processuais cadastradas
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar classe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                {renderTable(tpuClasses, ['ID', 'Nome', 'Sigla', 'Natureza'])}
              </CardContent>
            </Card>
          </TabsContent>

          {/* MOVIMENTOS */}
          <TabsContent value="movimentos" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tabela de Movimentos Processuais TPU</CardTitle>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {tpuMovimentos.length} movimentos cadastrados
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar movimento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                {renderTable(tpuMovimentos, ['Código', 'Nome', 'Categoria', 'Subcategoria'])}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ASSUNTOS */}
          <TabsContent value="assuntos" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tabela de Assuntos Processuais TPU</CardTitle>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {tpuAssuntos.length} assuntos cadastrados
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar assunto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                {renderTable(tpuAssuntos, ['ID', 'Nome', 'Ramo de Direito', 'Dispositivo Legal'])}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DOCUMENTOS */}
          <TabsContent value="documentos" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tabela de Documentos Processuais TPU</CardTitle>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {tpuDocumentos.length} tipos de documentos cadastrados
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                {renderTable(tpuDocumentos, ['ID', 'Nome', 'Glossário'])}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* INFO CARD */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              ℹ️ <strong>Sobre a Biblioteca CNJ:</strong> Estas tabelas TPU (Tabela de Processos Unificada) são usadas para padronizar e enriquecer dados de processos judiciais. 
              As classes definem tipos de ações, os movimentos rastreiam andamentos, assuntos categorizam natureza legal, e documentos identificam tipos de arquivos processuais.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}