import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function SurveyManager() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    questions: []
  });

  const handleCreateSurvey = async () => {
    if (!formData.name || formData.questions.length === 0) {
      alert('Nome e perguntas obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await base44.functions.invoke('createSurvey', {
        name: formData.name,
        description: formData.description,
        questions: formData.questions
      });

      setFormData({ name: '', description: '', questions: [] });
      setIsCreating(false);
      await loadSurveys();
    } catch (error) {
      console.error('Erro ao criar survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSurveys = async () => {
    setLoading(true);
    try {
      const result = await base44.functions.invoke('getSurveys', {});
      setSurveys(result.data?.surveys || []);
    } catch (error) {
      console.error('Erro ao carregar surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Survey Manager</h2>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" /> Nova Survey
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Survey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Nome da survey"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Textarea
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateSurvey} disabled={loading}>
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
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{survey.name}</h3>
                <p className="text-sm text-gray-600">{survey.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">ID: {survey.id}</Badge>
                  {survey.enabled && <Badge className="bg-green-500">Ativo</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
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