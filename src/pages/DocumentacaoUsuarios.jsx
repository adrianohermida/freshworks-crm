import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, BookOpen, Zap, AlertCircle } from 'lucide-react';

export default function DocumentacaoUsuarios() {
  const [expandedSection, setExpandedSection] = useState('inicio');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8 text-cyan-600" />
            Guia do Usuário
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Saiba como usar a plataforma DataJud
          </p>
        </div>

        <Tabs defaultValue="inicio" className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-xs md:text-sm">
            <TabsTrigger value="inicio">Início</TabsTrigger>
            <TabsTrigger value="processos">Processos</TabsTrigger>
            <TabsTrigger value="sincronizacao">Sync</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* INÍCIO */}
          <TabsContent value="inicio" className="space-y-4 mt-4">
            <Card className="p-4 bg-blue-50 dark:bg-blue-900 border-blue-200">
              <h2 className="font-bold text-blue-900 dark:text-blue-100 mb-2">📚 O que é DataJud?</h2>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                DataJud é uma plataforma que integra dados de processos judiciais do CNJ (Conselho Nacional de Justiça) 
                em tempo real. Você pode sincronizar, monitorar e analisar seus processos facilmente.
              </p>
            </Card>

            <div className="space-y-3">
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Comece em 3 passos
                </h3>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mt-2 ml-7">
                  <li>1. Clique em "Adicionar" para registrar um novo processo</li>
                  <li>2. Use o Dashboard para visualizar seus processos</li>
                  <li>3. Verifique a aba "Sync" para acompanhar sincronizações</li>
                </ol>
              </Card>
            </div>
          </TabsContent>

          {/* PROCESSOS */}
          <TabsContent value="processos" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">📋 Gerenciar Processos</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Adicionar Processo</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Clique no botão "Adicionar" para incluir um novo processo. Você precisa do número CNJ do processo.
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Número CNJ</p>
                  <p className="text-gray-600 dark:text-gray-400 font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                    0000001-00.0000.0.00000.0000000
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Buscar Processos</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Use a barra de busca para encontrar processos por número ou descrição.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* SINCRONIZAÇÃO */}
          <TabsContent value="sincronizacao" className="space-y-4 mt-4">
            <Card className="p-4 bg-green-50 dark:bg-green-900 border-green-200">
              <h3 className="font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Entendendo Sincronizações
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200 mt-2">
                A sincronização busca dados atualizados do CNJ para seus processos. Acontece automaticamente, 
                mas você também pode forçar manualmente.
              </p>
            </Card>

            <div className="space-y-3">
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Status de Sincronização</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">✓ Sucesso</Badge>
                    <span className="text-gray-600 dark:text-gray-400">Sincronização completada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">✗ Erro</Badge>
                    <span className="text-gray-600 dark:text-gray-400">Falha na sincronização</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">⏳ Pendente</Badge>
                    <span className="text-gray-600 dark:text-gray-400">Aguardando sincronização</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Sincronizações Automáticas</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <span className="block">• <strong>02:00</strong> - Sincronização diária completa</span>
                  <span className="block">• <strong>A cada 6h</strong> - Verificação de performance</span>
                  <span className="block">• <strong>08:00</strong> - Resumo por email</span>
                </p>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Meu processo não sincroniza. O que fazer?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Verifique se o número CNJ está correto. Se persistir, tente novamente em alguns minutos 
                  ou entre em contato com o suporte.
                </p>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Qual é a frequência de sincronização?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  A sincronização automática ocorre diariamente às 02:00 da manhã. 
                  Você também pode sincronizar manualmente a qualquer momento.
                </p>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Posso confiar nos dados exibidos?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Sim! Todos os dados vêm diretamente do CNJ via API DataJud. 
                  Nós apenas apresentamos de forma mais clara e acessível.
                </p>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Como recebo notificações?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Notificações aparecem no dashboard em tempo real (toast). 
                  Você também recebe resumos por email automaticamente.
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* RODAPÉ */}
        <Card className="p-4 bg-gray-100 dark:bg-gray-800 text-center">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Dúvidas? Entre em contato com nosso suporte
          </p>
        </Card>
      </div>
    </div>
  );
}