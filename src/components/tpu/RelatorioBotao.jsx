import React, { useState } from 'react';
import { Download, FileText, Table2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { base44 } from '@/api/base44Client';

export default function RelatorioBotao() {
  const [isLoading, setIsLoading] = useState(false);
  const [periodo, setPeriodo] = useState('7d');

  const exportarRelatorio = async (formato) => {
    try {
      setIsLoading(true);
      
      const { data } = await base44.functions.invoke('exportarRelatorioSincronizacao', {
        formato,
        periodo
      });

      // Criar download
      const blob = new Blob([data], {
        type: formato === 'pdf' ? 'application/pdf' : 'text/csv'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${periodo}.${formato}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao gerar relatório: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Selector de período */}
      <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
        {['7d', '30d', '90d'].map(p => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              periodo === p
                ? 'bg-cyan-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {p === '7d' ? '7d' : p === '30d' ? '30d' : '90d'}
          </button>
        ))}
      </div>

      {/* Menu de download */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exportar
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => exportarRelatorio('pdf')} className="gap-2">
            <FileText className="w-4 h-4" />
            PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => exportarRelatorio('csv')} className="gap-2">
            <Table2 className="w-4 h-4" />
            CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}