import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Plus, Eye } from 'lucide-react';

const TRIGGER_TYPES = {
  ticket_created: '🎫 Ticket Criado',
  ticket_updated: '🔄 Ticket Atualizado',
  response_added: '💬 Resposta Adicionada',
  sla_breach: '⚠️ SLA Violado',
  ticket_closed: '✓ Ticket Fechado',
  manual: '📤 Manual'
};

const RECIPIENT_TYPES = ['customer', 'agent', 'admin'];

const TEMPLATE_VARIABLES = {
  ticket_created: ['{{customer_name}}', '{{ticket_id}}', '{{ticket_subject}}', '{{ticket_priority}}'],
  ticket_updated: ['{{customer_name}}', '{{ticket_id}}', '{{ticket_status}}', '{{agent_name}}'],
  response_added: ['{{customer_name}}', '{{ticket_id}}', '{{response_preview}}', '{{agent_name}}'],
  sla_breach: ['{{ticket_id}}', '{{sla_type}}', '{{ticket_priority}}'],
  ticket_closed: ['{{customer_name}}', '{{ticket_id}}', '{{resolution_time}}'],
  manual: ['{{custom_variable}}']
};

export default function EmailTemplateManager() {
  const queryClient = useQueryClient();
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    body: '',
    trigger_type: 'ticket_created',
    recipients: [],
    enabled: true,
    category: 'notifications'
  });
  const [editingId, setEditingId] = useState(null);
  const [showPreview, setShowPreview] = useState(null);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: () => base44.entities.EmailTemplate.list(),
    initialData: []
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingId) {
        return base44.entities.EmailTemplate.update(editingId, data);
      }
      return base44.entities.EmailTemplate.create({
        ...data,
        created_by: user?.email
      });
    },
    onSuccess: () => {
      toast.success(editingId ? '✏️ Template atualizado!' : '📧 Template criado!');
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.EmailTemplate.delete(id),
    onSuccess: () => {
      toast.success('❌ Template removido');
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => {
      const template = templates.find(t => t.id === id);
      return base44.entities.EmailTemplate.update(id, { enabled: !template.enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    }
  });

  const resetForm = () => {
    setNewTemplate({
      name: '',
      subject: '',
      body: '',
      trigger_type: 'ticket_created',
      recipients: [],
      enabled: true,
      category: 'notifications'
    });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!newTemplate.name.trim() || !newTemplate.subject.trim() || !newTemplate.body.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (newTemplate.recipients.length === 0) {
      toast.error('Selecione pelo menos um destinatário');
      return;
    }

    saveMutation.mutate(newTemplate);
  };

  const toggleRecipient = (recipient) => {
    const updated = newTemplate.recipients.includes(recipient)
      ? newTemplate.recipients.filter(r => r !== recipient)
      : [...newTemplate.recipients, recipient];
    setNewTemplate({ ...newTemplate, recipients: updated });
  };

  const availableVariables = TEMPLATE_VARIABLES[newTemplate.trigger_type] || [];

  return (
    <div className="space-y-6">
      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? '✏️ Editar Template' : '📧 Novo Template de Email'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome do Template</label>
              <Input
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="Ex: Notificação de Novo Ticket"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tipo de Disparo</label>
              <select
                value={newTemplate.trigger_type}
                onChange={(e) => setNewTemplate({ ...newTemplate, trigger_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
              >
                {Object.entries(TRIGGER_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Assunto</label>
            <Input
              value={newTemplate.subject}
              onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
              placeholder="Ex: Novo ticket: {{ticket_subject}}"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Corpo do Email</label>
            <Textarea
              value={newTemplate.body}
              onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
              placeholder="Escreva o conteúdo do email. Use variáveis como {{customer_name}}"
              className="min-h-48 mt-1 font-mono text-xs"
            />
            {availableVariables.length > 0 && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                <p className="font-medium mb-1">Variáveis disponíveis:</p>
                <div className="flex gap-1 flex-wrap">
                  {availableVariables.map(v => (
                    <Badge key={v} variant="outline" className="cursor-pointer" onClick={() => {
                      setNewTemplate({
                        ...newTemplate,
                        body: newTemplate.body + ' ' + v
                      });
                    }}>
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 border-t pt-4">
            <label className="text-sm font-medium">Destinatários</label>
            <div className="flex gap-4">
              {RECIPIENT_TYPES.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTemplate.recipients.includes(type)}
                    onChange={() => toggleRecipient(type)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm capitalize">
                    {type === 'customer' && '👤 Cliente'}
                    {type === 'agent' && '👨‍💼 Agente'}
                    {type === 'admin' && '⚙️ Admin'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingId ? 'Atualizar' : 'Criar'} Template
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Templates ({templates.length})</h3>
        {isLoading ? (
          <p className="text-sm text-gray-500 py-4">Carregando templates...</p>
        ) : templates.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nenhum template criado</p>
        ) : (
          <div className="space-y-2">
            {templates.map(template => (
              <Card key={template.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{template.name}</p>
                        <Badge variant={template.enabled ? 'default' : 'secondary'}>
                          {template.enabled ? '✓ Ativo' : '○ Inativo'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {TRIGGER_TYPES[template.trigger_type]}
                      </p>
                      <div className="flex gap-1 flex-wrap mb-2">
                        {template.recipients.map(r => (
                          <Badge key={r} variant="outline" className="text-xs">
                            {r === 'customer' && '👤'}
                            {r === 'agent' && '👨‍💼'}
                            {r === 'admin' && '⚙️'}
                            {' '}{r}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Usado {template.usage_count || 0} vezes
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPreview(template.id === showPreview ? null : template.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingId(template.id);
                          setNewTemplate(template);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {showPreview === template.id && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border-t">
                      <p className="text-xs font-semibold mb-2">Preview:</p>
                      <p className="text-xs mb-2"><strong>Assunto:</strong> {template.subject}</p>
                      <div className="text-xs whitespace-pre-wrap bg-white p-2 rounded border text-gray-700 max-h-32 overflow-y-auto">
                        {template.body}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}