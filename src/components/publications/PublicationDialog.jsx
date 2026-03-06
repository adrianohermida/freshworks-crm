import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function PublicationDialog({ isOpen, onClose, processId, onAdd = () => {}, isLoading = false }) {
  const [formData, setFormData] = useState({
    process_id: processId || '',
    title: '',
    publication_date: new Date().toISOString().split('T')[0],
    media: 'DJe',
    url: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mediaOptions = ['DJe', 'DJU', 'Oficial', 'Estadual'];

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setSubmitted(true);

    if (!formData.title.trim()) {
      setError('✗ Título da publicação é obrigatório');
      return;
    }

    if (!formData.publication_date) {
      setError('✗ Data da publicação é obrigatória');
      return;
    }

    try {
      await onAdd(formData);
      setSuccess('✓ Publicação criada com sucesso!');
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (err) {
      setError(`✗ ${err?.message || 'Erro ao criar publicação'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      process_id: processId || '',
      title: '',
      publication_date: new Date().toISOString().split('T')[0],
      media: 'DJe',
      url: '',
      notes: ''
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
      <DialogContent className="sm:max-w-2xl dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Nova Publicação</DialogTitle>
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
              placeholder="Ex: Sentença de Mérito"
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
              <Label htmlFor="publication_date" className="dark:text-gray-300">
                Data da Publicação *
              </Label>
              <Input
                id="publication_date"
                type="date"
                value={formData.publication_date}
                onChange={(e) => setFormData({...formData, publication_date: e.target.value})}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="media" className="dark:text-gray-300">
                Mídia
              </Label>
              <select
                id="media"
                value={formData.media}
                onChange={(e) => setFormData({...formData, media: e.target.value})}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                {mediaOptions.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="dark:text-gray-300">
              URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="dark:text-gray-300">
              Notas
            </Label>
            <Textarea
              id="notes"
              placeholder="Observações adicionais..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={2}
              maxLength={200}
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
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando...
              </>
            ) : (
              '✓ Criar Publicação'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}