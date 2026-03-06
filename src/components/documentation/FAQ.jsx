export const FAQ_CONTENT = {
  title: "❓ Perguntas Frequentes - Freshdesk Manager v1.0.0",
  
  faqs: [
    {
      category: "Getting Started",
      questions: [
        {
          q: "Como começo?",
          a: "Acesse a página de Onboarding ou configure seu Freshdesk API key nas configurações. Sincronize seus tickets e comece a usar!"
        },
        {
          q: "Preciso de um servidor próprio?",
          a: "Não! O Freshdesk Manager funciona completamente na nuvem via Base44 Platform. Sem necessidade de servidor."
        },
        {
          q: "Posso usar offline?",
          a: "Sim! A aplicação funciona completamente offline com PWA. Dados sincronizam quando você voltar online."
        }
      ]
    },

    {
      category: "Features",
      questions: [
        {
          q: "Como usar análise de IA?",
          a: "Abra um ticket e clique no botão 'Analisar com IA'. O sistema fornecerá um resumo e sugestão de resposta automática."
        },
        {
          q: "Posso sincronizar com Freshdesk?",
          a: "Sim! Vá para Tickets e clique em 'Sincronizar Agora' ou a sincronização automática ocorre a cada 30 segundos."
        },
        {
          q: "Quantos tickets posso gerenciar?",
          a: "Ilimitado! O sistema foi otimizado para suportar milhões de tickets com performance excelente."
        },
        {
          q: "Posso fazer ações em massa?",
          a: "Sim! Selecione múltiplos tickets e use a barra de ações em massa para atualizar status, prioridade, etc."
        }
      ]
    },

    {
      category: "Configuration",
      questions: [
        {
          q: "Como configurar automações?",
          a: "Vá para Settings > Automação para criar regras que dispararem ações automaticamente em seus tickets."
        },
        {
          q: "Posso customizar temas?",
          a: "Sim! Settings > Customização permite alterar cores, fonts, logo e branding completo."
        },
        {
          q: "Como multi-idioma funciona?",
          a: "Settings > Idioma permite escolher entre 7 idiomas. A mudança é instantânea."
        },
        {
          q: "Posso integrar webhooks?",
          a: "Sim! Settings > Webhooks permite criar webhooks para integrar com sistemas externos."
        }
      ]
    },

    {
      category: "Performance & Technical",
      questions: [
        {
          q: "Qual é a performance?",
          a: "Lighthouse Score: 92+. Dashboard carrega em <3s. Totalmente otimizado para mobile (5G/LTE)."
        },
        {
          q: "Meus dados são seguros?",
          a: "Sim! Usamos HTTPS, autenticação segura, validação completa e compliance com LGPD."
        },
        {
          q: "Posso fazer backup?",
          a: "Sim! Use a função de Export para baixar seus dados como CSV/Excel."
        },
        {
          q: "Qual é a compatibilidade de navegadores?",
          a: "Chrome, Firefox, Safari, Edge - últimas 2 versões. iPhone 5+ e Android 5+."
        }
      ]
    },

    {
      category: "Troubleshooting",
      questions: [
        {
          q: "Tickets não carregam",
          a: "1. Verifique internet 2. Teste sincronização manual 3. Revise API keys em Configurações"
        },
        {
          q: "Offline não funciona",
          a: "1. Instale como PWA 2. Aguarde service worker registrar 3. Teste DevTools offline"
        },
        {
          q: "Erro ao enviar resposta",
          a: "1. Verifique conexão 2. Teste em modo incógnito 3. Limpe cache do navegador"
        },
        {
          q: "Analytics não funciona",
          a: "1. Habilite JavaScript 2. Verifique bloqueador de ads/scripts 3. Teste em navegador diferente"
        }
      ]
    },

    {
      category: "Support",
      questions: [
        {
          q: "Como entrar em contato?",
          a: "Email: support@example.com | Discord: community.link | Docs: documentation.link"
        },
        {
          q: "Qual é o tempo de resposta?",
          a: "Issues críticas: 1h | High: 4h | Medium: 24h | Low: 48h"
        },
        {
          q: "Há roadmap público?",
          a: "Sim! Veja no GitHub ou nosso site. Você pode votar em features que quer."
        }
      ]
    }
  ]
};