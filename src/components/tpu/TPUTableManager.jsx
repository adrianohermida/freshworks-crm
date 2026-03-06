import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { AlertCircle, Trash2, Edit2, Plus, Upload, ChevronUp, ChevronDown, Search, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TPUTableManager({ tableName, data, columns, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(columns[0]?.key || '');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const itemsPerPage = 10;

  // Filtrar dados
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(item =>
      columns.some(col =>
        String(item[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, columns]);

  // Ordenar dados
  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredData, sortField, sortOrder]);

  // Paginar dados
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Tem certeza que deseja deletar este registro?`)) return;
    
    setIsLoading(true);
    try {
      await base44.functions.invoke('tpuTableDelete', {
        tableName,
        recordId: id
      });
      setUploadError(null);
      onRefresh?.();
    } catch (error) {
      setUploadError(`Erro ao deletar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const fileUrl = await base44.integrations.Core.UploadFile({ file });
      
      await base44.functions.invoke('tpuCSVImport', {
        tableName,
        fileUrl: fileUrl.file_url
      });
      
      setUploadError(null);
      e.target.value = '';
      onRefresh?.();
    } catch (error) {
      setUploadError(`Erro ao importar CSV: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddManual = () => {
    setEditingItem({});
    setIsEditDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    setIsLoading(true);
    try {
      if (editingItem.id) {
        // Update
        await base44.functions.invoke('tpuTableUpdate', {
          tableName,
          recordId: editingItem.id,
          data: editingItem
        });
      } else {
        // Create
        await base44.functions.invoke('tpuTableCreate', {
          tableName,
          data: editingItem
        });
      }
      
      setUploadError(null);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      onRefresh?.();
    } catch (error) {
      setUploadError(`Erro ao salvar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold capitalize">{tableName}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {sortedData.length} registros encontrados
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddManual} className="gap-2 bg-cyan-600 hover:bg-cyan-700">
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Importar CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar CSV - {tableName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  disabled={isLoading}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                />
                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {uploadError}
                  </div>
                )}
                <p className="text-xs text-gray-600">
                  Envie um arquivo CSV com colunas correspondentes à tabela
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {uploadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{uploadError}</div>
        </div>
      )}

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar em todos os campos..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* TABLE */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="flex items-center gap-2 font-semibold"
                    >
                      {col.label}
                      {sortField === col.key && (
                        sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </TableHead>
                ))}
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id || Math.random()}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-sm">
                      {col.render ? col.render(item[col.key], item) : (
                        <div className="max-w-xs truncate">
                          {typeof item[col.key] === 'boolean' ? (
                            <Badge variant={item[col.key] ? 'default' : 'outline'}>
                              {item[col.key] ? 'Sim' : 'Não'}
                            </Badge>
                          ) : (
                            String(item[col.key] || '—')
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        disabled={isLoading}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={isLoading}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {paginatedData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum registro encontrado
          </div>
        )}
      </Card>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      {/* EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? 'Editar' : 'Adicionar novo'} {tableName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {columns.map((col) => (
              <div key={col.key}>
                <label className="block text-sm font-medium mb-1">{col.label}</label>
                {col.type === 'boolean' ? (
                  <select
                    value={editingItem?.[col.key] ? 'true' : 'false'}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      [col.key]: e.target.value === 'true'
                    })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                ) : col.type === 'textarea' ? (
                  <textarea
                    value={editingItem?.[col.key] || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      [col.key]: e.target.value
                    })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
                    rows={3}
                  />
                ) : (
                  <Input
                    type={col.type || 'text'}
                    value={editingItem?.[col.key] || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      [col.key]: e.target.value
                    })}
                    placeholder={col.label}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}