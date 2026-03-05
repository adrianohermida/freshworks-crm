import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, Zap, Users, Clock, DollarSign, Link2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CriarProcessoDePublicacao({ publicacao, onProcessoCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [resultado, setResultado] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('processarPublicacaoParaProcesso', {
        publicacaoId: publicacao.id,
        numeroProcesso: publicacao.numeroProcesso,
        tribunal: 'Tribunal não identificado',
        vara: 'Vara não identificada',
        municipio: publicacao.municipio || 'Município não identificado'
      });
      return response.data;
    },
    onSuccess: (data) => {
      setResultado(data);
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      queryClient.invalidateQueries({ queryKey: ['publicacoes'] });
      if (onProcessoCreated) {
        onProcessoCreated(data.processo);
      }
    }
  });

  const handleCriarProcesso = async () => {
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1 text-xs">
          <Zap className="w-3 h-3" />
          Criar Processo
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Processo de Publicação</DialogTitle>
          <DialogDescription>
            Números do processo: {publicacao.numeroProcesso}
          </DialogDescription>
        </DialogHeader>

        {!resultado ? (
          <div className="space-y-4">
            {/* Info Publicação */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Publicação:</strong> {publicacao.dataPublicacao ? new Date(publicacao.dataPublicacao).toLocaleDateString('pt-BR') : 'Sem data'}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Diário:</strong> {publicacao.diario || 'Não informado'}
                </p>
                {publicacao.palavrasChave?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Tags:</p>
                    <div className="flex gap-1 flex-wrap">
                      {publicacao.palavrasChave.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* O que será criado */}
            <Alert className="border-green-200 bg-green-50">
              <Zap className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                <strong>O sistema irá:</strong>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Criar novo processo (ou atualizar existente)</li>
                  <li>Extrair POLO ATIVO e POLO PASSIVO automaticamente</li>
                  <li>Cadastrar ADVOGADOS e associar ao processo</li>
                  <li>Identificar datas de AUDIÊNCIAS</li>
                  <li>Extrair PRAZOS PROCESSUAIS abertos</li>
                  <li>Analisar DEPENDÊNCIAS e criar APENSOS automaticamente</li>
                  <li>Gerar ALERTAS de prazos e eventos</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Botões */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCriarProcesso}
                disabled={mutation.isPending}
                className="gap-1 flex-1"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Criar Processo Automático
                  </>
                )}
              </Button>
            </div>

            {mutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Erro ao processar publicação: {mutation.error?.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          // Resultado da Criação
          <Tabs defaultValue="processo" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="processo" className="gap-1 text-xs">
                <CheckCircle2 className="w-3 h-3" />
                Processo
              </TabsTrigger>
              <TabsTrigger value="partes" className="gap-1 text-xs">
                <Users className="w-3 h-3" />
                Partes
              </TabsTrigger>
              <TabsTrigger value="audiencias" className="gap-1 text-xs">
                <Clock className="w-3 h-3" />
                Audiências
              </TabsTrigger>
              <TabsTrigger value="prazos" className="gap-1 text-xs">
                <AlertCircle className="w-3 h-3" />
                Prazos
              </TabsTrigger>
              <TabsTrigger value="apensos" className="gap-1 text-xs">
                <Link2 className="w-3 h-3" />
                Apensos
              </TabsTrigger>
            </TabsList>

            {/* Processo Criado */}
            <TabsContent value="processo">
              <Alert className="border-green-200 bg-green-50 mb-4">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Processo criado com sucesso!
                </AlertDescription>
              </Alert>

              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Número</p>
                      <p className="font-semibold text-sm">{resultado.processo.numeroProcesso}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Status</p>
                      <Badge className="text-xs bg-green-100 text-green-800">
                        {resultado.processo.statusProcesso}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Tribunal</p>
                      <p className="font-semibold text-sm">{resultado.processo.tribunal}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">ID Processo</p>
                      <p className="font-mono text-xs text-gray-500">{resultado.processo.id.substring(0, 12)}...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Partes */}
            <TabsContent value="partes">
              {resultado.partes?.length > 0 ? (
                <div className="space-y-3">
                  {resultado.partes.map((parte, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{parte.nome}</p>
                            <p className="text-xs text-gray-600">{parte.qualidade}</p>
                            {parte.cpfCnpj && (
                              <p className="text-xs text-gray-500 font-mono">{parte.cpfCnpj}</p>
                            )}
                          </div>
                          <Badge className={parte.tipo === 'ativo' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}>
                            {parte.tipo === 'ativo' ? 'Polo Ativo' : 'Polo Passivo'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhuma parte identificada</p>
              )}

              {resultado.advogados?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-3">Advogados Cadastrados</p>
                  {resultado.advogados.map((adv, idx) => (
                    <Card key={idx} className="mb-2">
                      <CardContent className="pt-3 pb-3">
                        <p className="font-semibold text-sm">{adv.nome}</p>
                        <p className="text-xs text-gray-600">OAB: {adv.oab}</p>
                        {adv.email && (
                          <p className="text-xs text-gray-600">{adv.email}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Audiências */}
            <TabsContent value="audiencias">
              {resultado.audiencias?.length > 0 ? (
                <div className="space-y-3">
                  {resultado.audiencias.map((aud, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">
                              {new Date(aud.dataAudiencia).toLocaleDateString('pt-BR', {
                                weekday: 'short',
                                day: '2-digit',
                                month: '2-digit'
                              })}
                            </p>
                            <p className="text-xs text-gray-600">{aud.sala || 'Sala não informada'}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {aud.tipo}
                          </Badge>
                        </div>
                        {aud.juiz && (
                          <p className="text-xs text-gray-600">Juiz: {aud.juiz}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhuma audiência identificada</p>
              )}
            </TabsContent>

            {/* Prazos */}
            <TabsContent value="prazos">
              {resultado.prazos?.length > 0 ? (
                <div className="space-y-3">
                  {resultado.prazos.map((prazo, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{prazo.descricao}</p>
                            <p className="text-xs text-gray-600">
                              Vence: {new Date(prazo.dataVencimento).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {prazo.diasUteis} dias
                          </Badge>
                        </div>
                        {prazo.acao_requerida && (
                          <p className="text-xs text-gray-600 bg-yellow-50 p-2 rounded mt-2">
                            <strong>Ação:</strong> {prazo.acao_requerida}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum prazo identificado</p>
              )}
            </TabsContent>

            {/* Apensos */}
            <TabsContent value="apensos">
              {resultado.apensos?.length > 0 ? (
                <div className="space-y-3">
                  {resultado.apensos.map((apenso, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{apenso.numeroProcessoApensado}</p>
                            <p className="text-xs text-gray-600">{apenso.motivo}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {apenso.tipoApenso}
                          </Badge>
                        </div>
                        {apenso.descricao && (
                          <p className="text-xs text-gray-600">{apenso.descricao}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum apenso identificado</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}