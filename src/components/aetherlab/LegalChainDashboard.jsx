import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Send, Check, Clock, AlertCircle } from 'lucide-react';
import LegalChainHeader from '@/components/LegalChainHeader';

export default function LegalChainDashboard() {
  const [stats] = useState({
    totalDocuments: 1247,
    pendingSignatures: 43,
    completedToday: 18,
    integrationStatus: 'connected'
  });

  const [recentDocuments] = useState([
    {
      id: 'DOC001',
      name: 'Contrato de Prestação de Serviços',
      client: 'Empresa XYZ Ltda',
      signers: 3,
      status: 'pending',
      createdAt: 'Hoje às 10:30'
    },
    {
      id: 'DOC002',
      name: 'Acordo de Confidencialidade',
      client: 'Tech Solutions Inc',
      signers: 2,
      status: 'signed',
      createdAt: 'Hoje às 09:15'
    },
    {
      id: 'DOC003',
      name: 'Procuração para Representação Judicial',
      client: 'João Silva - PF',
      signers: 1,
      status: 'pending',
      createdAt: 'Ontem às 14:20'
    }
  ]);

  const [features] = useState([
    {
      icon: FileText,
      title: 'Gestão de Documentos',
      description: 'Organize e controle todos os documentos legais em um único lugar'
    },
    {
      icon: Send,
      title: 'Assinatura Digital',
      description: 'Envie para assinatura com Autentique - ICP-Brasil certificado'
    },
    {
      icon: Check,
      title: 'Rastreamento',
      description: 'Acompanhe em tempo real o status de cada assinatura'
    },
    {
      icon: Clock,
      title: 'Histórico Completo',
      description: 'Registro de auditoria de todas as ações e eventos'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LegalChainHeader />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{stats.totalDocuments}</div>
              <p className="text-sm text-gray-600 mt-2">Documentos Processados</p>
              <Progress value={85} className="mt-3" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600">{stats.pendingSignatures}</div>
              <p className="text-sm text-gray-600 mt-2">Assinaturas Pendentes</p>
              <Badge className="mt-3 bg-orange-100 text-orange-800">Ação necessária</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{stats.completedToday}</div>
              <p className="text-sm text-gray-600 mt-2">Concluídos Hoje</p>
              <Badge className="mt-3 bg-green-100 text-green-800">Excelente!</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="font-semibold text-green-600">Conectado</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Status Autentique API</p>
              <Badge className="mt-3 bg-green-100 text-green-800">v2 Integrado</Badge>
            </CardContent>
          </Card>
        </div>

        {/* QUICK ACTIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12">
              <FileText className="w-5 h-5 mr-2" />
              Novo Documento
            </Button>
            <Button variant="outline" className="h-12">
              <Send className="w-5 h-5 mr-2" />
              Enviar para Assinatura
            </Button>
            <Button variant="outline" className="h-12">
              <AlertCircle className="w-5 h-5 mr-2" />
              Ver Pendências
            </Button>
          </CardContent>
        </Card>

        {/* RECENT DOCUMENTS */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Cliente: <span className="font-medium">{doc.client}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{doc.createdAt}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{doc.signers} signatário{doc.signers !== 1 ? 's' : ''}</Badge>
                    <Badge className={
                      doc.status === 'signed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }>
                      {doc.status === 'signed' ? '✓ Assinado' : '⏳ Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FEATURES */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recursos LegalChain</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg h-fit">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* INTEGRATION STATUS */}
        <Card className="border-2 border-green-600 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700">✅ Integração Autentique Ativa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">API Version:</span> v2 (GraphQL)
              </p>
              <p>
                <span className="font-semibold">Webhooks:</span> Configurados para document.signed, signer.rejected, etc
              </p>
              <p>
                <span className="font-semibold">Certificação:</span> ICP-Brasil + LGPD Compliance
              </p>
              <p>
                <span className="font-semibold">Status:</span> <Badge className="bg-green-600">Operacional</Badge>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}