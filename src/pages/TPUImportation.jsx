import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TPUImportManager from '../components/tpu/TPUImportManager';
import TPUSchemaValidator from '../components/tpu/TPUSchemaValidator';

export default function TPUImportation() {
  const [activeTab, setActiveTab] = useState('import');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📥 Importação de Tabelas TPU
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Importe e valide tabelas TPU (Classes, Movimentos, Assuntos, Documentos) em lote
            </p>
          </div>
          <Badge className="bg-cyan-600 text-lg px-4 py-2">4 Tipos TPU</Badge>
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">📤 Importar Dados</TabsTrigger>
            <TabsTrigger value="validate">✓ Validar Schemas</TabsTrigger>
          </TabsList>

          {/* IMPORT TAB */}
          <TabsContent value="import" className="space-y-4">
            <TPUImportManager />
          </TabsContent>

          {/* VALIDATE TAB */}
          <TabsContent value="validate" className="space-y-4">
            <TPUSchemaValidator />
          </TabsContent>
        </Tabs>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="text-base">📋 Formato CSV Esperado</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
              <p>• <strong>Delimitador:</strong> Vírgula (,)</p>
              <p>• <strong>Encoding:</strong> UTF-8</p>
              <p>• <strong>Headers:</strong> Primeira linha com nomes dos campos</p>
              <p>• <strong>Tamanho máximo:</strong> 10MB</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
            <CardHeader>
              <CardTitle className="text-base">✅ Tipos TPU Suportados</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-900 dark:text-green-100 space-y-2">
              <p>• <strong>Classes:</strong> cod_classe, nome, sigla, natureza</p>
              <p>• <strong>Movimentos:</strong> cod_movimento, nome, categoria, subcategoria</p>
              <p>• <strong>Assuntos:</strong> cod_assunto, nome, ramo_direito, dispositivo_legal</p>
              <p>• <strong>Documentos:</strong> cod_documento, nome, glossario</p>
            </CardContent>
          </Card>
        </div>

        {/* EXAMPLES */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📝 Exemplos de Arquivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-xs overflow-x-auto">
                <p className="mb-2">Classes.csv:</p>
                <pre>{`cod_classe,nome,sigla,natureza
1,Ação Civil Ordinária,ACO,Cível
2,Mandado de Segurança,MS,Cível
3,Ação Penal Originária,APO,Penal`}</pre>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-xs overflow-x-auto">
                <p className="mb-2">Movimentos.csv:</p>
                <pre>{`cod_movimento,nome,categoria,subcategoria
1001,Distribuição,Serventuário,Distribuidor
2000,Decisão,Magistrado,Decisão
3000,Despacho,Magistrado,Despacho`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}