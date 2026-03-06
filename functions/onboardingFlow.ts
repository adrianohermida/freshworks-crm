import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Fluxo de Onboarding
 * - Guia inicial para novos usuários
 * - Setup wizard
 * - Templates de processos
 * - Checklist de primeiros passos
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'get_status' } = await req.json();

    // GET ONBOARDING STATUS
    if (action === 'get_status') {
      // Verificar se usuário já iniciou
      const prefs = await base44.asServiceRole.entities.NotificationPreference.filter(
        { user_id: user.email },
        null,
        1
      );

      const has_preference = prefs.length > 0;
      const processes = await base44.entities.Process.filter({ created_by: user.email }, null, 1);
      const has_processes = processes.length > 0;

      return Response.json({
        success: true,
        onboarding: {
          completed: has_preference && has_processes,
          stage: !has_preference ? 'profile_setup' : !has_processes ? 'first_process' : 'complete',
          user: {
            email: user.email,
            full_name: user.full_name,
            created_at: user.created_date
          },
          progress: {
            profile_setup: has_preference,
            first_process: has_processes,
            integrations: false,
            complete: has_preference && has_processes
          }
        }
      });
    }

    // START PROFILE SETUP
    if (action === 'setup_profile') {
      const { notification_preferences } = await req.json();

      await base44.entities.NotificationPreference.create({
        user_id: user.email,
        email_enabled: notification_preferences?.email ?? true,
        push_enabled: notification_preferences?.push ?? false,
        deadline_alerts: true,
        publication_alerts: true,
        movement_alerts: true
      });

      return Response.json({
        success: true,
        message: 'Preferências de notificação configuradas',
        next_step: 'Add first process'
      });
    }

    // CREATE FIRST PROCESS (TEMPLATE)
    if (action === 'create_first_process') {
      const { cnj_number, title } = await req.json();

      const process = await base44.entities.Process.create({
        cnj_number,
        title: title || 'Meu Primeiro Processo',
        status: 'active'
      });

      // Criar deadline exemplo
      const next_month = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await base44.entities.Deadline.create({
        process_id: process.id,
        title: 'Exemplo: Prazo importante',
        deadline_date: next_month.toISOString().split('T')[0],
        priority: 'high'
      });

      return Response.json({
        success: true,
        process,
        message: 'Primeiro processo criado com sucesso',
        next_step: 'Integrations setup'
      });
    }

    // GET ONBOARDING CHECKLIST
    if (action === 'get_checklist') {
      return Response.json({
        success: true,
        checklist: {
          title: 'Seus Primeiros Passos no DataJud',
          items: [
            {
              id: 'welcome',
              title: 'Bem-vindo ao DataJud!',
              description: 'Veja uma rápida introdução do que você pode fazer',
              status: 'done',
              icon: 'rocket'
            },
            {
              id: 'profile',
              title: 'Configure seu Perfil',
              description: 'Atualize informações pessoais e preferências',
              status: 'in_progress',
              icon: 'user'
            },
            {
              id: 'first_process',
              title: 'Adicione seu Primeiro Processo',
              description: 'Sincronize um processo do DataJud para começar',
              status: 'pending',
              icon: 'plus',
              action: {
                label: 'Adicionar Processo',
                path: '/processes'
              }
            },
            {
              id: 'notifications',
              title: 'Configure Notificações',
              description: 'Receba alertas sobre prazos e movimentos',
              status: 'pending',
              icon: 'bell',
              action: {
                label: 'Configurar',
                path: '/settings'
              }
            },
            {
              id: 'team',
              title: 'Convide sua Equipe (Opcional)',
              description: 'Adicione colegas para trabalhar em conjunto',
              status: 'pending',
              icon: 'users',
              action: {
                label: 'Convidar',
                path: '/settings'
              }
            },
            {
              id: 'integration',
              title: 'Integre com Ferramentas',
              description: 'Conecte Zapier, Slack ou outras plataformas',
              status: 'pending',
              icon: 'zap',
              action: {
                label: 'Explorar',
                path: '/marketplace'
              }
            }
          ],
          estimated_time: '15 minutes',
          progress_percentage: 33
        }
      });
    }

    // GET TUTORIAL VIDEOS
    if (action === 'get_tutorials') {
      return Response.json({
        success: true,
        tutorials: [
          {
            id: 'intro',
            title: 'Introdução ao DataJud',
            duration: '2:30',
            url: 'https://youtube.com/embed/example1',
            section: 'Getting Started'
          },
          {
            id: 'sync',
            title: 'Sincronizando Processos',
            duration: '3:15',
            url: 'https://youtube.com/embed/example2',
            section: 'Getting Started'
          },
          {
            id: 'notifications',
            title: 'Gerenciando Notificações',
            duration: '2:00',
            url: 'https://youtube.com/embed/example3',
            section: 'Features'
          },
          {
            id: 'analytics',
            title: 'Usando Analytics',
            duration: '4:10',
            url: 'https://youtube.com/embed/example4',
            section: 'Features'
          }
        ]
      });
    }

    // GET QUICK TIPS
    if (action === 'get_tips') {
      return Response.json({
        success: true,
        tips: [
          {
            id: 'tip1',
            title: 'Atalho Teclado',
            description: 'Pressione "/" para abrir a paleta de comandos',
            icon: 'keyboard'
          },
          {
            id: 'tip2',
            title: 'Busca Rápida',
            description: 'Cmd/Ctrl + K para buscar processos instantaneamente',
            icon: 'search'
          },
          {
            id: 'tip3',
            title: 'Modo Escuro',
            description: 'Acesse nas configurações para proteger seus olhos',
            icon: 'moon'
          },
          {
            id: 'tip4',
            title: 'Sincronização',
            description: 'DataJud atualiza seus processos a cada 4 horas',
            icon: 'refresh'
          }
        ]
      });
    }

    // MARK AS COMPLETE
    if (action === 'complete') {
      // Atualizar preferência para indicar onboarding completo
      return Response.json({
        success: true,
        message: 'Onboarding completo!',
        redirect: '/processes'
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[OnboardingFlow] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});