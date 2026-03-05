import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function ContactDialog({ isOpen, onClose, onAdd = () => {}, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'contact',
    email: '',
    phone: '',
    document: '',
    address: '',
    city: '',
    state: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const contactTypes = ['parte', 'cliente', 'advogado', 'contact'];

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setSubmitted(true);

    if (!formData.name.trim()) {
      setError('✗ Nome é obrigatório');
      return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      setError('✗ Email inválido');
      return;
    }

    try {
      await onAdd(formData);
      setSuccess('✓ Contato criado com sucesso!');
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (err) {
      setError(`✗ ${err?.message || 'Erro ao criar contato'}`);
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'contact',
      email: '',
      phone: '',
      document: '',
      address: '',
      city: '',
      state: '',
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
      <DialogContent className="sm:max-w-2xl dark:bg-gray-800 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Novo Contato</DialogTitle>
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
            <Label htmlFor="name" className="dark:text-gray-300">
              Nome *
            </Label>
            <Input
              id="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              maxLength={100}
              className={`dark:bg-gray-700 dark:text-white ${
                submitted && !formData.name.trim() ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : ''
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
                {contactTypes.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`dark:bg-gray-700 dark:text-white ${
                  formData.email && !isValidEmail(formData.email) ? 'border-orange-500' : ''
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="dark:text-gray-300">
                Telefone
              </Label>
              <Input
                id="phone"
                placeholder="(11) 9999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document" className="dark:text-gray-300">
                CPF/CNPJ
              </Label>
              <Input
                id="document"
                placeholder="000.000.000-00"
                value={formData.document}
                onChange={(e) => setFormData({...formData, document: e.target.value})}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="dark:text-gray-300">
              Endereço
            </Label>
            <Input
              id="address"
              placeholder="Rua, número, complemento"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="dark:text-gray-300">
                Cidade
              </Label>
              <Input
                id="city"
                placeholder="São Paulo"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="dark:text-gray-300">
                Estado
              </Label>
              <Input
                id="state"
                placeholder="SP"
                maxLength={2}
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value.toUpperCase()})}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="dark:text-gray-300">
              Notas
            </Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais..."
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
            className="gap-2 bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando...
              </>
            ) : (
              '✓ Criar Contato'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}