import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, ExternalLink } from 'lucide-react';

export default function AdminPublications() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: publications = [], isLoading } = useQuery({
    queryKey: ['admin_publications'],
    queryFn: () => base44.entities.Publication.list('-publication_date', 100)
  });

  const filteredPublications = publications.filter(p => {
    const matchSearch = p.title?.includes(searchTerm) || p.process_cnj?.includes(searchTerm);
    return matchSearch;
  });

  const stats = {
    total: publications.length,
    dje: publications.filter(p => p.source === 'dje').length,
    tribunal: publications.filter(p => p.source === 'tribunal').length,
    synced: publications.filter(p => p.synced_at).length
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center"><p className="text-gray-600">Carregando publicações...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin - Publicações</h1>
          <p className="text-gray-600 mt-1">Gestão de publicações DJe e Tribunais</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-cyan-600">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">DJe</p>
              <p className="text-3xl font-bold text-blue-600">{stats.dje}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Tribunal</p>
              <p className="text-3xl font-bold text-green-600">{stats.tribunal}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Sincronizadas</p>
              <p className="text-3xl font-bold text-purple-600">{stats.synced}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Input
          placeholder="Buscar por título ou CNJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />

        {/* Publications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Publicações ({filteredPublications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPublications.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma publicação encontrada</p>
            ) : (
              <div className="space-y-2">
                {filteredPublications.map(pub => (
                  <div key={pub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{pub.title}</p>
                      <p className="text-xs text-gray-600">CNJ: {pub.process_cnj}</p>
                      <p className="text-xs text-gray-600">
                        Data: {new Date(pub.publication_date).toLocaleDateString('pt-BR')} | 
                        Fonte: {pub.source?.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        pub.source === 'dje' ? 'bg-blue-100 text-blue-800' :
                        pub.source === 'tribunal' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {pub.source?.toUpperCase()}
                      </Badge>
                      {pub.url && (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-200 rounded">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Synced */}
        <Card>
          <CardHeader>
            <CardTitle>Sincronizadas Recentemente</CardTitle>
          </CardHeader>
          <CardContent>
            {publications.filter(p => p.synced_at).length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma sincronização recente</p>
            ) : (
              <div className="space-y-2">
                {publications
                  .filter(p => p.synced_at)
                  .sort((a, b) => new Date(b.synced_at) - new Date(a.synced_at))
                  .slice(0, 10)
                  .map(pub => (
                    <div key={pub.id} className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{pub.title}</p>
                        <p className="text-xs text-gray-600">Sincronizado em: {new Date(pub.synced_at).toLocaleString('pt-BR')}</p>
                      </div>
                      <Badge className="bg-green-600">SINCRONIZADO</Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}