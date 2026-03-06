import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Key, FileText, Scale, Globe, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import ContratosManager from '@/components/iapi/ContratosManager';

// ============================================================
// DADOS REAIS — Contratos ativos do usuário Adriano Menezes
// ============================================================
const usuariosIniciais = [
  {
    id: 1,
    nome: 'Adriano Menezes Hermida Maia',
    email: 'adriano@hermidamaia.adv.br',
    status: 'ativo',
    totalContratos: 3,
    monitoraProcessos: false,
    monitoraIntimacoes: false,
    contratos: [
      {
        id: 'CONTRATO-001',
        tipoPalavraChave: 'palavra_chave',
        palavraChave: 'LEILÕES',
        variacoesPesquisa: ['HASTA PÚBLICA', 'PRAÇA PÚBLICA'],
        variacoesExclusao: [],
        variacoesReprovadas: [],
        diarios: ['DJAM', 'DJF1', 'DJSC', 'DJSP', 'DJTE'],
        status: 'ativo',
        totalDiarios: 5,
        cobertura: 'regional'
      },
      {
        id: 'CONTRATO-002',
        tipoPalavraChave: 'palavra_chave',
        palavraChave: 'ADRIANO MENEZES HERMIDA MAIA',
        variacoesPesquisa: ['ADRIANO M HERMIDA MAIA', 'ADRIANO HERMIDA MAIA', 'ADRIANO MENEZES H MAIA'],
        variacoesExclusao: [],
        variacoesReprovadas: [],
        diarios: [
          'DJ17','DJAC','DJAL','DJAM','DJAP','DJBA','DJCE','DJDF','DJES',
          'DJF1','DJF5','DJGO','DJMA','DJMG','DJMS','DJMT','DJPA','DJPB',
          'DJPE','DJPI','DJPR','DJRJ','DJRN','DJRO','DJRR','DJRS','DJSC',
          'DJSE','DJSP','DJTE','DJTO','DJUN','MPAL','MPMG','MPPB','MPPE','MPPI','MPSE'
        ],
        status: 'ativo',
        totalDiarios: 38,
        cobertura: 'nacional'
      },
      {
        id: 'CONTRATO-003',
        tipoPalavraChave: 'palavra_chave',
        palavraChave: 'HERMIDA MAIA SOCIEDADE INDIVIDUAL DE ADVOCACIA',
        variacoesPesquisa: [
          'HERMIDA MAIA SOC IND DE ADV',
          'HERMIDA MAIA SOC DE ADV',
          'HERMIDA MAIA SOC IND ADV',
          'SOC IND DE ADV HERMIDA MAIA',
          'SOC DE ADV HERMIDA MAIA',
          'SOC IND ADV HERMIDA MAIA',
          'HERMIDA MAIA'
        ],
        variacoesExclusao: [],
        variacoesReprovadas: [],
        diarios: ['Nacional (todos os diários disponíveis)'],
        status: 'ativo',
        totalDiarios: null,
        cobertura: 'nacional_completo'
      }
    ]
  }
];

// Função para calcular KPIs
const calcularKPIs = (usuariosData) => {
  return {
    totalUsuarios: usuariosData.length,
    totalContratos: usuariosData.reduce((a, u) => a + u.totalContratos, 0),
    usuariosComPalavraChave: usuariosData.filter(u => u.contratos.some(c => c.tipoPalavraChave === 'palavra_chave')).length,
    usuariosComProcesso: usuariosData.filter(u => u.monitoraProcessos).length,
    usuariosComIntimacao: usuariosData.filter(u => u.monitoraIntimacoes).length,
    totalVariacoesPesquisa: usuariosData.flatMap(u => u.contratos.flatMap(c => c.variacoesPesquisa)).length,
    totalDiariosUnicos: [...new Set(usuariosData.flatMap(u => u.contratos.flatMap(c => c.diarios)))].length
  };
};

const coberturaLabel = {
  regional: { label: 'Regional', color: 'bg-blue-100 text-blue-800' },
  nacional: { label: 'Nacional', color: 'bg-green-100 text-green-800' },
  nacional_completo: { label: 'Nacional Completo', color: 'bg-purple-100 text-purple-800' }
};

function ContratoCard({ contrato }) {
  const [expandido, setExpandido] = useState(false);
  const cob = coberturaLabel[contrato.cobertura] || { label: contrato.cobertura, color: 'bg-gray-100 text-gray-700' };

  return (
    <Card className="border border-gray-200">
      <div className="p-4 cursor-pointer flex items-start justify-between" onClick={() => setExpandido(!expandido)}>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Key className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-sm">{contrato.palavraChave}</span>
            <Badge className="text-xs bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1 inline" />Ativo</Badge>
            <Badge className={`text-xs ${cob.color}`}>{cob.label}</Badge>
          </div>
          <p className="text-xs text-gray-500">
            {contrato.variacoesPesquisa.length} variações de pesquisa · {contrato.totalDiarios ?? '∞'} diários
          </p>
        </div>
        {expandido ? <ChevronUp className="w-5 h-5 text-gray-400 mt-1" /> : <ChevronDown className="w-5 h-5 text-gray-400 mt-1" />}
      </div>

      {expandido && (
        <div className="border-t px-4 pb-4 pt-3 space-y-4">
          {/* Variações de Pesquisa */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Variações de Pesquisa ({contrato.variacoesPesquisa.length})</p>
            <div className="flex flex-wrap gap-1">
              {contrato.variacoesPesquisa.map((v, i) => (
                <span key={i} className="text-xs bg-blue-50 border border-blue-200 text-blue-800 px-2 py-0.5 rounded">{v}</span>
              ))}
            </div>
          </div>

          {/* Variações de Exclusão */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Variações de Exclusão</p>
            {contrato.variacoesExclusao.length === 0
              ? <p className="text-xs text-gray-400 italic">Não há variações de exclusão.</p>
              : contrato.variacoesExclusao.map((v, i) => <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200 mr-1">{v}</span>)
            }
          </div>

          {/* Variações Reprovadas */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Variações Reprovadas</p>
            {contrato.variacoesReprovadas.length === 0
              ? <p className="text-xs text-gray-400 italic">Não há variações reprovadas.</p>
              : contrato.variacoesReprovadas.map((v, i) => <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded border mr-1">{v}</span>)
            }
          </div>

          {/* Diários */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Diários ({contrato.totalDiarios ? contrato.totalDiarios : '∞ Nacional'})
            </p>
            <div className="flex flex-wrap gap-1">
              {contrato.diarios.map((d, i) => (
                <span key={i} className="text-xs bg-gray-100 border border-gray-200 text-gray-700 px-2 py-0.5 rounded font-mono">{d}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function UsuarioCard({ usuario, onUpdate }) {
  const [expandido, setExpandido] = useState(true);

  const handleAtualizarContratos = (novoContratos) => {
    onUpdate({ ...usuario, contratos: novoContratos, totalContratos: novoContratos.length });
  };

  return (
    <Card className="border-2 border-orange-200">
      <div className="p-5 cursor-pointer flex items-start justify-between" onClick={() => setExpandido(!expandido)}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">{usuario.nome}</p>
            <p className="text-xs text-gray-500">{usuario.email}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              <Badge className="text-xs bg-green-100 text-green-800">✅ Ativo</Badge>
              <Badge className="text-xs bg-orange-100 text-orange-800">{usuario.totalContratos} contratos ativos</Badge>
              {usuario.monitoraProcessos && <Badge className="text-xs bg-blue-100 text-blue-800"><Scale className="w-3 h-3 mr-1 inline" />Processos</Badge>}
              {usuario.monitoraIntimacoes && <Badge className="text-xs bg-purple-100 text-purple-800"><FileText className="w-3 h-3 mr-1 inline" />Intimações</Badge>}
              <Badge className="text-xs bg-yellow-100 text-yellow-800"><Key className="w-3 h-3 mr-1 inline" />Palavras-chave ativas</Badge>
            </div>
          </div>
        </div>
        {expandido ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </div>

      {expandido && (
        <div className="border-t px-5 pb-5 pt-3 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Key className="w-4 h-4 text-orange-500" />
            Contratos de Monitoramento ({usuario.contratos.length})
          </h3>
          <ContratosManager 
            usuario={usuario} 
            contratos={usuario.contratos}
            onUpdate={handleAtualizarContratos}
          />
        </div>
      )}
    </Card>
  );
}

export default function IAPI() {
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  
  const kpis = calcularKPIs(usuarios);

  const handleAtualizarUsuario = (usuarioAtualizado) => {
    setUsuarios(usuarios.map(u => u.id === usuarioAtualizado.id ? usuarioAtualizado : u));
  };

  const handleAdicionarUsuario = () => {
    const novoUsuario = {
      id: usuarios.length + 1,
      nome: `Novo Cliente ${usuarios.length + 1}`,
      email: `cliente${usuarios.length + 1}@example.com`,
      status: 'ativo',
      totalContratos: 0,
      monitoraProcessos: false,
      monitoraIntimacoes: false,
      contratos: []
    };
    setUsuarios([...usuarios, novoUsuario]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="w-8 h-8 text-orange-500" />
            iAPI — Gestão de Monitoramentos Advise
          </h1>
          <p className="text-gray-500 text-sm mt-1">Visão consolidada de todos os clientes, contratos e palavras-chave monitoradas</p>
        </div>
        <Button onClick={handleAdicionarUsuario} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-1" />Novo Cliente
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center border-l-4 border-l-orange-500">
          <p className="text-3xl font-bold text-orange-600">{kpis.totalUsuarios}</p>
          <p className="text-xs text-gray-500 mt-1">Clientes Ativos</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-blue-500">
          <p className="text-3xl font-bold text-blue-600">{kpis.totalContratos}</p>
          <p className="text-xs text-gray-500 mt-1">Contratos Ativos</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-green-500">
          <p className="text-3xl font-bold text-green-600">{kpis.totalVariacoesPesquisa}</p>
          <p className="text-xs text-gray-500 mt-1">Variações de Pesquisa</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-purple-500">
          <p className="text-3xl font-bold text-purple-600">{kpis.totalDiariosUnicos}</p>
          <p className="text-xs text-gray-500 mt-1">Diários Únicos</p>
        </Card>
      </div>

      {/* Resumo de cobertura */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-400 bg-blue-50">
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-blue-500" />
            <p className="font-semibold text-blue-900">Monitoramento de Processos</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{kpis.usuariosComProcesso}/{kpis.totalUsuarios}</p>
          <p className="text-xs text-blue-600">clientes com monitoramento</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-400 bg-purple-50">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-purple-500" />
            <p className="font-semibold text-purple-900">Monitoramento de Intimações</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">{kpis.usuariosComIntimacao}/{kpis.totalUsuarios}</p>
          <p className="text-xs text-purple-600">clientes com monitoramento</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-400 bg-yellow-50">
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-5 h-5 text-yellow-600" />
            <p className="font-semibold text-yellow-900">Palavras-chave Monitoradas</p>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{kpis.usuariosComPalavraChave}/{kpis.totalUsuarios}</p>
          <p className="text-xs text-yellow-600">clientes com palavras-chave ativas</p>
        </Card>
      </div>

      <Tabs defaultValue="usuarios">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="usuarios">Clientes & Contratos</TabsTrigger>
          <TabsTrigger value="diarios">Cobertura de Diários</TabsTrigger>
          <TabsTrigger value="resumo">Resumo de Palavras-chave</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-4">
          {usuarios.map(u => <UsuarioCard key={u.id} usuario={u} onUpdate={handleAtualizarUsuario} />)}
        </TabsContent>

        <TabsContent value="diarios">
          <div className="space-y-4">
            {usuarios.flatMap(u => u.contratos).map(c => (
              <Card key={c.id} className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="w-4 h-4 text-orange-500" />
                  <h3 className="font-bold">{c.palavraChave}</h3>
                  <Badge className={coberturaLabel[c.cobertura]?.color}>{coberturaLabel[c.cobertura]?.label}</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.diarios.map((d, i) => (
                    <span key={i} className="text-xs font-mono bg-gray-100 border border-gray-200 text-gray-700 px-2 py-0.5 rounded">{d}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resumo">
          <Card className="p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">Palavra-chave</th>
                  <th className="pb-2 pr-4">Variações</th>
                  <th className="pb-2 pr-4">Diários</th>
                  <th className="pb-2">Cobertura</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {usuarios.flatMap(u => u.contratos).map(c => (
                  <tr key={c.id} className="py-2">
                    <td className="py-3 pr-4 font-medium text-gray-900 text-xs">{c.palavraChave}</td>
                    <td className="py-3 pr-4 text-xs text-gray-600">{c.variacoesPesquisa.length} pesquisa · {c.variacoesExclusao.length} exclusão</td>
                    <td className="py-3 pr-4 text-xs text-gray-600">{c.totalDiarios ?? '∞'}</td>
                    <td className="py-3">
                      <Badge className={`text-xs ${coberturaLabel[c.cobertura]?.color}`}>{coberturaLabel[c.cobertura]?.label}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}