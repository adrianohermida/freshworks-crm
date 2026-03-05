import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Code, Zap, Shield, Database } from 'lucide-react';

export default function DocumentationGuide() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-cyan-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Guia de Uso - DataJud Integrador
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">v2.0.0 | Atualizado em 03/03/2026</p>
        </div>

        <Tabs defaultValue="quickstart" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
          </TabsList>

          {/* QUICK START */}
          <TabsContent value="quickstart" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4">🚀 Quick Start</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">1. Acesso ao Sistema</h3>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded font-mono text-sm">
                    <p>URL: https://datajud.app/processes</p>
                    <p>Login: E-mail + Senha</p>
                    <p>Dashboard: Visão geral de todos os processos</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">2. Adicionar um Processo</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Clique em "Novo Processo" ou "+"</li>
                    <li>Digite o número CNJ: <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">0000001-00.0000.0.00000.0000000</code></li>
                    <li>Sistema valida e busca no DataJud automaticamente</li>
                    <li>Revise dados e clique "Salvar"</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">3. Sincronizar Processos</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Automático:</strong> A cada 24 horas (configurável)
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Manual:</strong> Dashboard → Botão "Sincronizar"
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* FEATURES */}
          <TabsContent value="features" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4">📖 Features Principais</h2>

              <div className="space-y-6">
                <div className="border-l-4 border-cyan-600 pl-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Processos
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>✓ Base Unificada: Um processo é acessível por todos os usuários</li>
                    <li>✓ Isolamento: Prazos, publicações e e-mails isolados por usuário</li>
                    <li>✓ Schema: Sistema aprende padrão de cada tribunal e enriquece dados</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Prazos
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>✓ Isolado para seu usuário</li>
                    <li>✓ Alertas: 7, 3, 1 dias antes do vencimento</li>
                    <li>✓ Pode ser marcado como completo</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="text-lg font-semibold mb-2">📰 Publicações</h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>✓ Sistema busca no DataJud automaticamente</li>
                    <li>✓ Isolado para seu usuário</li>
                    <li>✓ Notificações por e-mail</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4">⚙️ Configurações</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Tribunal Padrão</h3>
                  <p className="text-sm text-gray-600">Configurações → Tribunal</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Notificações</h3>
                  <p className="text-sm text-gray-600">Configurações → Notificações</p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                    <li>☐ E-mail diário (resumo)</li>
                    <li>☐ E-mail imediato (movimentos)</li>
                    <li>☐ Push notifications</li>
                    <li>☐ WhatsApp</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Horário Silencioso</h3>
                  <p className="text-sm text-gray-600">De: 22:00 | Até: 07:00</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Segurança & Privacidade
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Dados Isolados (Seu Usuário)</h3>
                  <div className="bg-green-50 dark:bg-green-900 border-l-4 border-green-600 p-4 rounded">
                    <ul className="space-y-1 text-sm">
                      <li>✅ Prazos</li>
                      <li>✅ Publicações</li>
                      <li>✅ Contatos salvos</li>
                      <li>✅ Comunicações</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Dados Compartilhados</h3>
                  <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-600 p-4 rounded">
                    <ul className="space-y-1 text-sm">
                      <li>ℹ️ Processos (base unificada)</li>
                      <li>ℹ️ Movimentos (enriquecidos por TPU)</li>
                      <li>ℹ️ Publicações DJe</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">LGPD Compliance</h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>✓ Pode solicitar exportação de dados: <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">Configurações → LGPD → Exportar</code></li>
                    <li>✓ Pode solicitar exclusão: <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">Configurações → LGPD → Deletar</code></li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4">🔄 Sincronização - Como Funciona</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Fluxo Automático</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>Busca DataJud → Buscar processo no CNJ</li>
                    <li>Parse CNJ → Extrair tribunal, segmento, ano</li>
                    <li>Deduplicação → Remover movimentos duplicados</li>
                    <li>Enriquecimento TPU → Adicionar descrições</li>
                    <li>Persistência → Salvar na base unificada</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Dados Enriquecidos</h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>✓ Classes: Descrição completa da classe processual</li>
                    <li>✓ Assuntos: Contexto legal e ramo do direito</li>
                    <li>✓ Movimentos: Nome, categoria, subcategoria</li>
                    <li>✓ Órgão Julgador: Normalizado com dados CNJ</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* SUPPORT */}
          <TabsContent value="support" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4">🆘 Troubleshooting</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">❌ Erro: "Processo não encontrado"</h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Verifique o número CNJ (formato: NNNNNNN-DD.AAAA.J.TT.OOOO.SSSSSSSS)</li>
                    <li>• Tribunal selecionado está correto?</li>
                    <li>• Tente sincronizar manualmente</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">❌ Erro: "Falha na sincronização"</h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Verifique sua conexão</li>
                    <li>• Tente novamente em alguns minutos</li>
                    <li>• Se persistir: Suporte → Relatar erro</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">❌ Dados não atualizados</h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Dashboard → Sincronizar</li>
                    <li>• Ou aguarde próxima sincronização automática (24h)</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 dark:bg-gray-800 bg-blue-50 dark:bg-blue-900">
              <h2 className="text-2xl font-bold mb-4">📞 Canais de Suporte</h2>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold">💬 Chat</p>
                  <p className="text-sm text-gray-600">Clique no widget 💬 canto inferior direito</p>
                </div>

                <div>
                  <p className="font-semibold">📧 Email</p>
                  <p className="text-sm text-gray-600">support@datajud.app</p>
                </div>

                <div>
                  <p className="font-semibold">📖 Documentação</p>
                  <p className="text-sm text-gray-600">https://docs.datajud.app</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4">🎓 Tutoriais em Vídeo</h2>

              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>📹 <a href="#" className="text-cyan-600 hover:underline">Como adicionar um processo</a></li>
                <li>📹 <a href="#" className="text-cyan-600 hover:underline">Gerenciar prazos</a></li>
                <li>📹 <a href="#" className="text-cyan-600 hover:underline">Configurar notificações</a></li>
                <li>📹 <a href="#" className="text-cyan-600 hover:underline">Exportar dados LGPD</a></li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FOOTER */}
        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-sm text-gray-600">
          <p><strong>v2.0.0</strong> | Atualizado em 03/03/2026</p>
          <p className="mt-2">Sprint 11 - Guia Completo de Uso</p>
        </div>
      </div>
    </div>
  );
}