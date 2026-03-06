import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Middleware para Row-Level Security (RLS) - Multitenant Isolation
 * Garante que usuários só acessem dados do seu próprio tenant
 */

export async function applyTenantRLS(req, entityName, query = {}) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // RLS Query: Adiciona filtro created_by (user.email)
    const rlsQuery = {
      ...query,
      created_by: user.email // Isolamento por usuário (tenant)
    };

    return {
      success: true,
      query: rlsQuery,
      user: user.email,
      tenant: user.email // Email = tenant ID
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verifica se user pode acessar um recurso específico
 */
export function validateResourceAccess(userId, resourceOwnerId, userRole = 'user') {
  // Admin pode acessar qualquer coisa
  if (userRole === 'admin') {
    return { allowed: true, reason: 'admin_override' };
  }

  // Usuário regular só acessa seus próprios recursos
  if (userId === resourceOwnerId) {
    return { allowed: true, reason: 'owner' };
  }

  return { allowed: false, reason: 'unauthorized' };
}

/**
 * Build RLS filter for entity queries
 */
export function buildRLSFilter(userId, adminRole = false) {
  if (adminRole) {
    // Admins veem tudo (para desenvolvimento/debugging)
    return {};
  }
  
  return {
    created_by: userId
  };
}