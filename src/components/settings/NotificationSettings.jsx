import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationSettings() {
  const queryClient = useQueryClient();
  const [newEmail, setNewEmail] = useState('');

  const { data: prefs = [] } = useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: () => base44.entities.NotificationPreference.list(),
    initialData: []
  });

  const preference = prefs[0];

  const updateMutation = useMutation({
    mutationFn: (data) => {
      if (preference?.id) {
        return base44.entities.NotificationPreference.update(preference.id, data);
      } else {
        return base44.entities.NotificationPreference.create(data);
      }
    },
    onSuccess: () => {
      toast.success('Preferências atualizadas');
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    }
  });

  const handleToggle = (field) => {
    updateMutation.mutate({
      ...preference,
      [field]: !preference?.[field]
    });
  };

  const handleAddEmail = () => {
    if (!newEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Email inválido');
      return;
    }

    const emails = preference?.notification_recipients || [];
    if (emails.includes(newEmail)) {
      toast.error('Email já adicionado');
      return;
    }

    updateMutation.mutate({
      ...preference,
      notification_recipients: [...emails, newEmail]
    });
    setNewEmail('');
  };

  const handleRemoveEmail = (email) => {
    const emails = (preference?.notification_recipients || []).filter(e => e !== email);
    updateMutation.mutate({
      ...preference,
      notification_recipients: emails
    });
  };

  const handleDigestChange = (value) => {
    updateMutation.mutate({
      ...preference,
      digest_type: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notificações por Email</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Triggers */}
        <div className="space-y-4">
          <h3 className="font-semibold">Triggers de Notificação</h3>

          {/* New Ticket */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Label className="cursor-pointer">
              <span className="font-medium">Novo Ticket</span>
              <p className="text-xs text-gray-500">Notificar quando um novo ticket é criado</p>
            </Label>
            <Switch
              checked={preference?.email_on_new_ticket ?? true}
              onCheckedChange={() => handleToggle('email_on_new_ticket')}
            />
          </div>

          {/* Assignment */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Label className="cursor-pointer">
              <span className="font-medium">Atribuição</span>
              <p className="text-xs text-gray-500">Notificar quando um ticket é atribuído</p>
            </Label>
            <Switch
              checked={preference?.email_on_assignment ?? true}
              onCheckedChange={() => handleToggle('email_on_assignment')}
            />
          </div>

          {/* Response */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Label className="cursor-pointer">
              <span className="font-medium">Respostas</span>
              <p className="text-xs text-gray-500">Notificar quando há nova resposta</p>
            </Label>
            <Switch
              checked={preference?.email_on_response ?? true}
              onCheckedChange={() => handleToggle('email_on_response')}
            />
          </div>

          {/* Status Change */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Label className="cursor-pointer">
              <span className="font-medium">Mudança de Status</span>
              <p className="text-xs text-gray-500">Notificar quando status muda</p>
            </Label>
            <Switch
              checked={preference?.email_on_status_change ?? false}
              onCheckedChange={() => handleToggle('email_on_status_change')}
            />
          </div>
        </div>

        {/* Digest Type */}
        <div className="space-y-2">
          <Label className="font-semibold">Tipo de Resumo</Label>
          <Select value={preference?.digest_type || 'immediate'} onValueChange={handleDigestChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Imediato</SelectItem>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Recipients */}
        <div className="space-y-3">
          <h3 className="font-semibold">Emails Adicionais</h3>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="email@exemplo.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
            />
            <Button onClick={handleAddEmail} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {preference?.notification_recipients?.length > 0 && (
            <div className="space-y-2">
              {preference.notification_recipients.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded"
                >
                  <span className="text-sm">{email}</span>
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}