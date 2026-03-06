import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export default function PublicacaoFilters({ 
  onFilterChange, 
  usuarios = [], 
  palavrasChaveFiltro = [] 
}) {
  const [usuariosSelecionados, setUsuariosSelecionados] = React.useState([]);
  const [palavrasChaveSelecionadas, setPalavrasChaveSelecionadas] = React.useState([]);
  const [buscaPalavra, setBuscaPalavra] = React.useState('');
  const [buscaUsuario, setBuscaUsuario] = React.useState('');

  const handleAdicionarUsuario = (email) => {
    if (email && !usuariosSelecionados.includes(email)) {
      const novosUsuarios = [...usuariosSelecionados, email];
      setUsuariosSelecionados(novosUsuarios);
      onFilterChange({ usuarios: novosUsuarios, palavrasChave: palavrasChaveSelecionadas });
      setBuscaUsuario('');
    }
  };

  const handleRemoverUsuario = (email) => {
    const novosUsuarios = usuariosSelecionados.filter(u => u !== email);
    setUsuariosSelecionados(novosUsuarios);
    onFilterChange({ usuarios: novosUsuarios, palavrasChave: palavrasChaveSelecionadas });
  };

  const handleAdicionarPalavra = (palavra) => {
    if (palavra && !palavrasChaveSelecionadas.includes(palavra)) {
      const novasPalavras = [...palavrasChaveSelecionadas, palavra];
      setPalavrasChaveSelecionadas(novasPalavras);
      onFilterChange({ usuarios: usuariosSelecionados, palavrasChave: novasPalavras });
      setBuscaPalavra('');
    }
  };

  const handleRemoverPalavra = (palavra) => {
    const novasPalavras = palavrasChaveSelecionadas.filter(p => p !== palavra);
    setPalavrasChaveSelecionadas(novasPalavras);
    onFilterChange({ usuarios: usuariosSelecionados, palavrasChave: novasPalavras });
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nome.toLowerCase().includes(buscaUsuario.toLowerCase()) ||
    u.email.toLowerCase().includes(buscaUsuario.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      {/* Linha 1: Inputs de filtro inline */}
      <div className="flex gap-2 items-end flex-wrap">
        <div className="flex-1 min-w-40">
          <label className="block text-xs font-medium text-gray-600 mb-1">Usuário</label>
          <Input
            placeholder="Buscar usuário..."
            value={buscaUsuario}
            onChange={(e) => setBuscaUsuario(e.target.value)}
            className="text-sm h-8"
          />
          {buscaUsuario && usuariosFiltrados.length > 0 && (
            <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
              {usuariosFiltrados.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleAdicionarUsuario(u.email)}
                  className="block w-full text-left px-2 py-1 text-xs hover:bg-blue-50 rounded text-gray-700"
                >
                  {u.nome}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-40">
          <label className="block text-xs font-medium text-gray-600 mb-1">Palavras-chave</label>
          <Input
            placeholder="Buscar palavra-chave..."
            value={buscaPalavra}
            onChange={(e) => setBuscaPalavra(e.target.value)}
            className="text-sm h-8"
          />
          {buscaPalavra && palavrasChaveFiltro.length > 0 && (
            <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
              {palavrasChaveFiltro
                .filter(p => p.toLowerCase().includes(buscaPalavra.toLowerCase()))
                .slice(0, 5)
                .map(p => (
                  <button
                    key={p}
                    onClick={() => handleAdicionarPalavra(p)}
                    className="block w-full text-left px-2 py-1 text-xs hover:bg-blue-50 rounded text-gray-700"
                  >
                    {p}
                  </button>
                ))}
            </div>
          )}
        </div>

        {(usuariosSelecionados.length > 0 || palavrasChaveSelecionadas.length > 0) && (
          <Button
            onClick={() => {
              setUsuariosSelecionados([]);
              setPalavrasChaveSelecionadas([]);
              onFilterChange({ usuarios: [], palavrasChave: [] });
            }}
            variant="outline"
            size="sm"
            className="h-8 text-xs"
          >
            Limpar
          </Button>
        )}
      </div>

      {/* Linha 2: Badges de filtros ativos */}
      {(usuariosSelecionados.length > 0 || palavrasChaveSelecionadas.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {usuariosSelecionados.map(email => (
            <Badge 
              key={email}
              className="bg-purple-100 text-purple-800 cursor-pointer flex items-center gap-1 text-xs"
            >
              {usuarios.find(u => u.email === email)?.nome || email}
              <X 
                className="w-3 h-3" 
                onClick={() => handleRemoverUsuario(email)}
              />
            </Badge>
          ))}
          {palavrasChaveSelecionadas.map(palavra => (
            <Badge 
              key={palavra}
              className="bg-blue-100 text-blue-800 cursor-pointer flex items-center gap-1 text-xs"
            >
              {palavra}
              <X 
                className="w-3 h-3" 
                onClick={() => handleRemoverPalavra(palavra)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}