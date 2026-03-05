import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function NotificationPreferences({
  preferences,
  onSave,
  isLoading = false
}) {
  const [formData, setFormData] = useState(preferences || {});

  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* EMAIL */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">📧 Notificações por Email</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email_enabled">Habilitar emails</Label>
            <Switch
              id="email_enabled"
              checked={formData.email_enabled || false}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, email_enabled: checked })
              }
            />
          </div>

          {formData.email_enabled && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="daily_digest">Resumo diário</Label>
                <Switch
                  id="daily_digest"
                  checked={formData.daily_digest_enabled || false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, daily_digest_enabled: checked })
                  }
                />
              </div>

              {formData.daily_digest_enabled && (
                <div className="space-y-2 ml-4">
                  <Label htmlFor="digest_time">Horário do resumo</Label>
                  <Input
                    id="digest_time"
                    type="time"
                    value={formData.daily_digest_time || '09:00'}
                    onChange={(e) =>
                      setFormData({ ...formData, daily_digest_time: e.target.value })
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* PUSH */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">🔔 Notificações Push</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="push_enabled">Habilitar notificações push</Label>
          <Switch
            id="push_enabled"
            checked={formData.push_enabled || false}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, push_enabled: checked })
            }
          />
        </div>
      </Card>

      {/* WHATSAPP */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">💬 WhatsApp</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="whatsapp_enabled">Habilitar WhatsApp</Label>
            <Switch
              id="whatsapp_enabled"
              checked={formData.whatsapp_enabled || false}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, whatsapp_enabled: checked })
              }
            />
          </div>

          {formData.whatsapp_enabled && (
            <div className="space-y-2 ml-4">
              <Label htmlFor="whatsapp_number">Número WhatsApp</Label>
              <Input
                id="whatsapp_number"
                type="tel"
                placeholder="+55 92 99999-9999"
                value={formData.whatsapp_number || ''}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp_number: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">Formato: +55XXXXXXXXX</p>
            </div>
          )}
        </div>
      </Card>

      {/* ALERT TYPES */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">⚙️ Tipos de Alerta</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="deadline_alerts">Alertas de prazos</Label>
            <Switch
              id="deadline_alerts"
              checked={formData.deadline_alerts !== false}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, deadline_alerts: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="publication_alerts">Alertas de publicações</Label>
            <Switch
              id="publication_alerts"
              checked={formData.publication_alerts !== false}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, publication_alerts: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="movement_alerts">Alertas de movimentos</Label>
            <Switch
              id="movement_alerts"
              checked={formData.movement_alerts !== false}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, movement_alerts: checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* QUIET HOURS */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">🌙 Horário Silencioso</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="quiet_hours">Ativar horário silencioso</Label>
            <Switch
              id="quiet_hours"
              checked={formData.quiet_hours_enabled || false}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, quiet_hours_enabled: checked })
              }
            />
          </div>

          {formData.quiet_hours_enabled && (
            <div className="grid grid-cols-2 gap-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="quiet_start">De</Label>
                <Input
                  id="quiet_start"
                  type="time"
                  value={formData.quiet_hours_start || '22:00'}
                  onChange={(e) =>
                    setFormData({ ...formData, quiet_hours_start: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet_end">Até</Label>
                <Input
                  id="quiet_end"
                  type="time"
                  value={formData.quiet_hours_end || '08:00'}
                  onChange={(e) =>
                    setFormData({ ...formData, quiet_hours_end: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* SUBMIT */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full gap-2"
        aria-busy={isLoading}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        <Save className="w-4 h-4" />
        Salvar Preferências
      </Button>
    </form>
  );
}