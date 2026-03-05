import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Calendar, Eye } from 'lucide-react';
import Button from '@/components/aetherlab/Button';
import Input from '@/components/aetherlab/Input';
import Card from '@/components/aetherlab/Card';

export default function Publications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPub, setSelectedPub] = useState(null);
  const queryClient = useQueryClient();

  const { data: publications = [], isLoading } = useQuery({
    queryKey: ['publications'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Publication.filter({ created_by: user.email }, '-publication_date', 100);
    },
    staleTime: 5 * 60 * 1000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Publication.update(id, { read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  });

  const filteredPublications = publications.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
            Publicações
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)' }}>
            Diário de Justiça e comunicados processuais
          </p>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 'var(--spacing-md)', top: 'var(--spacing-md)', width: '16px', height: '16px', color: 'var(--color-body)', opacity: 0.5 }} />
          <Input
            placeholder="Buscar publicações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 'var(--spacing-2xl)' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
          {/* Lista */}
          <div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)', margin: 0 }}>
              Publicações ({filteredPublications.length})
            </h2>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ height: '100px', backgroundColor: 'var(--color-gray)', borderRadius: 'var(--border-radius-md)', animation: 'pulse 2s infinite' }} />
                ))}
              </div>
            ) : filteredPublications.length === 0 ? (
              <Card>
                <p style={{ color: 'var(--color-body)', textAlign: 'center', margin: 0 }}>Nenhuma publicação encontrada</p>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', maxHeight: '70vh', overflowY: 'auto' }}>
                {filteredPublications.map((pub) => (
                  <Card
                    key={pub.id}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: pub.read ? 'var(--color-white)' : 'var(--color-primary-light)',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => {
                      setSelectedPub(pub);
                      if (!pub.read) {
                        markAsReadMutation.mutate(pub.id);
                      }
                    }}
                  >
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      {pub.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', opacity: 0.7 }}>
                      <Calendar style={{ width: '14px', height: '14px' }} />
                      {new Date(pub.publication_date).toLocaleDateString('pt-BR')}
                    </div>
                    {!pub.read && (
                      <div style={{ marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)' }}>
                        ● Não lida
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Detalhe */}
          <div>
            {selectedPub ? (
              <Card>
                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
                  {selectedPub.title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', opacity: 0.7, marginBottom: 'var(--spacing-lg)' }}>
                  <Calendar style={{ width: '16px', height: '16px' }} />
                  {new Date(selectedPub.publication_date).toLocaleDateString('pt-BR')}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', lineHeight: '1.6', color: 'var(--color-body)', marginBottom: 'var(--spacing-lg)' }}>
                  {selectedPub.content}
                </div>
                {selectedPub.url && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.open(selectedPub.url, '_blank')}
                  >
                    <Eye style={{ width: '14px', height: '14px', marginRight: 'var(--spacing-sm)' }} />
                    Ver Original
                  </Button>
                )}
              </Card>
            ) : (
              <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-body)', margin: 0 }}>Selecione uma publicação para visualizar</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}