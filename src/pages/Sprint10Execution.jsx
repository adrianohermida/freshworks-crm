import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2, Clock, AlertTriangle, Zap, Target, TrendingUp,
  Shield, Lock, FileText, Users, AlertCircle, Play, ChevronDown, ChevronUp
} from 'lucide-react';

export default function Sprint10Execution() {
  const [diaAtual, setDiaAtual] = useState(1);
  const [horaAtual, setHoraAtual] = useState('08:00');
  const [expandedTarefas, setExpandedTarefas] = useState({
    e2e: true,
    auth: true,
    audit: false,
    encrypt: false,
    rateLimit: false,
    lgpd: false
  });

  // Simular progresso em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setHoraAtual(prev => {
        const [h, m] = prev.split(':');
        const newMinutes = (parseInt(m) + 15) % 60;
        const newHours = parseInt(h) + (parseInt(m) + 15 >= 60 ? 1 : 0);
        return `${String(newHours % 24).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ========================
  // TAREFAS COM PROGRESSO
  // ========================
  const tarefas = {
    // Sprint 9 - E2E Tests (Pendência)
    e2e: {
      numero: 'S9-6',
      nome: 'E2E Analytics Tests',
      descricao: 'Finalizar testes de compliance para reports',
      pontos: 3,
      status: 'em_progresso',
      progresso: 90,
      dias: 0.25, // 2 horas
      dataInicio: '05/03 08:00',
      detalhe: [
        { subtarefa: 'Test Coverage - Reports', concluida: true, tempo: '1h 15m' },
        { subtarefa: 'Test Coverage - Export', concluida: true, tempo: '45m' },
        { subtarefa: 'Validação Final & Merge', concluida: false, tempo: '~10m' }
      ]
    },
    // Sprint 10 - Task 1
    auth: {
      numero: 'S10-1',
      nome: 'Sistema de Autenticação & RBAC',
      descricao: 'OAuth2, JWT, Role-based Access Control',
      pontos: 8,
      status: 'em_progresso',
      progresso: 25,
      dias: 2,
      dataInicio: '05/03 08:30',
      detalhe: [
        { subtarefa: 'OAuth2 Setup (Google + GitHub)', concluida: true, tempo: '30m' },
        { subtarefa: 'JWT Token Generation', concluida: true, tempo: '45m' },
        { subtarefa: 'Middleware de Autenticação', concluida: false, tempo: '~2h' },
        { subtarefa: 'RBAC Rules Engine', concluida: false, tempo: '~2.5h' },
        { subtarefa: 'Frontend Login/Logout UI', concluida: false, tempo: '~1.5h' }
      ]
    },
    // Sprint 10 - Task 2
    audit: {
      numero: 'S10-2',
      nome: 'Audit Log & Compliance Tracking',
      descricao: 'Registrar todas as ações para LGPD',
      pontos: 8,
      status: 'nao_iniciado',
      progresso: 0,
      dias: 2,
      dataInicio: '07/03 (após Auth)',
      desbloqueador: 'Tarefa 1 (90%)'
    },
    // Sprint 10 - Task 3
    encrypt: {
      numero: 'S10-3',
      nome: 'Data Encryption & Field Security',
      descricao: 'Criptografia de dados sensíveis',
      pontos: 8,
      status: 'nao_iniciado',
      progresso: 0,
      dias: 2,
      dataInicio: '06/03 (paralelo)',
      desbloqueador: 'Nenhum'
    },
    // Sprint 10 - Task 4
    rateLimit: {
      numero: 'S10-4',
      nome: 'API Rate Limiting & DDoS',
      descricao: 'Proteção contra abuso',
      pontos: 6,
      status: 'nao_iniciado',
      progresso: 0,
      dias: 1.5,
      dataInicio: '05/03 14:00 (paralelo)',
      desbloqueador: 'Nenhum'
    },
    // Sprint 10 - Task 5
    lgpd: {
      numero: 'S10-5',
      nome: 'LGPD: Right to Erasure & Portability',
      descricao: 'Direito ao esquecimento e exportação de dados',
      pontos: 8,
      status: 'nao_iniciado',
      progresso: 0,
      dias: 2,
      dataInicio: '08/03 (após Audit)',
      desbloqueador: 'Tarefa 2 (100%)'
    }
  };

  // Calcular métricas
  const pontosTotal = Object.values(tarefas).reduce((sum, t) => sum + t.pontos, 0);
  const pontosConcluidos = Object.values(tarefas)
    .filter(t => t.status === 'completo')
    .reduce((sum, t) => sum + t.pontos, 0);
  const pontosEmProgresso = Object.values(tarefas)
    .filter(t => t.status === 'em_progresso')
    .reduce((sum, t) => sum + (t.pontos * (t.progresso / 100)), 0);
  const percentualGeral = Math.round(((pontosConcluidos + pontosEmProgresso) / pontosTotal) * 100);

  const tarefasCompletas = Object.values(tarefas).filter(t => t.status === 'completo').length;
  const tarefasTotal = Object.values(tarefas).length;

  const toggleTarefa = (key) => {
    setExpandedTarefas(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900">Sprint 10 Execution — Live Monitor</h1>
            <div className="text-right">
              <p className="text-sm text-gray-600">📅 05/03/2026</p>
              <p className="text-2xl font-bold text-blue-700">{horaAtual}</p>
            </div>
          </div>
          <p className="text-gray-600">Security & Compliance (LGPD) — Execução em tempo real com rastreamento de completude</p>
        </div>

        {/* ================== STATUS GERAL ================== */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Completude */}
          <Card className="border-blue-300 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-800">Completude Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-700">{percentualGeral}%</p>
              <Progress value={percentualGeral} className="h-2 mt-2" />
              <p className="text-xs text-blue-600 mt-2">Sprint 10 Progress</p>
            </CardContent>
          </Card>

          {/* Tarefas */}
          <Card className="border-green-300 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-800">Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-700">{tarefasCompletas}/{tarefasTotal}</p>
              <p className="text-xs text-green-600 mt-2">Completas</p>
            </CardContent>
          </Card>

          {/* Story Points */}
          <Card className="border-purple-300 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-800">Story Points</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-700">{pontosConcluidos + Math.round(pontosEmProgresso)}/{pontosTotal}</p>
              <p className="text-xs text-purple-600 mt-2">Entregues</p>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="border-orange-300 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-800">Status Sprint 9</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-amber-600">🔄 90%</Badge>
              <p className="text-xs text-orange-600 mt-2">E2E Tests finalizando</p>
            </CardContent>
          </Card>

          {/* Dia */}
          <Card className="border-gray-300 bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-800">Dia Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-700">1/8</p>
              <p className="text-xs text-gray-600 mt-2">Sprint 10</p>
            </CardContent>
          </Card>
        </div>

        {/* ================== TAREFAS EM TEMPO REAL ================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              🔴 EXECUÇÃO EM TEMPO REAL — Dia 1 (05/03)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* E2E TESTS - Sprint 9 Pendência */}
            <div 
              className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg cursor-pointer hover:bg-amber-100"
              onClick={() => toggleTarefa('e2e')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-amber-600 animate-pulse"></div>
                  <div>
                    <h4 className="font-semibold text-amber-900">{tarefas.e2e.numero}: {tarefas.e2e.nome}</h4>
                    <p className="text-xs text-amber-700">📌 PENDÊNCIA SPRINT 9 → Finalizar antes de continuar</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-600">{tarefas.e2e.progresso}%</Badge>
                  {expandedTarefas.e2e ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
              <Progress value={tarefas.e2e.progresso} className="h-2 mt-2" />
              
              {expandedTarefas.e2e && (
                <div className="mt-4 space-y-2 border-t pt-4">
                  <p className="text-sm text-amber-800">📝 Subtarefas:</p>
                  {tarefas.e2e.detalhe.map((sub, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-amber-700">
                      {sub.concluida ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="line-through text-gray-500">{sub.subtarefa} ({sub.tempo})</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 rounded border border-amber-600"></div>
                          <span>{sub.subtarefa} ({sub.tempo})</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AUTH - TAREFA 1 */}
            <div 
              className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100"
              onClick={() => toggleTarefa('auth')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
                  <div>
                    <h4 className="font-semibold text-blue-900">{tarefas.auth.numero}: {tarefas.auth.nome}</h4>
                    <p className="text-xs text-blue-700">Desbloqueador: Tarefas 2, 3, 5</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">{tarefas.auth.progresso}%</Badge>
                  {expandedTarefas.auth ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
              <Progress value={tarefas.auth.progresso} className="h-2 mt-2" />
              
              {expandedTarefas.auth && (
                <div className="mt-4 space-y-2 border-t pt-4">
                  <p className="text-sm text-blue-800">📝 Subtarefas:</p>
                  {tarefas.auth.detalhe.map((sub, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-blue-700">
                      {sub.concluida ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="line-through text-gray-500">{sub.subtarefa} ({sub.tempo})</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 rounded border border-blue-600"></div>
                          <span>{sub.subtarefa} ({sub.tempo})</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RATE LIMITING - TAREFA 4 (Paralelo) */}
            <div 
              className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => toggleTarefa('rateLimit')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{tarefas.rateLimit.numero}: {tarefas.rateLimit.nome}</h4>
                    <p className="text-xs text-gray-700">🚀 Pode iniciar paralelo → Dia 1 14:00</p>
                  </div>
                </div>
                <Badge className="bg-gray-600">0%</Badge>
              </div>
            </div>

            {/* OUTRAS TAREFAS - Aguardando Desbloqueamento */}
            <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">📋 Tarefas Aguardando Desbloqueamento:</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <p className="font-medium">🔐 S10-3: Data Encryption (8 pts)</p>
                  <p className="text-xs text-gray-600">⏳ Desbloqueador: Nenhum → Pode iniciar Dia 1 paralelo</p>
                </div>
                <div className="border-t pt-2">
                  <p className="font-medium">📊 S10-2: Audit Log (8 pts)</p>
                  <p className="text-xs text-gray-600">⏳ Desbloqueador: Auth (90%) → Iniciará Dia 2</p>
                </div>
                <div className="border-t pt-2">
                  <p className="font-medium">⚖️ S10-5: LGPD (8 pts)</p>
                  <p className="text-xs text-gray-600">⏳ Desbloqueador: Audit Log (100%) → Iniciará Dia 3</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================== TIMELINE E AÇÕES ================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Próximas Ações */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Target className="w-5 h-5" />
                ✅ Próximas 2 Horas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="font-bold text-green-700">1.</span>
                <span>Finalizar E2E Tests (Validação) ✓ 10m</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-green-700">2.</span>
                <span>Merge E2E para main branch ✓ 5m</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-green-700">3.</span>
                <span>Middleware de Auth (completar) → ~2h</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-blue-700">4.</span>
                <span>Iniciar Rate Limiting paralelo (14:00) → ~1h</span>
              </div>
            </CardContent>
          </Card>

          {/* Métricas de Sucesso */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <TrendingUp className="w-5 h-5" />
                📊 Métricas Dia 1
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Completude Esperada</span>
                <span className="font-bold">15-20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Tarefas em Progresso</span>
                <span className="font-bold">2-3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Story Points Entregues</span>
                <span className="font-bold">3-5 pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Velocity Mantida</span>
                <span className="font-bold text-green-700">✅ 5.35pts/dia</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================== STATUS CONSOLIDADO ================== */}
        <Alert className="border-blue-200 bg-blue-50">
          <Zap className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-900 ml-2 space-y-2">
            <div>
              <strong>SPRINT 10 — DIA 1 EM EXECUÇÃO</strong>
              <p className="text-sm mt-1">
                🔴 Hora: {horaAtual} | E2E Tests: 90% (finaliza em ~20m) | Auth: 25% em progresso | Rate Limiting: pronto para iniciar
              </p>
            </div>
            <div>
              <strong>COMPLETUDE GERAL:</strong>
              <p className="text-sm mt-1">
                Sprint 9: 95% ✅ | Sprint 10: {percentualGeral}% 🚀 | Projeto: 67% (81/121 pts) | ETA Conclusão: 26/03/2026
              </p>
            </div>
            <div>
              <strong>PRÓXIMA ATUALIZAÇÃO:</strong> 1 hora (09:00) — Finalização E2E Tests + Progress Auth
            </div>
          </AlertDescription>
        </Alert>

      </div>
    </div>
  );
}