import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight } from 'lucide-react';

export default function PartesProcessoView({ processo }) {
  if (!processo || !processo.partesProcesso || processo.partesProcesso.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-gray-500">
          Nenhuma parte registrada
        </CardContent>
      </Card>
    );
  }

  const poloAtivo = processo.partesProcesso.filter(p => p.qualidade === 'ativa');
  const poloPassivo = processo.partesProcesso.filter(p => p.qualidade === 'passiva');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="w-4 h-4" />
          Partes do Processo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Polo Ativo */}
        {poloAtivo.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Polo Ativo (Autores)</p>
            <div className="space-y-1">
              {poloAtivo.map((parte, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-blue-50 border-l-2 border-blue-500 rounded text-sm"
                >
                  <p className="font-medium text-blue-900">{parte.nome}</p>
                  {parte.tipo && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">
                      {parte.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seta */}
        {poloAtivo.length > 0 && poloPassivo.length > 0 && (
          <div className="flex justify-center py-2">
            <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
          </div>
        )}

        {/* Polo Passivo */}
        {poloPassivo.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Polo Passivo (Réus)</p>
            <div className="space-y-1">
              {poloPassivo.map((parte, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-red-50 border-l-2 border-red-500 rounded text-sm"
                >
                  <p className="font-medium text-red-900">{parte.nome}</p>
                  {parte.tipo && (
                    <Badge className="bg-red-100 text-red-800 text-xs mt-1">
                      {parte.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}