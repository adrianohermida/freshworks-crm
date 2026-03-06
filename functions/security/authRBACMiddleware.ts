import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * RBAC Middleware para validação de permissões
 * Desbloqueador crítico para Audit Log e LGPD Rights
 */
const ROLE_PERMISSIONS = {
  admin: ['read:*', 'write:*', 'delete:*', 'audit:*', 'lgpd:*'],
  manager: ['read:*', 'write:own', 'audit:read', 'lgpd:read'],
  user: ['read:own', 'write:own', 'lgpd:read'],
  guest: ['read:public']
};

const ROUTE_PERMISSIONS = {
  '/audit': 'audit:*',
  '/lgpd': 'lgpd:*',
  '/users': 'admin',
  '/settings': 'admin',
  '/dashboard': 'user',
  '/publicacoes': 'user'
};

async function authRBACMiddleware(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json(
        { error: 'Unauthorized: No authenticated user' },
        { status: 401 }
      );
    }

    // Validar role do usuário
    const userRole = user.role || 'user';
    if (!ROLE_PERMISSIONS[userRole]) {
      return Response.json(
        { error: 'Unauthorized: Invalid role' },
        { status: 403 }
      );
    }

    // Extrair path da URL
    const url = new URL(req.url);
    const path = url.pathname;

    // Validar permissão por rota
    const requiredPermission = getRequiredPermission(path);
    if (!hasPermission(userRole, requiredPermission)) {
      return Response.json(
        { error: `Forbidden: Missing permission "${requiredPermission}"` },
        { status: 403 }
      );
    }

    // Adicionar contexto de usuário ao request (para próximos handlers)
    return {
      success: true,
      user,
      userRole,
      permissions: ROLE_PERMISSIONS[userRole]
    };
  } catch (error) {
    return Response.json(
      { error: `Auth RBAC Error: ${error.message}` },
      { status: 500 }
    );
  }
}

function getRequiredPermission(path) {
  for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    if (path.startsWith(route)) {
      return permission;
    }
  }
  return 'read:public'; // Padrão
}

function hasPermission(role, requiredPermission) {
  const userPermissions = ROLE_PERMISSIONS[role] || [];
  
  // Wildcard check
  if (userPermissions.includes('*') || userPermissions.includes(requiredPermission)) {
    return true;
  }

  // Partial wildcard check (e.g., "read:*" matches "read:own")
  return userPermissions.some(perm => {
    if (perm.endsWith(':*')) {
      const prefix = perm.slice(0, -2);
      return requiredPermission.startsWith(prefix);
    }
    return false;
  });
}

Deno.serve(async (req) => {
  const result = await authRBACMiddleware(req);
  if (result.success) {
    return Response.json(result);
  }
  return result;
});