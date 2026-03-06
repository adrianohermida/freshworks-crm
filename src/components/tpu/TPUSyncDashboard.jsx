import React, { useState } from 'react';
import { Zap, Database, RefreshCw, Eye, Edit2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTPUSync } from './useTPUSync';
import { base44 } from '@/api/base44Client';
import TPUTableManager from './TPUTableManager';
import TPUConsultaPublica from './TPUConsultaPublica';
import TPUValidationPanel from './TPUValidationPanel';
import CSVUploadPanel from './CSVUploadPanel';

import SyncAnalyticsDashboard from './SyncAnalyticsDashboard';
import TPUSyncAnalyticsDashboard from '@/components/admin/TPUSyncAnalyticsDashboard';
import SyncErrorReport from './SyncErrorReport';
import SyncStatusDashboard from './SyncStatusDashboard';

export default function TPUSyncDashboard() {
  const { sync, isSyncing, assuntos, classes, movimentos, documentos, stats, isLoading } = useTPUSync();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [syncMetrics, setSyncMetrics] = useState(null);
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [tableData, setTableData] = useState({
    assuntos: [],
    classes: [],
    movimentos: [],
    documentos: []
  });

  React.useEffect(() => {
    const fetchTableData = async () => {
      try {
        const [assuntosData, classesData, movimentosData, documentosData] = await Promise.all([
          base44.entities.TPUAssuntos.list(),
          base44.entities.TPUClasses.list(),
          base44.entities.TPUMovimentos.list(),
          base44.entities.TPUDocumentos.list()
        ]);
        setTableData({
          assuntos: Array.isArray(assuntosData) ? assuntosData : [],
          classes: Array.isArray(classesData) ? classesData : [],
          movimentos: Array.isArray(movimentosData) ? movimentosData : [],
          documentos: Array.isArray(documentosData) ? documentosData : []
        });
      } catch (error) {
        console.error('Erro ao buscar dados das tabelas:', error);
      }
    };
    fetchTableData();
  }, [syncMetrics]);

  const handleSyncWithMetrics = async () => {
    setIsSyncLoading(true);
    setSyncError(null);
    try {
      const response = await base44.functions.invoke('tpuSyncWithMetrics');
      setSyncMetrics(response.data);
    } catch (error) {
      setSyncError(error.message);
    } finally {
      setIsSyncLoading(false);
    }
  };

  const tabelas = [
    { nome: 'Assuntos', dados: tableData.assuntos, count: tableData.assuntos.length, icon: '📋' },
    { nome: 'Classes', dados: tableData.classes, count: tableData.classes.length, icon: '📑' },
    { nome: 'Movimentos', dados: tableData.movimentos, count: tableData.movimentos.length, icon: '⚡' },
    { nome: 'Documentos', dados: tableData.documentos, count: tableData.documentos.length, icon: '📄' }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-600" />
            Dashboard TPU - Tabelas Processuais Unificadas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Sincronização e gerenciamento de tabelas CNJ (Assuntos, Classes, Movimentos, Documentos)
          </p>
        </div>
        <Button
          onClick={handleSyncWithMetrics}
          disabled={isSyncLoading}
          className="gap-2 bg-cyan-600 hover:bg-cyan-700"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncLoading ? 'animate-spin' : ''}`} />
          {isSyncLoading ? 'Sincronizando...' : 'Sincronizar Agora'}
        </Button>
      </div>

      {/* SYNC METRICS */}
      {syncMetrics && (
        <div className="space-y-4">
          {syncError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{syncError}</AlertDescription>
            </Alert>
          )}

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total no CNJ</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                {syncMetrics.summary.totalRecords.toLocaleString()}
              </p>
            </Card>

            <Card className="p-4 bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">Temos Localmente</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">
                {syncMetrics.summary.totalLocal.toLocaleString()}
              </p>
            </Card>

            <Card className="p-4 bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700">
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Importados Agora</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {syncMetrics.summary.totalImported.toLocaleString()}
              </p>
            </Card>

            <Card className="p-4 bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-700">
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Duplicatas (Puladas)</p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-1">
                {syncMetrics.summary.totalDuplicates.toLocaleString()}
              </p>
            </Card>
          </div>

          {/* DETAILED TABLE METRICS */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {Object.entries(syncMetrics.metrics).map(([tableKey, metrics]) => (
              <Card key={tableKey} className={`p-4 ${metrics.errors.length > 0 ? 'border-red-400 dark:border-red-600' : ''}`}>
                <h4 className="font-semibold capitalize mb-3 flex items-center justify-between">
                  {tableKey}
                  {metrics.errors.length > 0 && (
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                      {metrics.errors.length} erro(s)
                    </span>
                  )}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total CNJ:</span>
                    <span className="font-medium">{(metrics.total || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Local:</span>
                    <span className="font-medium text-green-600">{(metrics.local || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Importados:</span>
                    <span className="font-medium text-cyan-600">{(metrics.imported || 0).toLocaleString()}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2">
                    {metrics.total > 0 ? (
                      <>
                        <Progress 
                          value={(metrics.local + metrics.imported) / metrics.total * 100} 
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round((metrics.local + metrics.imported) / metrics.total * 100)}% sincronizado
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        {metrics.local > 0 ? '✅ Temos dados locais' : 'Sem dados'}
                      </p>
                    )}
                  </div>

                  {/* Remaining */}
                  {metrics.total - metrics.local - metrics.imported > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900 p-2 rounded text-xs text-yellow-800 dark:text-yellow-200 mt-2">
                      Faltam: {(metrics.total - metrics.local - metrics.imported).toLocaleString()}
                    </div>
                  )}

                  {/* Error Report Component */}
                  <SyncErrorReport tableKey={tableKey} metrics={metrics} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mt-6">
         <TabsList className="grid w-full grid-cols-9 overflow-x-auto">
           <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
           <TabsTrigger value="consulta" className="flex gap-1">
             <span>🔍</span> Consultar
           </TabsTrigger>
           <TabsTrigger value="import" className="flex gap-1">
             <span>📤</span> Importar CSV
           </TabsTrigger>
           <TabsTrigger value="analytics" className="flex gap-1">
             <span>📊</span> Analytics Simples
           </TabsTrigger>
           <TabsTrigger value="analytics-advanced" className="flex gap-1">
             <span>📈</span> Analytics Avançado
           </TabsTrigger>
           <TabsTrigger value="assuntos" className="flex gap-1">
             <span>📋</span> Assuntos ({stats.assuntos || 0})
           </TabsTrigger>
           <TabsTrigger value="classes" className="flex gap-1">
             <span>📑</span> Classes ({stats.classes || 0})
           </TabsTrigger>
           <TabsTrigger value="movimentos" className="flex gap-1">
             <span>⚡</span> Movimentos ({stats.movimentos || 0})
           </TabsTrigger>
           <TabsTrigger value="documentos" className="flex gap-1">
             <span>📄</span> Documentos ({stats.documentos || 0})
           </TabsTrigger>
         </TabsList>

        {/* CONSULTA PÚBLICA TAB */}
         <TabsContent value="consulta" className="space-y-6 mt-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div>
               <h4 className="font-semibold text-lg mb-4">🔍 Consultar TPU</h4>
               <TPUConsultaPublica />
             </div>
             <div>
               <h4 className="font-semibold text-lg mb-4">✅ Validar Código</h4>
               <TPUValidationPanel />
             </div>
           </div>
         </TabsContent>

         {/* IMPORTAÇÃO CSV TAB */}
         <TabsContent value="import" className="space-y-6 mt-6">
           <CSVUploadPanel />
         </TabsContent>

         {/* ANALYTICS TAB */}
         <TabsContent value="analytics" className="space-y-6 mt-6">
           <SyncAnalyticsDashboard />
         </TabsContent>

         {/* ADVANCED ANALYTICS TAB */}
         <TabsContent value="analytics-advanced" className="space-y-6 mt-6">
           <TPUSyncAnalyticsDashboard />
         </TabsContent>

         {/* DASHBOARD TAB */}
        <TabsContent value="dashboard" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 mx-auto text-gray-400 animate-spin mb-4" />
              <p className="text-gray-600">Carregando dados TPU...</p>
            </div>
          ) : (
            <>
              {/* STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>📋</span> Total Registros
                    </p>
                    <p className="text-3xl font-bold">{stats.total || 0}</p>
                  </div>
                </Card>
                {tabelas.map(t => (
                  <Card key={t.nome} className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span>{t.icon}</span> {t.nome}
                      </p>
                      <p className="text-3xl font-bold text-cyan-600">{t.count || 0}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* STATUS DE SINCRONIZAÇÕES INTEGRADO */}
              <SyncStatusDashboard />

              {/* INFO CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="p-4 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    📊 O que é TPU?
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Tabelas Processuais Unificadas - sistema padronizado do CNJ com tabelas de Assuntos, Classes, Movimentos e Documentos.
                  </p>
                </Card>

                <Card className="p-4 bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    ✅ Sincronização
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Clique em "Sincronizar Agora" para atualizar todas as tabelas com dados oficiais do CNJ.
                  </p>
                </Card>

                <Card className="p-4 bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    ✏️ Edição
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    Cada tabela pode ser visualizada e editada através das abas acima.
                  </p>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* TABLE VIEWS */}
        {tabelas.map(tabela => {
          const tableConfigs = {
            assuntos: {
              columns: [
                { key: 'cod_assunto', label: 'Código' },
                { key: 'nome', label: 'Nome' },
                { key: 'ramo_direito', label: 'Ramo Direito' },
                { key: 'situacao', label: 'Situação', render: (val) => val === 'A' ? '✅ Ativo' : '❌ Inativo' }
              ]
            },
            classes: {
              columns: [
                { key: 'cod_classe', label: 'Código' },
                { key: 'nome', label: 'Nome' },
                { key: 'sigla', label: 'Sigla' },
                { key: 'situacao', label: 'Situação', render: (val) => val === 'A' ? '✅ Ativo' : '❌ Inativo' }
              ]
            },
            movimentos: {
              columns: [
                { key: 'cod_movimento', label: 'Código' },
                { key: 'nome', label: 'Nome' },
                { key: 'categoria', label: 'Categoria' },
                { key: 'situacao', label: 'Situação', render: (val) => val === 'A' ? '✅ Ativo' : '❌ Inativo' }
              ]
            },
            documentos: {
              columns: [
                { key: 'cod_documento_processual', label: 'Código' },
                { key: 'txt_glossario', label: 'Descrição' },
                { key: 'situacao', label: 'Situação', render: (val) => val === 'A' ? '✅ Ativo' : '❌ Inativo' }
              ]
            }
          };

          return (
            <TabsContent key={tabela.nome} value={tabela.nome.toLowerCase()} className="mt-6">
              <TPUTableManager
                tableName={tabela.nome}
                data={tabela.dados || []}
                columns={tableConfigs[tabela.nome.toLowerCase()]?.columns || []}
                onRefresh={() => window.location.reload()}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}