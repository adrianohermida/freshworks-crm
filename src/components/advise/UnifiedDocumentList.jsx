import React, { useState, useMemo } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Share2, Download, Filter, ChevronLeft, ChevronRight, FileText, Loader2, AlertCircle, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ITEMS_PER_PAGE = 10;

export default function UnifiedDocumentList({
  documents = [],
  isLoading = false,
  type = 'publicacao', // 'publicacao' | 'intimacao'
  onStatusChange,
  onSync,
  syncLoading = false,
  title = 'Documentos'
}) {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('todas');
  const [pesquisa, setPesquisa] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const statusKey = type === 'publicacao' ? 'lido' : 'statusIntimacao';
      const matchStatus = 
        statusFilter === 'todas' ||
        (type === 'publicacao' && statusFilter === 'nao-lidas' && !doc.lido) ||
        (type === 'publicacao' && statusFilter === 'lidas' && doc.lido) ||
        (type === 'intimacao' && doc.statusIntimacao === statusFilter);

      const searchFields = [
        doc.numeroProcesso,
        doc.numero,
        doc.conteudo,
        doc.despacho,
        doc.vara,
        doc.varaDescricao,
        doc.municipio,
        doc.cidadeComarcaDescricao,
      ];

      const matchSearch = pesquisa === '' ||
        searchFields.some(field => field?.toLowerCase().includes(pesquisa.toLowerCase()));

      return matchStatus && matchSearch;
    });
  }, [documents, statusFilter, pesquisa, type]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(new Set(paginatedItems.map(p => p.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const toggleItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (doc) => {
    if (type === 'publicacao') {
      return !doc.lido ? (
        <Badge className="bg-blue-100 text-blue-800 text-xs">Não lida</Badge>
      ) : null;
    }
    
    const statusColors = {
      pendente: 'bg-yellow-100 text-yellow-800',
      recebida: 'bg-blue-100 text-blue-800',
      cumprida: 'bg-green-100 text-green-800',
      cancelada: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={`${statusColors[doc.statusIntimacao] || 'bg-gray-100'} text-xs`}>
        {doc.statusIntimacao}
      </Badge>
    );
  };

  const getDocumentNumber = (doc) => doc.numeroProcesso || doc.numero;
  const getLocation = (doc) => doc.vara || doc.varaDescricao || 'Tribunal';
  const getCity = (doc) => doc.municipio || doc.cidadeComarcaDescricao || '';
  const getDate = (doc) => doc.dataPublicacao || doc.dataIntimacao || doc.dataMovimento;

  const handleViewDetails = (doc) => {
    setSelectedDoc(doc);
    setShowDetailDialog(true);
  };

  const handleShare = async (doc) => {
    const text = `${getLocation(doc)} - ${getDocumentNumber(doc)}\n${formatDate(getDate(doc))}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Publicação', text });
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(text);
          alert('Copiado para a área de transferência!');
        }
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Copiado para a área de transferência!');
    }
  };

  const handleDownloadPDF = (doc) => {
    const content = `
PUBLICAÇÃO/INTIMAÇÃO
Processo: ${getDocumentNumber(doc)}
Local: ${getLocation(doc)} ${getCity(doc)}
Data: ${formatDate(getDate(doc))}

CONTEÚDO:
${doc.conteudo || doc.despacho || 'Sem conteúdo'}
    `.trim();

    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    element.download = `publicacao_${getDocumentNumber(doc).replace(/\//g, '_')}.txt`;
    element.click();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex gap-3 items-center flex-wrap">
          <Button
            onClick={onSync}
            disabled={syncLoading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {syncLoading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Sincronizando...
              </>
            ) : (
              '🔄 Sincronizar'
            )}
          </Button>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-9 text-xs">
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas situações</SelectItem>
              {type === 'publicacao' ? (
                <>
                  <SelectItem value="nao-lidas">Não Lidas</SelectItem>
                  <SelectItem value="lidas">Lidas</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="recebida">Recebida</SelectItem>
                  <SelectItem value="cumprida">Cumprida</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          <Input
            placeholder="Pesquisar..."
            value={pesquisa}
            onChange={(e) => {
              setPesquisa(e.target.value);
              setCurrentPage(1);
            }}
            className="w-48 h-9 text-xs"
          />

          <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800 flex gap-1 text-xs">
            <Filter className="w-3 h-3" />
            Filtros
          </Button>
        </div>

        {/* Pagination Info */}
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>
            {filteredDocuments.length === 0 
              ? 'Nenhum documento' 
              : `${(currentPage - 1) * ITEMS_PER_PAGE + 1} de ${filteredDocuments.length}`}
          </span>
          <div className="flex gap-2 items-center">
            <span className="font-medium text-xs">{currentPage} de {totalPages || 1}</span>
            <Button 
              size="sm" 
              variant="ghost" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="divide-y">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
            Carregando...
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertCircle className="w-5 h-5 mx-auto mb-2 opacity-50" />
            Nenhum documento encontrado
          </div>
        ) : (
          paginatedItems.map(doc => (
            <div key={doc.id} className="flex gap-3 p-3 hover:bg-gray-50 transition">
              <Checkbox
                checked={selectedItems.has(doc.id)}
                onCheckedChange={() => toggleItem(doc.id)}
                className="mt-1"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 font-medium">
                      {formatDate(getDate(doc))}
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-0.5">
                      {getLocation(doc)} {getCity(doc) && `- ${getCity(doc)}`}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Processo: <span className="font-mono font-bold">{getDocumentNumber(doc)}</span>
                    </div>
                  </div>

                  {/* Action Icons */}
                  <div className="flex gap-1 flex-shrink-0">
                    {type === 'publicacao' && (
                      <button
                        onClick={() => onStatusChange?.({ ...doc, lido: !doc.lido })}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                        title={doc.lido ? 'Marcar como não lida' : 'Marcar como lida'}
                      >
                        <Eye className={`w-4 h-4 ${doc.lido ? 'opacity-40' : ''}`} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewDetails(doc)}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                      title="Visualizar detalhes"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleShare(doc)}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                      title="Compartilhar"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDownloadPDF(doc)}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                      title="Baixar"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {getStatusBadge(doc)}
                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                    {type === 'publicacao' ? 'Publicação' : 'Intimação'}
                  </Badge>
                </div>

                {/* Content Preview */}
                {(doc.conteudo || doc.despacho) && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {doc.conteudo || doc.despacho}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Detalhes da Publicação</DialogTitle>
            <DialogDescription className="sr-only">Detalhes completos da publicação ou intimação selecionada</DialogDescription>
            <button 
              onClick={() => setShowDetailDialog(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Processo</p>
                  <p className="font-mono font-bold">{getDocumentNumber(selectedDoc)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Data</p>
                  <p>{formatDate(getDate(selectedDoc))}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Local</p>
                  <p>{getLocation(selectedDoc)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Município</p>
                  <p>{getCity(selectedDoc) || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Conteúdo</p>
                <div className="bg-gray-50 rounded p-4 text-xs line-clamp-6 whitespace-pre-wrap">
                  {selectedDoc.conteudo || selectedDoc.despacho || 'Sem conteúdo'}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => handleShare(selectedDoc)}
                  variant="outline"
                  size="sm"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
                <Button 
                  onClick={() => handleDownloadPDF(selectedDoc)}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
                {type === 'publicacao' && (
                  <Button 
                    onClick={() => {
                      onStatusChange?.({ ...selectedDoc, lido: !selectedDoc.lido });
                      setShowDetailDialog(false);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {selectedDoc.lido ? 'Marcar como não lida' : 'Marcar como lida'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}