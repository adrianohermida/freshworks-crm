import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

export default function TPUDetailedViewer({ item, tabela, onClose }) {
  const [expandedSections, setExpandedSections] = useState({
    basico: true,
    auditoria: false,
    aplicabilidade: false,
    complementos: false
  });
  const [copiedField, setCopiedField] = useState(null);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Mapear campos conforme a tabela
  const getBasicFields = () => {
    switch(tabela) {
      case 'assuntos':
        return [
          { label: 'Código', value: item.cod_item },
          { label: 'Nome', value: item.nome },
          { label: 'Glossário', value: item.dscGlossario || item.descricao_glossario },
          { label: 'Ramo de Direito', value: item.ramo_direito },
          { label: 'Sigiloso', value: item.sigiloso },
          { label: 'Assunto Secundário', value: item.assunto_secundario },
          { label: 'Crime Antecedente', value: item.crime_antecedente }
        ];
      case 'classes':
        return [
          { label: 'Código', value: item.cod_item },
          { label: 'Nome', value: item.nome },
          { label: 'Sigla', value: item.sigla },
          { label: 'Natureza', value: item.natureza },
          { label: 'Numeração Própria', value: item.numeracao_propria },
          { label: 'Glossário', value: item.dscGlossario || item.descricao_glossario }
        ];
      case 'movimentos':
        return [
          { label: 'Código', value: item.cod_item },
          { label: 'Nome', value: item.nome },
          { label: 'Categoria', value: item.categoria },
          { label: 'Subcategoria', value: item.subcategoria },
          { label: 'Visibilidade Externa', value: item.visibilidade_externa },
          { label: 'Eletrônico', value: item.flg_eletronico },
          { label: 'Papel', value: item.flg_papel }
        ];
      case 'documentos':
        return [
          { label: 'Código', value: item.cod_item },
          { label: 'Nome', value: item.nome },
          { label: 'Glossário', value: item.dscGlossario || item.descricao_glossario },
          { label: 'Código Pai', value: item.cod_item_pai }
        ];
      default:
        return [];
    }
  };

  // Campos de aplicabilidade (justiças)
  const getAplicabilidadeFields = () => {
    const aplicabilidadeFields = {};
    const justicasMap = {
      'justica_estadual_1grau': 'Justiça Estadual 1º Grau',
      'justica_estadual_2grau': 'Justiça Estadual 2º Grau',
      'justica_federal_1grau': 'Justiça Federal 1º Grau',
      'justica_federal_2grau': 'Justiça Federal 2º Grau',
      'justica_trabalho_1grau': 'Justiça do Trabalho 1º Grau',
      'justica_trabalho_2grau': 'Justiça do Trabalho 2º Grau',
      'stf': 'Supremo Tribunal Federal',
      'stj': 'Superior Tribunal de Justiça'
    };

    Object.entries(justicasMap).forEach(([key, label]) => {
      if (item[key] !== undefined) {
        aplicabilidadeFields[label] = item[key] === 'S' || item[key] === true;
      }
    });

    return aplicabilidadeFields;
  };

  const basicFields = getBasicFields();
  const aplicabilidade = getAplicabilidadeFields();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{item.nome || `${tabela.charAt(0).toUpperCase() + tabela.slice(1)} #${item.cod_item}`}</h2>
            <Badge className="mt-2">{tabela}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4">
          {/* SEÇÃO: INFORMAÇÕES BÁSICAS */}
          <div className="border rounded-lg">
            <button
              onClick={() => toggleSection('basico')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <h3 className="font-semibold flex items-center gap-2">
                📋 Informações Básicas
              </h3>
              {expandedSections.basico ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSections.basico && (
              <div className="border-t p-4 space-y-3">
                {basicFields.map(({ label, value }, idx) => (
                  value && (
                    <div key={idx} className="flex justify-between items-start">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-right max-w-xs text-gray-900 dark:text-gray-100">{value}</span>
                        <button
                          onClick={() => copyToClipboard(String(value), `${label}-${idx}`)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="Copiar"
                        >
                          {copiedField === `${label}-${idx}` ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* SEÇÃO: AUDITORIA */}
          {(item.data_inclusao || item.usuario_inclusao) && (
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('auditoria')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <h3 className="font-semibold flex items-center gap-2">
                  🔍 Auditoria
                </h3>
                {expandedSections.auditoria ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.auditoria && (
                <div className="border-t p-4 space-y-3">
                  {item.data_inclusao && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Data Inclusão</span>
                      <span className="text-sm">{new Date(item.data_inclusao).toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                  {item.usuario_inclusao && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Usuário Inclusão</span>
                      <span className="text-sm">{item.usuario_inclusao}</span>
                    </div>
                  )}
                  {item.data_alteracao && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Data Alteração</span>
                      <span className="text-sm">{new Date(item.data_alteracao).toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                  {item.usuario_alteracao && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Usuário Alteração</span>
                      <span className="text-sm">{item.usuario_alteracao}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SEÇÃO: MAPA DE APLICABILIDADE */}
          {Object.keys(aplicabilidade).length > 0 && (
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('aplicabilidade')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <h3 className="font-semibold flex items-center gap-2">
                  🗺️ Mapa de Aplicabilidade
                </h3>
                {expandedSections.aplicabilidade ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.aplicabilidade && (
                <div className="border-t p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(aplicabilidade).map(([label, ativo], idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${ativo ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEÇÃO: COMPLEMENTOS (se houver) */}
          {item.complementos && item.complementos.length > 0 && (
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('complementos')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <h3 className="font-semibold flex items-center gap-2">
                  ⚙️ Complementos ({item.complementos.length})
                </h3>
                {expandedSections.complementos ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.complementos && (
                <div className="border-t p-4 space-y-2">
                  {item.complementos.map((comp, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                      {comp.dscComplemento}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}