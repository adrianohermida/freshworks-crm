
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  Brain,
  BarChart2,
  Search,
  Zap,
  Smartphone,
  Moon,
  TrendingUp,
  Plug,
  Globe,
  Target,
  Lock,
} from 'lucide-react';

export default function README() {
  return (
    <div className="space-y-6">
      {/* Main Title and Description */}
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Freshdesk Manager - Gerenciador de Tickets Inteligente</h1>
      </div>
      <p className="text-gray-700">
        Uma plataforma completa de gerenciamento de tickets Freshdesk com análise IA, automações avançadas,
        relatórios em tempo real e suporte offline.
      </p>

      {/* Project Status and Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Projeto</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Badge>Production Ready</Badge>
          <Badge variant="outline">100% Funcional</Badge>
          <Badge className="bg-blue-100 text-blue-800">Última atualização: 2026-03-04</Badge>
          <Badge className="bg-purple-100 text-purple-800">Versão: 1.0.0</Badge>
        </CardContent>
      </Card>

      {/* Características Principais Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-600" />
            <CardTitle>Características Principais</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-base">Análise com IA</h5>
              <p className="text-sm text-gray-700">Classificação automática, resumos e sugestões de respostas</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <BarChart2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-base">Dashboard em Tempo Real</h5>
              <p className="text-sm text-gray-700">KPIs, gráficos de status e performance de agentes</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Search className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-base">Busca Avançada</h5>
              <p className="text-sm text-gray-700">Filtros complexos e busca full-text em tickets</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Zap className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-base">Ações em Massa</h5>
              <p className="text-sm text-gray-700">Atualizar múltiplos tickets simultaneamente</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Smartphone className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-base">Totalmente Responsivo</h5>
              <p className="text-sm text-gray-700">Funciona perfeitamente em mobile, tablet e desktop</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Moon className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-base">Tema Claro/Escuro</h5>
              <p className="text-sm text-gray-700">Suporte completo a preferências do usuário</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-base">Analytics</h5>
              <p className="text-sm text-gray-700">Rastreamento de eventos e métricas de uso</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Plug className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-base">PWA</h5>
              <p className="text-sm text-gray-700">Funciona offline com sincronização automática</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Globe className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-base">Multi-idioma</h5>
              <p className="text-sm text-gray-700">Suporte a PT-BR, EN-US e mais</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funcionalidades Principais Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            <CardTitle>Funcionalidades Principais</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-2">Dashboard</h4>
            <ul className="space-y-1 list-none pl-0">
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Visão geral de todos os tickets</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> KPIs em tempo real</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Gráficos de distribuição</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Timeline de últimos 7 dias</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Performance de agentes</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Monitoramento de SLA</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">Tickets</h4>
            <ul className="space-y-1 list-none pl-0">
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> CRUD completo</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Sincronização com Freshdesk</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Respostas com histórico</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Análise com IA</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Ações em massa</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">Contatos & Agentes</h4>
            <ul className="space-y-1 list-none pl-0">
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Gestão de contatos</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Status de agentes em tempo real</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Performance metrics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">Configurações</h4>
            <ul className="space-y-1 list-none pl-0">
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Regras de automação</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Templates de resposta</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Webhooks e integrações</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Multi-idioma</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Responsiveness & PWA Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-gray-700" />
            <CardTitle>Responsiveness & PWA</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 list-none pl-0">
            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> 100% responsivo (320px até 2560px)</li>
            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> PWA installável</li>
            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Funciona offline completamente</li>
            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Sincronização automática</li>
          </ul>
        </CardContent>
      </Card>

      {/* Segurança Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-700" />
            <CardTitle>Segurança</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 list-none pl-0">
            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Autenticação via Base44 Auth</li>
            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Validação completa</li>
            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> HTTPS obrigatório</li>
            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Rate limiting</li>
            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Audit logs</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
