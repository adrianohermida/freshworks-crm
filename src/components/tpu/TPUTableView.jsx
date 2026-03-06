import React, { useState } from 'react';
import { Edit2, Save, X, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';

export default function TPUTableView({ tabela, dados, isLoading }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const entityMap = {
    assuntos: 'TPUAssuntos',
    classes: 'TPUClasses',
    movimentos: 'TPUMovimentos',
    documentos: 'TPUDocumentos'
  };

  const entityName = entityMap[tabela];

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleSave = async () => {
    if (!editingId || !entityName) return;

    setIsSaving(true);
    try {
      await base44.entities[entityName].update(editingId, {
        nome: editData.nome,
        dscGlossario: editData.dscGlossario,
        ativo: editData.ativo
      });

      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'success', message: 'Registro atualizado com sucesso' }
      }));

      setEditingId(null);
      setEditData({});
    } catch (error) {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'error', message: 'Erro ao salvar: ' + error.message }
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este registro?')) return;

    try {
      await base44.entities[entityName].delete(id);
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'success', message: 'Registro deletado com sucesso' }
      }));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'error', message: 'Erro ao deletar: ' + error.message }
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Carregando dados...</p>
      </div>
    );
  }

  if (!dados || dados.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">Nenhum registro encontrado. Sincronize a tabela.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total: <span className="font-bold">{dados.length}</span> registros
        </p>
      </div>

      <div className="space-y-3 max-h-[70vh] overflow-y-auto">
        {dados.map(item => (
          <Card key={item.id} className="p-4">
            {editingId === item.id ? (
              // EDIT MODE
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Código</label>
                  <Input disabled value={editData.codigo || ''} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Nome</label>
                  <Input
                    value={editData.nome || ''}
                    onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Descrição</label>
                  <Textarea
                    value={editData.dscGlossario || ''}
                    onChange={(e) => setEditData({ ...editData, dscGlossario: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </Button>
                  <Button
                    onClick={() => setEditingId(null)}
                    variant="outline"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              // VIEW MODE
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      {item.codigo}
                    </code>
                    {item.ativo === false && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-lg">{item.nome}</p>
                  {item.dscGlossario && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.dscGlossario}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    className="gap-2"
                  >
                    <Edit2 className="w-3 h-3" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    className="gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}