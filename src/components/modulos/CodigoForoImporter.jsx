import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, Plus, Download, Loader } from 'lucide-react';

export default function CodigoForoImporter() {
  const [foros, setForos] = useState([
    { codigo: 1, nome: 'Foro Central de São Paulo', municipio: 'São Paulo', codigo_ibge: 3550308, nivel: '1º grau' },
    { codigo: 2, nome: 'Foro Regional da Lapa', municipio: 'São Paulo', codigo_ibge: 3550308, nivel: '1º grau' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredForos = foros.filter(f =>
    f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.municipio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);

    // Simular sincronização
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200));
      setSyncProgress(i);
    }

    setIsSyncing(false);
  };

  return (
    <div className="space-y-4">
      {/* SYNC SECTION */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-base">🔄 Sincronizar com API TJSP</CardTitle>
          <p className="text-sm text-blue-900 dark:text-blue-100 mt-2">
            Sincronize a tabela de Código de Foro com a base de dados oficial do TJSP
          </p>
        </CardHeader>
        <CardContent>
          {isSyncing && (
            <div className="space-y-3">
              <Progress value={syncProgress} className="h-2" />
              <p className="text-xs text-blue-900 dark:text-blue-100">
                {syncProgress}% - Sincronizando dados...
              </p>
            </div>
          )}

          {!isSyncing && syncProgress === 0 && (
            <div className="flex gap-2">
              <Button onClick={handleSync} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Loader className="w-4 h-4" />
                Sincronizar Agora
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Agendado: Diariamente 02:00
              </Button>
            </div>
          )}

          {syncProgress === 100 && !isSyncing && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-700">
              <p className="text-sm text-green-900 dark:text-green-100">
                ✅ Sincronização concluída! Última atualização: agora
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEARCH & LIST */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Foros (CodigoForoTJSP)</CardTitle>
            <Badge className="bg-cyan-600">{foros.length} foros</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou município..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-4 font-semibold">Código</th>
                  <th className="text-left py-2 px-4 font-semibold">Nome</th>
                  <th className="text-left py-2 px-4 font-semibold">Município</th>
                  <th className="text-left py-2 px-4 font-semibold">Código IBGE</th>
                  <th className="text-left py-2 px-4 font-semibold">Nível</th>
                </tr>
              </thead>
              <tbody>
                {filteredForos.map((foro) => (
                  <tr key={foro.codigo} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 font-semibold text-cyan-600">{foro.codigo}</td>
                    <td className="py-3 px-4">{foro.nome}</td>
                    <td className="py-3 px-4">{foro.municipio}</td>
                    <td className="py-3 px-4 font-mono text-xs">{foro.codigo_ibge}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{foro.nivel}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
            {filteredForos.length} de {foros.length} foros
          </p>
        </CardContent>
      </Card>
    </div>
  );
}