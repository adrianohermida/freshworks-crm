import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * User Guide Generator
 * - Documentação em PT-BR
 * - Guias passo a passo
 * - Tutoriais em vídeo (links)
 * - FAQ
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'guide_list', lang = 'pt-BR' } = await req.json();

    // LIST GUIDES
    if (action === 'guide_list') {
      return Response.json({
        success: true,
        guides: [
          {
            id: 'getting_started',
            title: 'Como Começar',
            description: 'Guia rápido para primeiros passos',
            duration: '5 minutos',
            sections: 5
          },
          {
            id: 'add_process',
            title: 'Adicionar Processos',
            description: 'Sincronize seus processos com DataJud',
            duration: '3 minutos',
            sections: 3
          },
          {
            id: 'manage_deadlines',
            title: 'Gerenciar Prazos',
            description: 'Configure alertas e acompanhe prazos',
            duration: '4 minutos',
            sections: 4
          },
          {
            id: 'analytics_guide',
            title: 'Usar Analytics',
            description: 'Análises e relatórios de processos',
            duration: '6 minutos',
            sections: 5
          },
          {
            id: 'integrations',
            title: 'Integrações',
            description: 'Conecte Slack, Zapier e mais',
            duration: '5 minutos',
            sections: 4
          }
        ]
      });
    }

    // GET DETAILED GUIDE
    if (action === 'get_guide') {
      const { guide_id } = await req.json();

      const guides = {
        getting_started: {
          title: 'Como Começar no DataJud',
          language: lang,
          sections: [
            {
              title: '1. Criar sua Conta',
              content: 'Visite datajud.io/signup e crie sua conta com email e senha. Você receberá um email de confirmação.'
            },
            {
              title: '2. Fazer Login',
              content: 'Use suas credenciais para acessar o dashboard principal.'
            },
            {
              title: '3. Adicionar seu Primeiro Processo',
              content: 'Clique em "Adicionar Processo" e insira o número CNJ do seu processo.'
            },
            {
              title: '4. Sincronizar com DataJud',
              content: 'O sistema sincronizará automaticamente com a base de dados do CNJ.'
            },
            {
              title: '5. Acompanhar Prazos',
              content: 'Configure lembretes para prazos importantes.'
            }
          ],
          video_url: 'https://youtube.com/datajud-intro',
          estimated_time: '5 minutos'
        },
        add_process: {
          title: 'Adicionar Processos',
          language: lang,
          sections: [
            {
              title: 'Passo 1: Abra a seção Processos',
              content: 'No menu lateral, clique em "Processos"'
            },
            {
              title: 'Passo 2: Clique em Adicionar Processo',
              content: 'Use o botão verde "Adicionar Processo"'
            },
            {
              title: 'Passo 3: Insira o número CNJ',
              content: 'Formato: NNNNNNN-DD.AAAA.J.TT.OOOO'
            }
          ],
          video_url: 'https://youtube.com/datajud-add-process',
          estimated_time: '3 minutos'
        }
      };

      return Response.json({
        success: true,
        guide: guides[guide_id] || { error: 'Guide not found' }
      });
    }

    // GET FAQ
    if (action === 'faq') {
      return Response.json({
        success: true,
        faq: [
          {
            question: 'Como encontro o número CNJ do meu processo?',
            answer: 'O número CNJ tem 20 dígitos no formato NNNNNNN-DD.AAAA.J.TT.OOOO. Procure no seu processo ou na intimação.'
          },
          {
            question: 'Qual é a frequência de sincronização com DataJud?',
            answer: 'A sincronização ocorre em tempo real quando há atualizações no DataJud, tipicamente a cada hora.'
          },
          {
            question: 'Posso compartilhar processos com meu time?',
            answer: 'Sim, você pode convidar membros do time. Acesse Configurações > Membros da Equipe.'
          },
          {
            question: 'Qual é o limite de processos que posso acompanhar?',
            answer: 'Plano Gratuito: 50 processos. Plano Pro: Ilimitado.'
          },
          {
            question: 'Como configuro alertas de prazo?',
            answer: 'Em cada prazo, clique em "Configurar Alerta" e escolha quando deseja ser notificado (1 dia, 3 dias antes, etc).'
          }
        ]
      });
    }

    // GET TROUBLESHOOTING
    if (action === 'troubleshooting') {
      return Response.json({
        success: true,
        troubleshooting: [
          {
            problem: 'Processo não sincroniza com DataJud',
            solution: 'Verifique se o número CNJ está correto. Se persistir, tente novamente em algumas horas.'
          },
          {
            problem: 'Não recebi email de confirmação',
            solution: 'Verifique a pasta de spam. Clique em "Reenviar email" nas configurações.'
          },
          {
            problem: 'Esqueci minha senha',
            solution: 'Clique em "Esqueceu a senha?" na tela de login e siga as instruções.'
          },
          {
            problem: 'Meus dados não são salvos',
            solution: 'Verifique sua conexão de internet. Tente recarregar a página.'
          }
        ]
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[UserGuideGenerator] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});