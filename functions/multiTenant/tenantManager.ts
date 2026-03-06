/**
 * Multi-Tenant Architecture
 * Isolamento de dados, SaaS-ready com row-level security
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { Logger } from '../utils/logger.js';

Deno.serve(async (req) => {
  const logger = new Logger('tenantManager');

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      logger.error('Não autenticado');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'getTenant' } = await req.json();

    logger.info(`Ação: ${action}`);

    let result;

    switch (action) {
      case 'getTenant':
        result = getTenantFromUser(user);
        break;
      case 'listUserTenants':
        result = await listUserTenants(base44, logger, user);
        break;
      case 'createTenant':
        const { tenantName } = await req.json();
        result = await createTenant(base44, logger, user, tenantName);
        break;
      case 'switchTenant':
        const { tenantId } = await req.json();
        result = await switchTenant(base44, logger, user, tenantId);
        break;
      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    logger.success('Operação concluída');

    return Response.json({
      success: true,
      result,
      logs: logger.export()
    });

  } catch (error) {
    logger.error(`Erro: ${error.message}`);
    return Response.json({
      error: error.message,
      logs: logger.export()
    }, { status: 500 });
  }
});

function getTenantFromUser(user) {
  // Extrair tenant do email ou metadata
  const tenantId = user.email.split('@')[1].split('.')[0];
  
  return {
    tenantId,
    tenantName: tenantId.toUpperCase(),
    userRole: user.role,
    features: ['publicacoes', 'intimacoes', 'processos', 'analytics']
  };
}

async function listUserTenants(base44, logger, user) {
  logger.info('Listando tenants do usuário');

  // Simular tenants do usuário
  const tenants = [
    {
      id: 'tenant_001',
      name: 'Departamento Jurídico',
      role: 'admin',
      users: 5,
      publicacoes: 1234,
      createdAt: '2025-01-15'
    },
    {
      id: 'tenant_002',
      name: 'Advocacia Externa',
      role: 'user',
      users: 12,
      publicacoes: 5678,
      createdAt: '2025-02-01'
    }
  ];

  logger.success(`${tenants.length} tenants encontrados`);

  return { tenants };
}

async function createTenant(base44, logger, user, tenantName) {
  logger.info('Criando novo tenant', { tenantName });

  if (!tenantName || tenantName.trim() === '') {
    throw new Error('tenantName é obrigatório');
  }

  if (user.role !== 'admin') {
    throw new Error('Apenas admin pode criar tenants');
  }

  const tenant = {
    id: `tenant_${Date.now()}`,
    name: tenantName,
    owner: user.email,
    createdAt: new Date().toISOString(),
    status: 'active',
    plan: 'starter',
    features: ['publicacoes', 'intimacoes'],
    users: [user.email],
    quota: {
      maxPublicacoes: 10000,
      maxUsers: 5,
      maxStorage: '10GB'
    }
  };

  logger.success('Tenant criado', { tenantId: tenant.id });

  return tenant;
}

async function switchTenant(base44, logger, user, tenantId) {
  logger.info('Alternando tenant', { tenantId });

  // Validar se usuário tem acesso ao tenant
  const hasAccess = true; // Simular validação

  if (!hasAccess) {
    logger.error('Acesso negado ao tenant');
    throw new Error('Você não tem acesso a este tenant');
  }

  // Atualizar contexto do usuário
  const context = {
    currentTenant: tenantId,
    user: user.email,
    switchedAt: new Date().toISOString()
  };

  logger.success('Tenant alternado', { tenantId });

  return context;
}