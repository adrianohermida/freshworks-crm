import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MessageSquare, FileText, DollarSign } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ResumeLoader from "@/components/common/ResumeLoader";
import SingleHandNav from "@/components/mobile/SingleHandNav";
import ProcessoCardCliente from "@/components/cliente/ProcessoCardCliente";
import TicketCardCliente from "@/components/cliente/TicketCardCliente";
import AgendamentoCardCliente from "@/components/cliente/AgendamentoCardCliente";
import FaturaCardCliente from "@/components/cliente/FaturaCardCliente";
import DocumentoCardCliente from "@/components/cliente/DocumentoCardCliente";
import PlanoCardCliente from "@/components/cliente/PlanoCardCliente";

export default function MeuPainel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // 1. Usuário
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => base44.auth.me(),
  });

  // 2. Escritório (depende de user)
  const { data: escritorioList, isLoading: loadingEscritorio } = useQuery({
    queryKey: ["escritorio"],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user?.email,
  });
  const escritorio = escritorioList?.[0];

  // 3. Cliente vinculado (depende de escritório)
  const { data: clienteList } = useQuery({
    queryKey: ["cliente-by-email", user?.email, escritorio?.id],
    queryFn: () => base44.entities.Cliente.filter({ email: user.email, escritorio_id: escritorio.id }),
    enabled: !!escritorio?.id && !!user?.email,
  });
  const cliente = clienteList?.[0];

  // 4. Processos (escritorio_id garantido + dedup)
  const { data: processos = [] } = useQuery({
    queryKey: ["meu-painel-processos", user?.email, escritorio?.id],
    queryFn: async () => {
      const eid = escritorio.id;
      const [porClienteId, porEmail] = await Promise.all([
        cliente?.id ? base44.entities.Processo.filter({ cliente_id: cliente.id, escritorio_id: eid }, "-updated_date", 50).catch(() => []) : Promise.resolve([]),
        base44.entities.Processo.filter({ created_by: user.email, escritorio_id: eid }, "-updated_date", 50).catch(() => []),
      ]);
      const seen = new Set();
      return [...porClienteId, ...porEmail].filter(p => seen.has(p.id) ? false : seen.add(p.id));
    },
    enabled: !!escritorio?.id && !!user?.email,
  });

  // 5. Tickets (por email do cliente, com escritorio_id)
  const { data: tickets = [] } = useQuery({
    queryKey: ["meu-painel-tickets", user?.email, escritorio?.id],
    queryFn: () => base44.entities.Ticket.filter({ cliente_email: user.email, escritorio_id: escritorio.id }, "-created_date", 100),
    enabled: !!escritorio?.id && !!user?.email,
  });

  // 6. Agendamentos (por email do cliente)
  const { data: agendamentos = [] } = useQuery({
    queryKey: ["meu-painel-agendamentos", user?.email],
    queryFn: () => base44.entities.Appointment.filter({ cliente_email: user.email }, "-data", 100),
    enabled: !!user?.email,
  });

  // 7. Honorários (por cliente_id)
  const { data: honorarios = [] } = useQuery({
    queryKey: ["meu-painel-honorarios", cliente?.id],
    queryFn: () => base44.entities.Honorario.filter({ cliente_id: cliente.id, escritorio_id: escritorio.id }, "-created_date", 100),
    enabled: !!cliente?.id && !!escritorio?.id,
  });

  // 8. Documentos
  const { data: documentos = [] } = useQuery({
    queryKey: ["meu-painel-documentos", user?.email, escritorio?.id],
    queryFn: () => base44.entities.Documento.filter({ created_by: user.email, escritorio_id: escritorio.id }, "-created_date", 100),
    enabled: !!user?.email && !!escritorio?.id,
  });

  // 9. Planos
  const { data: planos = [] } = useQuery({
    queryKey: ["meu-painel-planos", cliente?.id],
    queryFn: () => base44.entities.PlanoPagamento.filter({ cliente_id: cliente.id, escritorio_id: escritorio.id }, "-created_date", 100),
    enabled: !!cliente?.id && !!escritorio?.id,
  });

  // 10. Validações de Documentos
  const { data: validacoes = [] } = useQuery({
    queryKey: ["meu-painel-validacoes", user?.email],
    queryFn: () => base44.entities.ValidacaoDocumento.filter({ cliente_email: user?.email }),
    enabled: !!user?.email,
  });

  if (loadingUser || loadingEscritorio) return <ResumeLoader />;
  if (!user) { navigate(createPageUrl("Home")); return null; }

  // Verificar se precisa completar onboarding
  const hasValidacoesPendentes = validacoes.some(v => v.status !== 'aprovado');
  const isDadosIncompletos = !cliente?.nome_completo || !cliente?.cpf || !cliente?.data_nascimento;
  
  if ((hasValidacoesPendentes || isDadosIncompletos) && !cliente?.consentimento_lgpd) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-4">
        <Card className="max-w-md bg-[var(--bg-elevated)]">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-4xl">📋</div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Precisamos completar seu cadastro
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {hasValidacoesPendentes ? 'Você precisa validar seus documentos' : 'Complete seus dados pessoais e envie documentos'}
            </p>
            <Button 
              onClick={() => navigate(createPageUrl('OnboardingCliente'))}
              className="w-full bg-[var(--brand-primary)]"
            >
              Completar Cadastro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const navItems = [
    { id: "overview", label: "Visão Geral", icon: FileText },
    { id: "processos", label: "Processos", icon: FileText },
    { id: "tickets", label: "Tickets", icon: MessageSquare },
    { id: "agendamentos", label: "Consultas", icon: Calendar },
    { id: "honorarios", label: "Honorários", icon: DollarSign },
    { id: "documentos", label: "Documentos", icon: FileText },
    { id: "plano", label: "Plano", icon: DollarSign },
  ];

  function EmptyCard({ message, ctaLabel, ctaUrl }) {
    return (
      <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
        <CardContent className="p-8 text-center">
          <p className="text-[var(--text-secondary)] mb-3">{message}</p>
          {ctaLabel && <Button onClick={() => navigate(createPageUrl(ctaUrl))} variant="outline" size="sm">{ctaLabel}</Button>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Bem-vindo, {user.full_name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">Seu painel de acompanhamento jurídico</p>
          </div>
          {escritorio?.whatsapp && (
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
              onClick={() => window.open(`https://wa.me/${escritorio.whatsapp.replace(/\D/g, '')}`, '_blank')}
            >
              <FaWhatsapp className="w-5 h-5 mr-2" />
              Falar no WhatsApp
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto">
          <SingleHandNav items={navItems} activeId={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex gap-4 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === item.id
                  ? "border-[var(--brand-primary)] text-[var(--brand-primary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24 md:pb-6">

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Processos", count: processos.length },
                { label: "Tickets", count: tickets.length },
                { label: "Consultas", count: agendamentos.length },
                { label: "Honorários Pendentes", count: honorarios.filter(h => h.status !== "pago").length },
              ].map(stat => (
                <Card key={stat.label}>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-[var(--brand-primary)]">{stat.count}</div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { tab: "processos", label: "Processos", icon: FileText },
                { tab: "tickets", label: "Tickets", icon: MessageSquare },
                { tab: "agendamentos", label: "Agendar", icon: Calendar },
                { tab: "honorarios", label: "Honorários", icon: DollarSign },
              ].map(btn => (
                <Button key={btn.tab} onClick={() => setActiveTab(btn.tab)} variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <btn.icon className="w-5 h-5" />
                  <span className="text-xs">{btn.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "processos" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Meus Processos</h2>
              <span className="text-sm text-[var(--text-secondary)]">{processos.length} processo(s)</span>
            </div>
            {processos.length === 0
              ? <EmptyCard message="Nenhum processo encontrado" />
              : <div className="grid gap-3">{processos.map(p => <ProcessoCardCliente key={p.id} processo={p} />)}</div>}
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Meus Tickets</h2>
              <Button onClick={() => navigate(createPageUrl("MeusTickets"))} className="bg-[var(--brand-primary)]" size="sm">
                <Plus className="w-4 h-4 mr-2" />Novo Chamado
              </Button>
            </div>
            {tickets.length === 0
              ? <EmptyCard message="Nenhum chamado aberto" ctaLabel="Abrir Chamado" ctaUrl="MeusTickets" />
              : <div className="grid gap-3">{tickets.map(t => <TicketCardCliente key={t.id} ticket={t} />)}</div>}
          </div>
        )}

        {activeTab === "agendamentos" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Minhas Consultas</h2>
              <Button onClick={() => navigate(createPageUrl("AgendarConsulta"))} className="bg-[var(--brand-primary)]" size="sm">
                <Plus className="w-4 h-4 mr-2" />Agendar
              </Button>
            </div>
            {agendamentos.length === 0
              ? <EmptyCard message="Nenhuma consulta agendada" ctaLabel="Agendar Consulta" ctaUrl="AgendarConsulta" />
              : <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{agendamentos.filter(Boolean).map(a => <AgendamentoCardCliente key={a.id} agendamento={a} />)}</div>}
          </div>
        )}

        {activeTab === "honorarios" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Meus Honorários</h2>
              <span className="text-sm text-[var(--text-secondary)]">{honorarios.length} honorário(s)</span>
            </div>
            {honorarios.length === 0
              ? <EmptyCard message="Nenhum honorário registrado" />
              : <div className="grid gap-3">{honorarios.map(h => <FaturaCardCliente key={h.id} honorario={h} />)}</div>}
          </div>
        )}

        {activeTab === "documentos" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Meus Documentos</h2>
              <Button onClick={() => navigate(createPageUrl("MeusDocumentos"))} className="bg-[var(--brand-primary)]" size="sm">
                <Plus className="w-4 h-4 mr-2" />Enviar
              </Button>
            </div>
            {documentos.length === 0
              ? <EmptyCard message="Nenhum documento anexado" ctaLabel="Enviar Documento" ctaUrl="MeusDocumentos" />
              : <div className="grid gap-3">{documentos.map(d => <DocumentoCardCliente key={d.id} documento={d} />)}</div>}
          </div>
        )}

        {activeTab === "plano" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Plano de Pagamento</h2>
              <span className="text-sm text-[var(--text-secondary)]">{planos.length} plano(s)</span>
            </div>
            {planos.length === 0
              ? <EmptyCard message="Nenhum plano de pagamento ativo" ctaLabel="Criar Plano" ctaUrl="MeuPlanoPagamento" />
              : <div className="grid gap-3">{planos.map(p => <PlanoCardCliente key={p.id} plano={p} />)}</div>}
          </div>
        )}
      </div>
    </div>
  );
}