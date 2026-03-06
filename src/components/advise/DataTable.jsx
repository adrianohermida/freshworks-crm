import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';

export default function DataTable({ 
  title, 
  data = [], 
  loading = false, 
  emptyMessage = "Nenhum item encontrado",
  renderRow = (item) => <div>{JSON.stringify(item)}</div>,
  columns = []
}) {
  return (
    <Card className="dark:bg-slate-900 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="dark:text-white">
          {title} ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : data.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 border dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                {renderRow(item)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}