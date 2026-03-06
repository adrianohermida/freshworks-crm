import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Session Storage Backup para persistência offline
 * Salva dados críticos localmente para recuperação em caso de falha
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data, key } = await req.json();

    switch (action) {
      case 'backup_session':
        // Backup de dados críticos da sessão
        try {
          const backupData = {
            user_email: user.email,
            timestamp: new Date().toISOString(),
            data_backup: {
              processes: data?.processes || [],
              deadlines: data?.deadlines || [],
              contacts: data?.contacts || [],
              settings: data?.settings || {}
            }
          };

          // Salvar em entidade Analytics real
          const backup = await base44.asServiceRole.entities.Analytics.create({
            type: 'session_backup',
            user_email: user.email,
            data: backupData,
            created_at: new Date().toISOString()
          });

          return Response.json({
            backup_id: backup.id,
            size_bytes: JSON.stringify(backupData).length,
            items_backed_up: Object.keys(backupData.data_backup).length,
            status: 'success'
          });
        } catch (error) {
          return Response.json({ error: error.message }, { status: 500 });
        }

      case 'restore_session':
        // Recuperar dados do backup mais recente
        try {
          const backups = await base44.asServiceRole.entities.Analytics.filter({
            type: 'session_backup',
            user_email: user.email
          }, '-created_at', 1);

          if (backups.length === 0) {
            return Response.json({ data: { processes: [], deadlines: [], contacts: [], settings: {} } });
          }

          return Response.json({
            data: backups[0].data?.data_backup || {},
            restored_at: new Date().toISOString(),
            status: 'success'
          });
        } catch (error) {
          return Response.json({ error: error.message }, { status: 500 });
        }

      case 'list_backups':
        // Listar backups disponíveis do usuário
        try {
          const backups = await base44.asServiceRole.entities.Analytics.filter({
            type: 'session_backup',
            user_email: user.email
          }, '-created_at', 10);

          return Response.json({
            backups: backups.map(b => ({
              backup_id: b.id,
              created_at: b.created_at,
              size_bytes: JSON.stringify(b.data).length,
              items: b.data?.data_backup ? Object.keys(b.data.data_backup).length : 0
            })),
            total_backups: backups.length
          });
        } catch (error) {
          return Response.json({ error: error.message }, { status: 500 });
        }

      case 'cleanup_old_backups':
        // Limpar backups antigos (>7 dias)
        try {
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const backups = await base44.asServiceRole.entities.Analytics.filter({
            type: 'session_backup',
            user_email: user.email
          });

          let deleted = 0;
          for (const backup of backups) {
            if (new Date(backup.created_at) < sevenDaysAgo) {
              await base44.asServiceRole.entities.Analytics.delete(backup.id);
              deleted++;
            }
          }

          return Response.json({
            deleted_count: deleted,
            status: 'success'
          });
        } catch (error) {
          return Response.json({ error: error.message }, { status: 500 });
        }

      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});