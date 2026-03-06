import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Database, Upload, Search, Download, Plus } from 'lucide-react';
import JuizoCNJManager from '../components/modulos/JuizoCNJManager';
import ServentiasManager from '../components/modulos/ServentiasManager';
import CodigoForoImporter from '../components/modulos/CodigoForoImporter';

export default function ModuloJuizos() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Database className="w-8 h-8 text-purple-600" />
              Módulo Juízos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerenciamento de órgãos judiciários, serventias e foros - Importação e consulta de dados JuizoCNJ
            </p>
          </div>
          <Badge className="bg-purple-600 text-lg px-4 py-2">3 Submódulos</Badge>
        </div>



        {/* TABS */}
        <Tabs defaultValue="juizo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="juizo">⚖️ JuizoCNJ</TabsTrigger>
            <TabsTrigger value="serventias">📋 Serventias</TabsTrigger>
            <TabsTrigger value="foros">🏛️ CodigoForoTJSP</TabsTrigger>
          </TabsList>

          {/* JUIZOCNJ */}
          <TabsContent value="juizo" className="space-y-4">
            <JuizoCNJManager />
          </TabsContent>

          {/* SERVENTIAS */}
          <TabsContent value="serventias" className="space-y-4">
            <ServentiasManager />
          </TabsContent>

          {/* CODIGO FORO */}
          <TabsContent value="foros" className="space-y-4">
            <CodigoForoImporter />
          </TabsContent>
        </Tabs>

        {/* INFO CARD */}
        <Card className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
          <CardContent className="pt-6">
            <p className="text-sm text-purple-900 dark:text-purple-100">
              ℹ️ <strong>Sobre o Módulo Juízos:</strong> Este módulo gerencia dados estruturais do judiciário brasileiro. 
              <strong> JuizoCNJ</strong> contém todos os órgãos judiciários cadastrados no CNJ com seus códigos únicos. 
              <strong> Serventias</strong> registra cartórios, distribuidores e executores. 
              <strong> CodigoForoTJSP</strong> mapeia foros e comarcas do TJSP. Dados sincronizados com APIs oficiais.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}