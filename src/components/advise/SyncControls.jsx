import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RefreshCw, Calendar } from 'lucide-react';

export default function SyncControls({ 
  loading, 
  period, 
  onPeriodChange, 
  onSync,
  label = "Sincronizar",
  periods = [
    { value: '1', label: 'Últimas 24 horas' },
    { value: '7', label: 'Últimos 7 dias' },
    { value: '30', label: 'Últimos 30 dias' },
    { value: '90', label: 'Últimos 90 dias' }
  ]
}) {
  return (
    <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {periods && (
          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-300">
              <Calendar className="w-4 h-4 inline mr-2" />
              Período
            </label>
            <Select value={period} onValueChange={onPeriodChange}>
              <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                {periods.map(p => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Button
          onClick={onSync}
          disabled={loading}
          size="lg"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              {label}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}