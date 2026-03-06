/**
 * RBAC Avançado para Enterprise
 * Role-Based Access Control com múltiplas hierarquias e permissões granulares
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

class RBACManager {
  constructor() {
    this.roles = new Map();
    this.users_roles = new Map();
    this.permissions = new Map();
    this.role_permissions = new Map();
  }

  criarRole(role_id, nome, descricao, nivel_hierarquico = 0) {
    const role = {
      id: role_id,
      nome,
      descricao,
      nivel_hierarquico,
      criada_em: new Date().toISOString(),
      ativa: true
    };

    this.roles.set(role_id, role);
    this.role_permissions.set(role_id, new Set());

    return role;
  }

  criarPermissao(perm_id, nome, recurso, acao) {
    const permission = {
      id: perm_id,
      nome,
      recurso, // 'process', 'user', 'report', etc
      acao, // 'read', 'write', 'delete', 'admin'
      criada_em: new Date().toISOString()
    };

    this.permissions.set(perm_id, permission);
    return permission;
  }

  atribuirPermissaoRole(role_id, perm_id) {
    if (!this.role_permissions.has(role_id)) {
      this.role_permissions.set(role_id, new Set());
    }
    
    this.role_permissions.get(role_id).add(perm_id);
    return { role_id, perm_id, atribuida: true };
  }

  atribuirRoleUsuario(usuario_id, role_id) {
    if (!this.users_roles.has(usuario_id)) {
      this.users_roles.set(usuario_id, []);
    }

    if (!this.users_roles.get(usuario_id).includes(role_id)) {
      this.users_roles.get(usuario_id).push(role_id);
    }

    return { usuario_id, role_id, atribuida: true };
  }

  verificarPermissao(usuario_id, recurso, acao) {
    const user_roles = this.users_roles.get(usuario_id) || [];
    
    for (const role_id of user_roles) {
      const perms = this.role_permissions.get(role_id) || new Set();
      
      for (const perm_id of perms) {
        const perm = this.permissions.get(perm_id);
        if (perm && perm.recurso === recurso && perm.acao === acao) {
          return { permitida: true, reason: 'permission_granted' };
        }
      }
    }

    return { permitida: false, reason: 'permission_denied' };
  }

  obterPermissoesUsuario(usuario_id) {
    const user_roles = this.users_roles.get(usuario_id) || [];
    const permissoes = new Set();

    for (const role_id of user_roles) {
      const perms = this.role_permissions.get(role_id) || new Set();
      perms.forEach(p => permissoes.add(p));
    }

    return {
      usuario_id,
      roles: user_roles,
      total_permissoes: permissoes.size,
      permissoes: Array.from(permissoes).map(p => this.permissions.get(p))
    };
  }

  obterRelatorioRBAC() {
    return {
      total_roles: this.roles.size,
      total_permissoes: this.permissions.size,
      total_usuarios: this.users_roles.size,
      media_permissoes_por_role: Math.round(
        Array.from(this.role_permissions.values()).reduce((a, p) => a + p.size, 0) / 
        Math.max(this.roles.size, 1)
      )
    };
  }
}

const rbacManager = new RBACManager();

// Inicializar roles padrão
rbacManager.criarRole('admin', 'Administrador', 'Acesso total ao sistema', 0);
rbacManager.criarRole('manager', 'Gerente', 'Acesso a relatórios e gestão', 1);
rbacManager.criarRole('user', 'Usuário', 'Acesso básico', 2);
rbacManager.criarRole('viewer', 'Visualizador', 'Somente leitura', 3);

// Inicializar permissões padrão
rbacManager.criarPermissao('p_process_read', 'Ler Processos', 'process', 'read');
rbacManager.criarPermissao('p_process_write', 'Criar/Editar Processos', 'process', 'write');
rbacManager.criarPermissao('p_process_delete', 'Deletar Processos', 'process', 'delete');
rbacManager.criarPermissao('p_user_admin', 'Administrar Usuários', 'user', 'admin');
rbacManager.criarPermissao('p_report_read', 'Ler Relatórios', 'report', 'read');

// Atribuir permissões aos roles
rbacManager.atribuirPermissaoRole('admin', 'p_process_write');
rbacManager.atribuirPermissaoRole('admin', 'p_process_delete');
rbacManager.atribuirPermissaoRole('admin', 'p_user_admin');
rbacManager.atribuirPermissaoRole('manager', 'p_process_read');
rbacManager.atribuirPermissaoRole('manager', 'p_report_read');
rbacManager.atribuirPermissaoRole('user', 'p_process_read');
rbacManager.atribuirPermissaoRole('viewer', 'p_process_read');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { operacao, role_id, nome, descricao, perm_id, recurso, acao, usuario_id } = body;

    if (!operacao) {
      return Response.json({ error: 'operacao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (operacao) {
      case 'criar_role':
        if (!role_id || !nome) {
          return Response.json({ error: 'role_id e nome são obrigatórios' }, { status: 400 });
        }
        resultado = rbacManager.criarRole(role_id, nome, descricao);
        break;

      case 'criar_permissao':
        if (!perm_id || !nome || !recurso || !acao) {
          return Response.json({ error: 'perm_id, nome, recurso e acao são obrigatórios' }, { status: 400 });
        }
        resultado = rbacManager.criarPermissao(perm_id, nome, recurso, acao);
        break;

      case 'atribuir_permissao_role':
        if (!role_id || !perm_id) {
          return Response.json({ error: 'role_id e perm_id são obrigatórios' }, { status: 400 });
        }
        resultado = rbacManager.atribuirPermissaoRole(role_id, perm_id);
        break;

      case 'atribuir_role_usuario':
        if (!usuario_id || !role_id) {
          return Response.json({ error: 'usuario_id e role_id são obrigatórios' }, { status: 400 });
        }
        resultado = rbacManager.atribuirRoleUsuario(usuario_id, role_id);
        break;

      case 'verificar_permissao':
        if (!usuario_id || !recurso || !acao) {
          return Response.json({ error: 'usuario_id, recurso e acao são obrigatórios' }, { status: 400 });
        }
        resultado = rbacManager.verificarPermissao(usuario_id, recurso, acao);
        break;

      case 'obter_permissoes_usuario':
        if (!usuario_id) {
          return Response.json({ error: 'usuario_id é obrigatório' }, { status: 400 });
        }
        resultado = rbacManager.obterPermissoesUsuario(usuario_id);
        break;

      case 'relatorio_rbac':
        resultado = rbacManager.obterRelatorioRBAC();
        break;

      default:
        return Response.json({ error: 'operacao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[rbacAvancadoEnterprise] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});