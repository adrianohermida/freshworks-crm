import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Filter } from 'lucide-react';

export default function BuscaAvancadaProcesso() {
  const [filtros, setFiltros] = useState({
    cnj: '',
    litigante: '',
    tribunal: '',
    classe: '',
    ano: '',
    periodo: 'todos'
  });

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleBusca = async () => {
    setLoading(true);
    try {
      let tipo_busca = 'cnj';
      let termo = filtros.cnj;

      if (filtros.litigante) {
        tipo_busca = 'litigante';
        termo = filtros.litigante;
      } else if (filtros.classe) {
        tipo_busca = 'classe';
        termo = filtros.classe;
      } else if (filtros.tribunal) {
        tipo_busca = 'tribunal';
        termo = filtros.tribunal;
      }

      const resultado = await base44.functions.invoke('searchProcessoRepositorio', {
        tipo_busca,
        termo
      });

      if (resultado.data.success) {
        setResultados(resultado.data.resultado.processos);
      }
    } catch (err) {
      console.error('Erro na busca:', err);
      alert('Erro ao buscar processos');
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    setFiltros({
      cnj: '',
      litigante: '',
      tribunal: '',
      classe: '',
      ano: '',
      periodo: 'todos'
    });
    setResultados([]);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Busca Principal */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Busca por CNJ */}
            <div className="flex gap-3">
              <Input
                placeholder="Buscar por número CNJ (NNNNNNN-DD.AAAA.J.TT.OOOO.SSSSSS)"
                value={filtros.cnj}
                onChange={(e) => setFiltros({ ...filtros, cnj: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
                className="flex-1"
              />
              <Button onClick={handleBusca} disabled={loading} className="gap-2">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Buscar
              </Button>
              <Button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                variant="outline"
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>

            {/* Filtros Avançados */}
            {mostrarFiltros && (
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <Input
                  placeholder="Litigante/Contato"
                  value={filtros.litigante}
                  onChange={(e) => setFiltros({ ...filtros, litigante: e.target.value })}
                />
                <Input
                  placeholder="Tribunal (ex: tjsp, trf1)"
                  value={filtros.tribunal}
                  onChange={(e) => setFiltros({ ...filtros, tribunal: e.target.value })}
                />
                <Input
                  placeholder="Classe Processual"
                  value={filtros.classe}
                  onChange={(e) => setFiltros({ ...filtros, classe: e.target.value })}
                />
                <Input
                  placeholder="Ano"
                  type="number"
                  value={filtros.ano}
                  onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })}
                />

                <select
                  value={filtros.periodo}
                  onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="todos">Todos os períodos</option>
                  <option value="ultimo_mes">Último mês</option>
                  <option value="ultimos_3_meses">Últimos 3 meses</option>
                  <option value="ultimo_ano">Último ano</option>
                </select>

                <Button onClick={handleLimpar} variant="outline" className="col-span-2">
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {resultados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {resultados.length} resultado(s) encontrado(s)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resultados.map((proc) => (
              <div key={proc.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-mono font-bold text-cyan-600">{proc.cnj_number}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {proc.classe_nome} • {proc.tribunal_nome}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={proc.status_repositorio === 'verificado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {proc.status_repositorio}
                    </Badge>
                    {proc.sigiloso && (
                      <Badge variant="outline" className="border-red-200 text-red-800">🔒 Sigiloso</Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Assunto: {proc.assunto_nome || 'N/A'}
                </p>

                <div className="grid grid-cols-4 gap-4 text-xs text-gray-500">
                  <span>📄 {proc.total_movimentos} movimentos</span>
                  <span>👥 {proc.total_partes} partes</span>
                  <span>🔍 Verificado: {new Date(proc.data_verificacao_datajud).toLocaleDateString('pt-BR')}</span>
                  <span>⚡ Cache local</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!loading && resultados.length === 0 && (filtros.cnj || filtros.litigante || filtros.tribunal || filtros.classe) && (
        <Card>
          <CardContent className="text-center py-8 text-gray-500">
            Nenhum resultado encontrado. Tente refinar seus filtros.
          </CardContent>
        </Card>
      )}
    </div>
  );
}