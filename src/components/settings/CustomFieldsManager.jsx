import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function CustomFieldsManager() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    field_type: 'text',
    description: '',
    required: false
  });

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    setLoading(true);
    try {
      const result = await base44.functions.invoke('getCustomFieldsMetadata', {});
      setFields(result.data || []);
    } catch (error) {
      console.error('Erro ao carregar campos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateField = async () => {
    if (!formData.label || !formData.field_type) {
      alert('Label e tipo obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await base44.functions.invoke('createCustomField', formData);
      setFormData({ label: '', field_type: 'text', description: '', required: false });
      setIsCreating(false);
      await loadFields();
    } catch (error) {
      console.error('Erro ao criar campo:', error);
    } finally {
      setLoading(false);
    }
  };

  const fieldTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'date', label: 'Data' },
    { value: 'checkbox', label: 'Checkbox' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Custom Fields Manager</h2>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Campo
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Campo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Label do campo"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            />
            <select
              value={formData.field_type}
              onChange={(e) => setFormData({ ...formData, field_type: e.target.value })}
              className="w-full border rounded p-2"
            >
              {fieldTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <Textarea
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              />
              <span>Obrigatório</span>
            </label>
            <div className="flex gap-2">
              <Button onClick={handleCreateField} disabled={loading}>
                {loading ? 'Criando...' : 'Criar'}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {fields.map((field) => (
          <Card key={field.id}>
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{field.label}</h3>
                <p className="text-sm text-gray-600">{field.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{field.field_type}</Badge>
                  {field.required && <Badge className="bg-orange-500">Obrigatório</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}