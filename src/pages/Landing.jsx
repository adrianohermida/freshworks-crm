import React from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, Zap, Lock, BookOpen, Users, Quote } from 'lucide-react';
import Header from '@/components/aetherlab/Header';
import HeroSection from '@/components/aetherlab/HeroSection';
import ServicesSection from '@/components/aetherlab/ServicesSection';
import ClientLogosSection from '@/components/aetherlab/ClientLogosSection';
import TestimonialSlider from '@/components/aetherlab/TestimonialSlider';
import PricingSection from '@/components/aetherlab/PricingSection';
import BlogSection from '@/components/aetherlab/BlogSection';
import CallToActionSection from '@/components/aetherlab/CallToActionSection';
import Footer from '@/components/aetherlab/Footer';

export default function Landing() {
  const handleGetStarted = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        await base44.auth.redirectToLogin('/Dashboard');
      } else {
        window.location.href = '/Dashboard';
      }
    } catch (err) {
      console.error('Erro ao redirecionar:', err);
    }
  };

  const navItems = [
    { id: 'hero', label: 'Início', url: '#hero' },
    { id: 'services', label: 'Recursos', url: '#services' },
    { id: 'testimonials', label: 'Testemunhos', url: '#testimonials' },
    { id: 'pricing', label: 'Planos', url: '#pricing' },
    { id: 'blog', label: 'Blog', url: '#blog' }
  ];

  const services = [
    {
      icon: <Shield style={{ width: '48px', height: '48px' }} />,
      title: 'Integração DataJud',
      description: 'Sincronize automaticamente seus processos com a API Pública DataJud dos tribunais'
    },
    {
      icon: <Zap style={{ width: '48px', height: '48px' }} />,
      title: 'Atualizações em Tempo Real',
      description: 'Receba alertas instantâneos sobre movimentos processuais e prazos vencidos'
    },
    {
      icon: <Lock style={{ width: '48px', height: '48px' }} />,
      title: 'Segurança & LGPD',
      description: 'Seus dados estão protegidos com criptografia enterprise e compliance total'
    },
    {
      icon: <BookOpen style={{ width: '48px', height: '48px' }} />,
      title: 'Relatórios Profissionais',
      description: 'Gere relatórios em PDF dos seus processos em segundos'
    },
    {
      icon: <Users style={{ width: '48px', height: '48px' }} />,
      title: 'Gestão de Equipes',
      description: 'Colabore com sua equipe com controle de acesso e permissões'
    }
  ];

  const testimonials = [
    {
      content: 'LegalDock transformou a gestão dos meus processos. A integração com DataJud é perfeita e poupa muito tempo.',
      authorName: 'Dr. João Silva',
      authorRole: 'Advogado Especialista',
      authorImage: 'https://i.pravatar.cc/150?img=1',
      quoteIcon: <Quote size={32} />
    },
    {
      content: 'Excelente ferramenta! Os alertas de prazos funcionam perfeitamente e a interface é intuitiva.',
      authorName: 'Dra. Maria Santos',
      authorRole: 'Juíza Federal',
      authorImage: 'https://i.pravatar.cc/150?img=5',
      quoteIcon: <Quote size={32} />
    },
    {
      content: 'A melhor solução que encontrei para gerenciar múltiplos processos sem estresse.',
      authorName: 'Prof. Carlos Mendes',
      authorRole: 'Professor de Direito',
      authorImage: 'https://i.pravatar.cc/150?img=3',
      quoteIcon: <Quote size={32} />
    }
  ];

  const pricingPlans = [
    {
      title: 'Iniciante',
      subtitle: 'Para começar',
      price: '0',
      currency: 'R$',
      duration: '/mês',
      features: ['Até 50 processos', 'Sincronização DataJud', 'Alertas de prazos', 'Suporte por email'],
      buttonText: 'Começar Grátis',
      isPopular: false
    },
    {
      title: 'Profissional',
      subtitle: 'Para profissionais',
      price: '99',
      currency: 'R$',
      duration: '/mês',
      features: ['Até 500 processos', 'Sincronização ilimitada', 'Alertas avançados', 'Relatórios premium', 'Suporte prioritário'],
      buttonText: 'Começar Teste',
      isPopular: true,
      isFeatured: true
    },
    {
      title: 'Enterprise',
      subtitle: 'Para organizações',
      price: 'Customizado',
      currency: '',
      duration: '',
      features: ['Processos ilimitados', 'API customizada', 'Consultoria jurídica', 'SLA garantido', 'Suporte 24/7'],
      buttonText: 'Falar com Vendas',
      isPopular: false
    }
  ];

  const blogPosts = [
    {
      image: 'https://images.unsplash.com/photo-1554224311-beee415c15cb?w=400&h=250&fit=crop',
      title: 'Como otimizar a gestão de prazos processuais',
      excerpt: 'Dicas práticas para nunca mais perder um prazo importante com a ajuda da tecnologia.',
      author: 'Dr. João Silva',
      date: '15 de março, 2026',
      category: 'Gestão'
    },
    {
      image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=250&fit=crop',
      title: 'LGPD e proteção de dados em aplicações jurídicas',
      excerpt: 'Entenda como LegalDock garante a conformidade total com a Lei Geral de Proteção de Dados.',
      author: 'Dra. Ana Costa',
      date: '10 de março, 2026',
      category: 'Segurança'
    },
    {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
      title: 'Integração com API DataJud: guia completo',
      excerpt: 'Tutorial passo a passo para integrar dados dos tribunais direto na sua plataforma.',
      author: 'Prof. Carlos Mendes',
      date: '5 de março, 2026',
      category: 'Tutorial'
    }
  ];

  return (
    <div>
      <Header
        logo="https://via.placeholder.com/150x50?text=LegalDock"
        navItems={navItems}
        onNavClick={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
      />

      <HeroSection
        id="hero"
        subtitle="Plataforma Jurídica Inteligente"
        title="LegalDock"
        description="Gerencie seus processos judiciais com integração direta à API Pública DataJud"
        primaryButton={{ text: 'Começar Grátis', onClick: handleGetStarted }}
        secondaryButton={{ text: 'Saiba Mais', onClick: () => window.location.href = '#services' }}
        backgroundImage="https://images.unsplash.com/photo-1551288696-bebf217814c1?w=1200&h=600&fit=crop"
      />

      <ServicesSection
        id="services"
        subtitle="Recursos"
        title="Tudo que você precisa para gerenciar processos"
        services={services}
      />

      <ClientLogosSection />

      <TestimonialSlider
        id="testimonials"
        subtitle="Clientes"
        title="O que nossos usuários dizem"
        testimonials={testimonials}
        autoplay={true}
        autoplayDelay={6000}
      />

      <PricingSection
        id="pricing"
        subtitle="Preços"
        title="Planos para todos os tamanhos"
        pricingPlans={pricingPlans}
        onPlanSelect={(plan) => handleGetStarted()}
      />

      <BlogSection
        id="blog"
        subtitle="Blog"
        title="Artigos recentes"
        description="Dicas, tutoriais e notícias sobre gestão processual e tecnologia jurídica"
        posts={blogPosts}
        columns={3}
        onReadMore={(post) => console.log('Ler mais:', post)}
      />

      <CallToActionSection
        title="Pronto para revolucionar sua gestão processual?"
        description="Junte-se a centenas de profissionais do direito que já automatizam sua prática"
        buttonText="Começar Agora"
        buttonAction={handleGetStarted}
      />

      <Footer />
    </div>
  );
}