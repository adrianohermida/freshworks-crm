import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2, Calendar } from 'lucide-react';

export default function AgendaDialog({ isOpen, onClose, processId, onAdd = () => {}, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'outro',
    process_id: processId || '',
    start_date: '',
    end_date: '',
    location: '',
    description: '',
    judge: '',
    status: 'agendado',
    reminder_before: 24
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const agendaTypes = ['audiencia', 'reuniao', 'despacho', 'sentenca', 'outro'];
  const statusOptions = ['agendado', 'concluido', 'cancelado', 'adiado'];

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setSubmitted(true);

    if (!formData.title.trim()) {
      setError('✗ Título é obrigatório');
      return;
    }

    if (!formData.start_date) {
      setError('✗ Data/hora de início é obrigatória');
      return;
    }

    const startDate = new Date(formData.start_date);
    if (startDate <= new Date()) {
      setError('✗ Data/hora deve ser no futuro');
      return;
    }

    try {
      await onAdd(formData);
      setSuccess('✓ Evento criado com sucesso!');
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (err) {
      setError(`✗ ${err?.message || 'Erro ao criar evento'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'outro',
      process_id: processId || '',
      start_date: '',
      end_date: '',
      location: '',
      description: '',
      judge: '',
      status: 'agendado',
      reminder_before: 24
    });
    setError('');
    setSuccess('');
    setSubmitted(false);
  };

  const handleOpenChange = (open) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl dark:bg-gray-800 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Novo Evento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="dark:text-gray-300">
              Título *
            </Label>
            <Input
              id="title"
              placeholder="Ex: Audiência inicial, Despacho de admissão..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              maxLength={100}
              className={`dark:bg-gray-700 dark:text-white ${
                submitted && !formData.title.trim() ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : ''
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="dark:text-gray-300">
                Tipo
              </Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                {agendaTypes.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="dark:text-gray-300">
                Status
              </Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="dark:text-gray-300">
                Data/Hora de Início *
              </Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className={`dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  submitted && !formData.start_date ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : ''
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="dark:text-gray-300">
                Data/Hora de Término
              </Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="dark:text-gray-300">
                Local
              </Label>
              <Input
                id="location"
                placeholder="Ex: Sala 5, Forum Central..."
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                maxLength={100}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="judge" className="dark:text-gray-300">
                Juiz
              </Label>
              <Input
                id="judge"
                placeholder="Nome do juiz..."
                value={formData.judge}
                onChange={(e) => setFormData({...formData, judge: e.target.value})}
                maxLength={100}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-gray-300">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Detalhes do evento..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={2}
              maxLength={300}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder" className="dark:text-gray-300">
              Lembrete (horas antes)
            </Label>
            <Input
              id="reminder"
              type="number"
              min="1"
              max="168"
              value={formData.reminder_before}
              onChange={(e) => setFormData({...formData, reminder_before: parseInt(e.target.value)})}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
        </div>

        <DialogFooter className="pt-4 border-t dark:border-gray-700">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="dark:border-gray-600"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2 bg-cyan-600 hover:bg-cyan-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando...
              </>
            ) : (
              '✓ Criar Evento'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}