import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ACTION_COLORS = {
  create: 'bg-green-100 text-green-800',
  read: 'bg-blue-100 text-blue-800',
  update: 'bg-yellow-100 text-yellow-800',
  delete: 'bg-red-100 text-red-800'
};

const ACTION_LABELS = {
  create: '✨ Criado',
  read: '👁️ Lido',
  update: '✏️ Atualizado',
  delete: '🗑️ Deletado'
};

export default function AuditLogViewer() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    entityType: '',
    action: '',
    userEmail: ''
  });
  const pageSize = 20;

  const { data: allLogs = [], isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.AuditLog.list('-timestamp', 1000),
    initialData: []
  });

  const filteredLogs = allLogs.filter(log => {
    if (filters.entityType && log.entity_type !== filters.entityType) return false;
    if (filters.action && log.action !== filters.action) return false;
    if (filters.userEmail && !log.user_email.includes(filters.userEmail)) return false;
    return true;
  });

  const paginatedLogs = filteredLogs.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const uniqueEntities = [...new Set(allLogs.map(l => l.entity_type))];
  const uniqueActions = [...new Set(allLogs.map(l => l.action))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Entidade</label>
              <select
                value={filters.entityType}
                onChange={(e) => {
                  setFilters({ ...filters, entityType: e.target.value });
                  setPage(0);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Todas</option>
                {uniqueEntities.map(entity => (
                  <option key={entity} value={entity}>{entity}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Ação</label>
              <select
                value={filters.action}
                onChange={(e) => {
                  setFilters({ ...filters, action: e.target.value });
                  setPage(0);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Todas</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>
                    {ACTION_LABELS[action] || action}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email do Usuário</label>
              <Input
                type="text"
                placeholder="Filtrar por email"
                value={filters.userEmail}
                onChange={(e) => {
                  setFilters({ ...filters, userEmail: e.target.value });
                  setPage(0);
                }}
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Registros de Auditoria ({filteredLogs.length})
            </CardTitle>
            <span className="text-sm text-gray-600">
              Página {page + 1} de {totalPages || 1}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">Carregando logs...</p>
          ) : paginatedLogs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum log encontrado</p>
          ) : (
            <div className="space-y-3">
              {paginatedLogs.map((log) => (
                <div
                  key={log.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge className={ACTION_COLORS[log.action]}>
                        {ACTION_LABELS[log.action]}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">
                          {log.entity_type} <span className="text-gray-600">({log.entity_id})</span>
                        </p>
                        <p className="text-xs text-gray-600">
                          {log.user_name} ({log.user_email})
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(log.timestamp), 'PPP p', { locale: ptBR })}
                    </span>
                  </div>

                  {log.reason && (
                    <div className="bg-gray-100 rounded px-3 py-2 mb-3">
                      <p className="text-xs text-gray-700">
                        <strong>Motivo:</strong> {log.reason}
                      </p>
                    </div>
                  )}

                  {Object.keys(log.changes || {}).length > 0 && (
                    <details className="text-xs text-gray-600">
                      <summary className="cursor-pointer font-medium mb-2">
                        📝 Detalhes das Mudanças
                      </summary>
                      <pre className="bg-gray-50 p-2 rounded overflow-auto max-h-48 text-xs">
                        {JSON.stringify(log.changes, null, 2)}
                      </pre>
                    </details>
                  )}

                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                    {log.ip_address && <span>🌐 IP: {log.ip_address}</span>}
                    <span className={log.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {log.status === 'success' ? '✓ Sucesso' : '✗ Falha'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                {page * pageSize + 1} - {Math.min((page + 1) * pageSize, filteredLogs.length)} de {filteredLogs.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}