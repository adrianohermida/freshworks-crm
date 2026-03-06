import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

export default function AdvancedFieldBuilderIntegration() {
  const [field, setField] = useState({
    label: '',
    field_type: 'text',
    description: '',
    required: false,
    choices: []
  });
  const [newChoice, setNewChoice] = useState('');

  const fieldTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'date', label: 'Data' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'email', label: 'Email' },
    { value: 'url', label: 'URL' }
  ];

  const handleAddChoice = () => {
    if (newChoice.trim()) {
      setField({
        ...field,
        choices: [...field.choices, newChoice.trim()]
      });
      setNewChoice('');
    }
  };

  const handleRemoveChoice = (index) => {
    setField({
      ...field,
      choices: field.choices.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Field Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <Input
              value={field.label}
              onChange={(e) => setField({ ...field, label: e.target.value })}
              placeholder="Campo customizado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Campo</label>
            <select
              value={field.field_type}
              onChange={(e) => setField({ ...field, field_type: e.target.value })}
              className="w-full border rounded p-2"
            >
              {fieldTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <Textarea
              value={field.description}
              onChange={(e) => setField({ ...field, description: e.target.value })}
              placeholder="Descrição do campo"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={field.required}
              onChange={(e) => setField({ ...field, required: e.target.checked })}
            />
            <label htmlFor="required" className="text-sm font-medium">
              Campo Obrigatório
            </label>
          </div>

          {['dropdown', 'radio'].includes(field.field_type) && (
            <div>
              <label className="block text-sm font-medium mb-2">Opções</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newChoice}
                  onChange={(e) => setNewChoice(e.target.value)}
                  placeholder="Nova opção"
                />
                <Button onClick={handleAddChoice} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                {field.choices.map((choice, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-sm">{choice}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveChoice(idx)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-2">Preview</h3>
            <div className="bg-gray-50 p-4 rounded">
              <label className="block text-sm font-medium mb-2">{field.label}</label>
              {field.field_type === 'text' && (
                <input type="text" placeholder="Exemplo" disabled className="w-full" />
              )}
              {field.field_type === 'number' && (
                <input type="number" placeholder="0" disabled className="w-full" />
              )}
              {field.field_type === 'date' && (
                <input type="date" disabled className="w-full" />
              )}
              {['dropdown', 'radio'].includes(field.field_type) && (
                <select disabled className="w-full">
                  {field.choices.map((choice, idx) => (
                    <option key={idx}>{choice}</option>
                  ))}
                </select>
              )}
              {field.required && <p className="text-xs text-red-500 mt-1">*Obrigatório</p>}
            </div>
          </div>

          <Button className="w-full">Salvar Campo</Button>
        </CardContent>
      </Card>
    </div>
  );
}