import React, { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, startOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

export default function AdvancedDateFilter({ onDateChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());

  const presets = [
    { label: 'Últimos 7 dias', value: 7 },
    { label: 'Últimos 30 dias', value: 30 },
    { label: 'Últimos 90 dias', value: 90 },
    { label: 'Este mês', value: 'month' },
    { label: 'Este ano', value: 'year' },
  ];

  const applyPreset = (preset) => {
    let newStart, newEnd = new Date();

    if (typeof preset === 'number') {
      newStart = subDays(newEnd, preset);
    } else if (preset === 'month') {
      newStart = startOfMonth(newEnd);
    } else if (preset === 'year') {
      newStart = startOfYear(newEnd);
    }

    setStartDate(newStart);
    setEndDate(newEnd);
    onDateChange({ startDate: newStart, endDate: newEnd });
  };

  const handleApplyCustom = () => {
    onDateChange({ startDate, endDate });
    setIsOpen(false);
  };

  const handleReset = () => {
    const newStart = subDays(new Date(), 30);
    const newEnd = new Date();
    setStartDate(newStart);
    setEndDate(newEnd);
    onDateChange({ startDate: newStart, endDate: newEnd });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => applyPreset(preset.value)}
            className="text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Custom Date Range */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 w-full dark:bg-gray-800 dark:border-gray-700"
          >
            <Calendar className="w-4 h-4" />
            {format(startDate, 'dd MMM', { locale: ptBR })} -{' '}
            {format(endDate, 'dd MMM yyyy', { locale: ptBR })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-200">Data Inicial</label>
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => date > endDate}
                className="rounded-md border dark:bg-gray-900 dark:border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-200">Data Final</label>
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => date < startDate}
                className="rounded-md border dark:bg-gray-900 dark:border-gray-700"
              />
            </div>
            <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
              <Button
                onClick={handleApplyCustom}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              >
                Aplicar
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 dark:bg-gray-800 dark:border-gray-700"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Reset Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        className="gap-2 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        <X className="w-4 h-4" />
        Resetar Datas
      </Button>
    </div>
  );
}