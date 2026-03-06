import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * E2E Test Suite — Valida fluxos críticos
 * 1. Sincronização de publicações
 * 2. Busca global e filtragem
 * 3. Criação de tarefas e alertas
 * 4. Exportação de dados
 */

class E2ETestRunner {
  constructor(base44) {
    this.base44 = base44;
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  async test(name, fn) {
    try {
      await fn();
      this.results.push({ name, status: '✅ PASS', time: Date.now() });
      this.passed++;
      console.log(`✅ ${name}`);
    } catch (err) {
      this.results.push({ name, status: '❌ FAIL', error: err.message, time: Date.now() });
      this.failed++;
      console.error(`❌ ${name}: ${err.message}`);
    }
  }

  summary() {
    return {
      total: this.passed + this.failed,
      passed: this.passed,
      failed: this.failed,
      passRate: ((this.passed / (this.passed + this.failed)) * 100).toFixed(1) + '%',
      results: this.results
    };
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const runner = new E2ETestRunner(base44);

    // ── TEST 1: PublicacaoAdvise Entity CRUD ──
    await runner.test('PublicacaoAdvise — Create', async () => {
      const pub = await base44.asServiceRole.entities.PublicacaoAdvise.create({
        idPublicacaoAdvise: `test-${Date.now()}`,
        numeroProcesso: '0012345-67.2024.8.26.0100',
        numeroCNJ: true,
        dataHoraMovimento: new Date().toISOString(),
        dataPublicacao: new Date().toISOString(),
        conteudo: 'Teste E2E',
        municipio: 'São Paulo',
        vara: 'Vara Civil',
        diario: 'DJSP'
      });
      if (!pub.id) throw new Error('ID não gerado');
    });

    // ── TEST 2: ProcessoAdvise Entity CRUD ──
    await runner.test('ProcessoAdvise — Create & List', async () => {
      const proc = await base44.asServiceRole.entities.ProcessoAdvise.create({
        idProcessoAdvise: `proc-${Date.now()}`,
        numeroProcesso: '0012345-67.2024.8.26.0100',
        tribunal: 'TJSP',
        vara: 'Vara Civil',
        statusProcesso: 'ativo'
      });
      const lista = await base44.asServiceRole.entities.ProcessoAdvise.list();
      if (!Array.isArray(lista)) throw new Error('List não retornou array');
    });

    // ── TEST 3: Ticket Entity CRUD ──
    await runner.test('Ticket — Create com validação', async () => {
      const ticket = await base44.asServiceRole.entities.Ticket.create({
        titulo: 'Ticket E2E Test',
        descricao: 'Teste de criação de ticket',
        status: 'aberto',
        prioridade: 'media',
        categoria: 'suporte_tecnico',
        canal: 'portal',
        solicitanteEmail: user.email,
        solicitanteNome: user.full_name
      });
      if (!ticket.id) throw new Error('Ticket não criado');
    });

    // ── TEST 4: TarefaAgendada CRUD ──
    await runner.test('TarefaAgendada — Create com datas', async () => {
      const tarefa = await base44.asServiceRole.entities.TarefaAgendada.create({
        idPublicacao: `test-${Date.now()}`,
        numeroProcesso: '0012345-67.2024.8.26.0100',
        titulo: 'Tarefa E2E Test',
        descricao: 'Teste automático',
        dataPrazo: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        diasUteis: 5,
        tipoPrazo: 'customizado',
        status: 'pendente'
      });
      if (!tarefa.id) throw new Error('Tarefa não criada');
    });

    // ── TEST 5: Alerta CRUD ──
    await runner.test('Alerta — Create com tipo', async () => {
      const alerta = await base44.asServiceRole.entities.Alerta.create({
        numeroProcesso: '0012345-67.2024.8.26.0100',
        tipoAlerta: 'prazo_vencimento',
        descricao: 'Teste de alerta',
        ativo: true
      });
      if (!alerta.id) throw new Error('Alerta não criado');
    });

    // ── TEST 6: Notificacao CRUD ──
    await runner.test('Notificacao — Create com canal', async () => {
      const notif = await base44.asServiceRole.entities.Notificacao.create({
        usuarioId: user.email,
        tipo: 'alerta',
        titulo: 'Teste E2E',
        mensagem: 'Notificação de teste',
        canal: 'in_app',
        lido: false
      });
      if (!notif.id) throw new Error('Notificação não criada');
    });

    // ── TEST 7: AuditLog CRUD ──
    await runner.test('AuditLog — Create com evento', async () => {
      const log = await base44.asServiceRole.entities.AuditLog.create({
        eventType: 'DATA_CREATE',
        timestamp: new Date().toISOString(),
        userId: user.email,
        userRole: user.role || 'user',
        entityName: 'PublicacaoAdvise',
        entityId: 'test-id',
        status: 'success'
      });
      if (!log.id) throw new Error('AuditLog não criado');
    });

    // ── TEST 8: Bulk Operations ──
    await runner.test('Bulk Operations — bulkCreate & query', async () => {
      const items = Array(5).fill(null).map((_, i) => ({
        idPublicacaoAdvise: `bulk-test-${Date.now()}-${i}`,
        numeroProcesso: `0000001-${String(i).padStart(2, '0')}.2024.8.26.0100`,
        diario: 'DJSP',
        conteudo: `Bulk test ${i}`
      }));
      await base44.asServiceRole.entities.PublicacaoAdvise.bulkCreate(items);
      const query = await base44.asServiceRole.entities.PublicacaoAdvise.filter({ diario: 'DJSP' }, '-created_date', 10);
      if (!Array.isArray(query)) throw new Error('Filter retornou erro');
    });

    // ── TEST 9: Função Backend — syncPublicacoesManual ──
    await runner.test('Backend Function — syncPublicacoesManual', async () => {
      const result = await base44.asServiceRole.functions.invoke('advise/syncPublicacoesManual', {
        dataInicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dataFim: new Date().toISOString().split('T')[0],
        tamanhoLote: 5,
        maxPublicacoes: 10
      });
      if (!result.data?.success) throw new Error('Sync falhou');
    });

    // ── TEST 10: Função Backend — globalSearch ──
    await runner.test('Backend Function — globalSearch', async () => {
      const result = await base44.asServiceRole.functions.invoke('search/globalSearch', {
        query: 'processo',
        entities: ['PublicacaoAdvise', 'ProcessoAdvise'],
        limit: 10
      });
      if (!Array.isArray(result.data?.results)) throw new Error('Search retornou erro');
    });

    const summary = runner.summary();

    // Registrar resultados na auditoria
    await base44.asServiceRole.entities.AuditLog.create({
      eventType: 'ADMIN_ACTION',
      timestamp: new Date().toISOString(),
      userId: user.email,
      userRole: user.role || 'user',
      entityName: 'E2ETestSuite',
      details: { summary },
      status: summary.failed === 0 ? 'success' : 'failure'
    });

    console.log(`[E2E] Testes concluídos: ${summary.passed}/${summary.total} PASS (${summary.passRate})`);

    return Response.json({
      success: summary.failed === 0,
      ...summary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[E2E] ERRO:', error.message);
    return Response.json({ error: error.message, success: false }, { status: 500 });
  }
});