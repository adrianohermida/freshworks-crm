// pages/ReplicationGuide.jsx - Setup Guide for New Instances

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";

const replicationSteps = [
  {
    numero: 1,
    titulo: "Preparar Base44",
    items: [
      "Criar novo projeto",
      "Habilitar Backend Functions",
      "Configurar OAuth apps (Google Calendar)"
    ]
  },
  {
    numero: 2,
    titulo: "Criar 5 Entities",
    items: [
      "AdviseConfig",
      "IntimacaoAdvise",
      "ProcessoAdvise",
      "MovimentoProcesso",
      "TarefaAgendada"
    ]
  },
  {
    numero: 3,
    titulo: "Deploy 7 Backend Functions",
    items: [
      "testAdviseConnection",
      "syncAdviseIntimacoes",
      "marcarIntimacaoLida",
      "syncAdviseProcessos",
      "consultarAndamentosProcesso",
      "syncTarefasGoogleCalendar",
      "gerarRelatorioPDF"
    ]
  },
  {
    numero: 4,
    titulo: "Copiar Frontend Components",
    items: [
      "11 componentes reutilizáveis",
      "5 páginas principais",
      "Validações WCAG",
      "Dark/Light mode"
    ]
  },
  {
    numero: 5,
    titulo: "Configurar Secrets",
    items: [
      "ADVISE_API_TOKEN",
      "Google Calendar OAuth",
      "Environment variables"
    ]
  },
  {
    numero: 6,
    titulo: "Agendar 4 Automações",
    items: [
      "Sincronizar Intimações (8h)",
      "Sincronizar Processos (9h)",
      "Google Calendar (30min)",
      "KPIs Dashboard (30min)"
    ]
  },
  {
    numero: 7,
    titulo: "Testes & Validação",
    items: [
      "Testar conexão Advise",
      "Executar sincronizações",
      "Validar componentes",
      "Verificar automações"
    ]
  },
  {
    numero: 8,
    titulo: "Deploy em Produção",
    items: [
      "Validar cobertura de testes",
      "Ativar PWA offline",
      "Configurar monitoring",
      "Go live!"
    ]
  }
];

export default function ReplicationGuide() {
  const [copiado, setCopiado] = useState(null);

  const handleCopiar = (texto) => {
    navigator.clipboard.writeText(texto);
    setCopiado(texto);
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Guia de Replicação
          </h1>
          <p className="text-gray-600">
            8 passos simples para replicar o projeto em outra instância
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-4">
          {replicationSteps.map((step, idx) => (
            <Card key={idx} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    {step.numero}
                  </div>
                  <CardTitle className="text-lg">{step.titulo}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Code Snippets */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Snippets de Configuração</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="secrets" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="secrets">Secrets</TabsTrigger>
                <TabsTrigger value="entity">Entity</TabsTrigger>
                <TabsTrigger value="function">Function</TabsTrigger>
              </TabsList>

              <TabsContent value="secrets" className="space-y-3">
                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                  <code>{`ADVISE_API_TOKEN="seu-token-aqui"
ADVISE_API_URL="https://sandbox-api.advise.com.br"
GOOGLE_CALENDAR_OAUTH="auto"`}</code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopiar('ADVISE_API_TOKEN="seu-token-aqui"\nADVISE_API_URL="https://sandbox-api.advise.com.br"')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiado ? 'Copiado!' : 'Copiar'}
                </Button>
              </TabsContent>

              <TabsContent value="entity" className="space-y-3">
                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <code>{`{
  "name": "AdviseConfig",
  "properties": {
    "adviseApiToken": { "type": "string" },
    "adviseApiUrl": { "type": "string" },
    "ambiente": { "enum": ["sandbox", "production"] }
  }
}`}</code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopiar('Check docs/API_DOCUMENTATION.md para schema completo')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiado ? 'Copiado!' : 'Copiar Schema'}
                </Button>
              </TabsContent>

              <TabsContent value="function" className="space-y-3">
                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <code>{`import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Sua lógica aqui
  return Response.json({ success: true });
});`}</code>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                {
                  problema: "401 Unauthorized",
                  causa: "Token inválido ou expirado",
                  solucao: "Gerar novo token em Advise e atualizar ADVISE_API_TOKEN"
                },
                {
                  problema: "Function not found",
                  causa: "Função não foi deployada",
                  solucao: "Verificar Dashboard > Code > Functions se está Active"
                },
                {
                  problema: "Google Calendar not authorized",
                  causa: "App Connector não autorizado",
                  solucao: "Dashboard > App Connectors > Authorize Google Calendar"
                },
                {
                  problema: "429 Too Many Requests",
                  causa: "Rate limit atingido",
                  solucao: "Aumentar intervalo de sincronização para 1h"
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-orange-900">{item.problema}</p>
                  <p className="text-sm text-orange-800 mt-1"><strong>Causa:</strong> {item.causa}</p>
                  <p className="text-sm text-orange-800"><strong>Solução:</strong> {item.solucao}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">📞 Suporte & Recursos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-blue-900">
            <p>• <strong>Documentação:</strong> <code>docs/API_DOCUMENTATION.md</code></p>
            <p>• <strong>Advise API:</strong> https://docs.advise.com.br</p>
            <p>• <strong>Base44:</strong> https://base44.com</p>
            <p>• <strong>GitHub:</strong> Veja REPLICATION_GUIDE.md completo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}