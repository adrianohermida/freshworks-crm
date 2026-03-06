import React from 'react';
import GoogleCalendarConfig from '@/components/integracao/GoogleCalendarConfig';
import RelatorioGerador from '@/components/integracao/RelatorioGerador';
import GerenciadorFontesIntimacao from '@/components/integracao/GerenciadorFontesIntimacao';
import SincronizadorPublicacoesV2 from '@/components/integracao/SincronizadorPublicacoesV2';
import RelatorioAuditoria from '@/components/integracao/RelatorioAuditoria';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, AlertCircle, Download, BarChart3 } from 'lucide-react';

export default function IntegracaoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Integrações
          </h1>
          <p className="text-gray-600">
            Configure integrações e exporte dados
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="publicacoes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="publicacoes" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Publicações
            </TabsTrigger>
            <TabsTrigger value="auditoria" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Auditoria
            </TabsTrigger>
            <TabsTrigger value="fontes" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Intimações
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Google Calendar
            </TabsTrigger>
            <TabsTrigger value="relatorio" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="publicacoes" className="space-y-6">
            <SincronizadorPublicacoesV2 />
          </TabsContent>

          <TabsContent value="auditoria" className="space-y-6">
            <RelatorioAuditoria />
          </TabsContent>

          <TabsContent value="fontes" className="space-y-6">
            <GerenciadorFontesIntimacao />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <GoogleCalendarConfig />
          </TabsContent>

          <TabsContent value="relatorio" className="space-y-6">
            <RelatorioGerador />
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Publicações</h3>
            <p className="text-sm text-gray-600">
              Sincronize publicações sob demanda com filtros de período e tamanho de lote.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Fontes Advise</h3>
            <p className="text-sm text-gray-600">
              Configure credenciais para sincronização de intimações de múltiplas fontes.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Google Calendar</h3>
            <p className="text-sm text-gray-600">
              Integre seus prazos legais com Google Calendar para sincronização automática.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Relatórios PDF</h3>
            <p className="text-sm text-gray-600">
              Exporte processos, tarefas e intimações em PDF para análise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}