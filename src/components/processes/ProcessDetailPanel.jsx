import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, FileText, Users, Clock, MapPin } from 'lucide-react';
import PartsCard from '@/components/contacts/PartsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProcessDetailPanel({ process, onClose }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    paused: 'bg-yellow-100 text-yellow-800',
    synchronized_error: 'bg-red-100 text-red-800'
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalhes do Processo
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{process.title}</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className={statusColors[process.status]}>{process.status}</Badge>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {process.cnj_number}
              </code>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="partes">Partes</TabsTrigger>
              <TabsTrigger value="movimentos">Movimentos</TabsTrigger>
              <TabsTrigger value="prazos">Prazos</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-medium">{process.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tribunal</p>
                  <p className="font-medium">{process.parsed_tribunal || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Última Sincronização</p>
                  <p className="font-medium">{formatDate(process.synced_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Movimentos</p>
                  <p className="font-medium">{process.movement_count || 0}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Notas</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{process.notes || 'Sem notas'}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="partes">
              <PartsCard processId={process.id} />
            </TabsContent>

            <TabsContent value="movimentos">
              <div className="text-center py-8 text-gray-500">
                {process.movement_count > 0 
                  ? `${process.movement_count} movimentos disponíveis`
                  : 'Nenhum movimento registrado'
                }
              </div>
            </TabsContent>

            <TabsContent value="prazos">
              <div className="text-center py-8 text-gray-500">
                Prazos associados a este processo
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
            <Button className="flex-1">Sincronizar</Button>
            <Button variant="outline" onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}