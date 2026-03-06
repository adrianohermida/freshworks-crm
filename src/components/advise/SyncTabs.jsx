import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from './DataTable';

export default function SyncTabs({ result, loading }) {
  return (
    <Tabs defaultValue="dados" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dados">Dados ({result?.publicacoes?.length || 0})</TabsTrigger>
        <TabsTrigger value="resumo">Resumo</TabsTrigger>
        <TabsTrigger value="raw">JSON</TabsTrigger>
      </TabsList>

      <TabsContent value="dados">
        <DataTable 
          title="Publicações Sincronizadas"
          data={result?.publicacoes || []}
          loading={loading}
          renderRow={(item) => (
            <div className="space-y-2">
              <h4 className="font-semibold">{item.numeroProcesso || 'Sem número'}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{item.conteudo?.substring(0, 120)}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{item.municipio || item.cidadeComarcaDescricao}</span>
                <span>{new Date(item.dataPublicacao).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          )}
        />
      </TabsContent>

      <TabsContent value="resumo" className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-semibold mb-2">Período Consultado</p>
          <p className="text-sm">{result?.periodo?.periodoBuscaFormatado}</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm font-semibold mb-2">Total de Registros</p>
          <p className="text-2xl font-bold">{result?.publicacoes?.length || 0}</p>
        </div>
      </TabsContent>

      <TabsContent value="raw">
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
          <pre className="text-xs font-mono">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </TabsContent>
    </Tabs>
  );
}