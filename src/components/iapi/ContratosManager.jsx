import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Save, X, CheckCircle2 } from 'lucide-react';

export default function ContratosManager({ usuario, contratos = [], onUpdate }) {
  const [editando, setEditando] = useState(null);
  const [adicionando, setAdicionando] = useState(false);
  const [novoContrato, setNovoContrato] = useState({
    palavraChave: '',
    variacoesPesquisa: [],
    diarios: [],
    cobertura: 'regional'
  });

  const handleAdicionarContrato = () => {
    if (novoContrato.palavraChave.trim()) {
      const contrato = {
        id: `CONTRATO-${Date.now()}`,
        ...novoContrato,
        status: 'ativo',
        totalDiarios: novoContrato.cobertura === 'nacional_completo' ? null : novoContrato.diarios.length,
        tipoPalavraChave: 'palavra_chave',
        variacoesExclusao: [],
        variacoesReprovadas: []
      };
      onUpdate([...contratos, contrato]);
      setNovoContrato({ palavraChave: '', variacoesPesquisa: [], diarios: [], cobertura: 'regional' });
      setAdicionando(false);
    }
  };

  const handleExcluirContrato = (id) => {
    onUpdate(contratos.filter(c => c.id !== id));
  };

  const handleEditarContrato = (id, updates) => {
    onUpdate(contratos.map(c => c.id === id ? { ...c, ...updates } : c));
    setEditando(null);
  };

  return (
    <div className="space-y-3">
      {contratos.map(c => (
        <Card key={c.id} className="p-4 border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{c.palavraChave}</span>
                <Badge className="text-xs bg-green-100 text-green-800">
                  <CheckCircle2 className="w-3 h-3 mr-1 inline" />Ativo
                </Badge>
                <Badge className={`text-xs ${c.cobertura === 'regional' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                  {c.cobertura === 'regional' ? 'Regional' : 'Nacional'}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                {c.variacoesPesquisa.length} variações · {c.totalDiarios ?? '∞'} diários
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setEditando(c.id)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleExcluirContrato(c.id)}
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {adicionando && (
        <Card className="p-4 border-2 border-blue-300 bg-blue-50">
          <div className="space-y-3">
            <Input
              placeholder="Palavra-chave principal"
              value={novoContrato.palavraChave}
              onChange={(e) => setNovoContrato({ ...novoContrato, palavraChave: e.target.value })}
              className="text-sm"
            />
            <select
              value={novoContrato.cobertura}
              onChange={(e) => setNovoContrato({ ...novoContrato, cobertura: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="regional">Regional</option>
              <option value="nacional">Nacional</option>
              <option value="nacional_completo">Nacional Completo</option>
            </select>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleAdicionarContrato}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-1" />Salvar
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setAdicionando(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Button 
        size="sm" 
        onClick={() => setAdicionando(true)}
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={adicionando}
      >
        <Plus className="w-4 h-4 mr-1" />Adicionar Contrato
      </Button>
    </div>
  );
}