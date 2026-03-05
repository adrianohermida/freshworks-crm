import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Globe, Download, Upload } from 'lucide-react';

const AVAILABLE_LANGUAGES = [
  { code: 'pt-BR', name: 'Português (Brasil)', native: 'Português', flag: '🇧🇷' },
  { code: 'en-US', name: 'English (USA)', native: 'English', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español (España)', native: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français (France)', native: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch (Deutschland)', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja-JP', name: '日本語 (日本)', native: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', name: '中文 (简体)', native: '中文', flag: '🇨🇳' }
];

export default function LanguageManager() {
  const queryClient = useQueryClient();
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);
  const [newLang, setNewLang] = useState({
    language_code: 'en-US',
    is_active: true,
    is_default: false
  });

  const { data: languages = [], isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: () => base44.entities.LanguageConfig.list(),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      const langData = AVAILABLE_LANGUAGES.find(l => l.code === data.language_code);
      return base44.entities.LanguageConfig.create({
        ...data,
        language_name: langData.name,
        language_native: langData.native,
        flag_emoji: langData.flag,
        translations: {}
      });
    },
    onSuccess: () => {
      toast.success('🌐 Idioma adicionado!');
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      setShowNewForm(false);
      setNewLang({
        language_code: 'en-US',
        is_active: true,
        is_default: false
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.LanguageConfig.delete(id),
    onSuccess: () => {
      toast.success('❌ Idioma removido');
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    }
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id) => {
      // Desativar outros padrões
      for (const lang of languages) {
        if (lang.is_default) {
          await base44.entities.LanguageConfig.update(lang.id, { is_default: false });
        }
      }
      // Ativar novo padrão
      return base44.entities.LanguageConfig.update(id, { is_default: true });
    },
    onSuccess: () => {
      toast.success('✓ Idioma padrão alterado!');
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    }
  });

  const handleAddLanguage = () => {
    const alreadyExists = languages.some(l => l.language_code === newLang.language_code);
    if (alreadyExists) {
      toast.error('Este idioma já foi adicionado');
      return;
    }
    createMutation.mutate(newLang);
  };

  const usedLanguages = languages.map(l => l.language_code);
  const availableToAdd = AVAILABLE_LANGUAGES.filter(l => !usedLanguages.includes(l.code));

  return (
    <div className="space-y-6">
      {/* Add Language Form */}
      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>🌐 Adicionar Idioma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Idioma</label>
              <select
                value={newLang.language_code}
                onChange={(e) => setNewLang({ ...newLang, language_code: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
              >
                {availableToAdd.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newLang.is_default}
                onChange={(e) => setNewLang({ ...newLang, is_default: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Definir como padrão</span>
            </label>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleAddLanguage}
                disabled={createMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Languages List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">🌍 Idiomas ({languages.length})</h3>
          {!showNewForm && availableToAdd.length > 0 && (
            <Button
              onClick={() => setShowNewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Idioma
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500 py-4">Carregando idiomas...</p>
        ) : languages.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nenhum idioma configurado</p>
        ) : (
          <div className="space-y-2">
            {languages.map(lang => (
              <Card key={lang.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{lang.flag_emoji}</span>
                        <div>
                          <p className="font-semibold">{lang.language_name}</p>
                          <p className="text-xs text-gray-600">{lang.language_native}</p>
                        </div>
                        {lang.is_default && (
                          <Badge className="bg-green-100 text-green-800 ml-auto">
                            ✓ Padrão
                          </Badge>
                        )}
                        {!lang.is_active && (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">Tradução</span>
                            <span className="text-xs text-gray-600">
                              {lang.completion_percentage || 0}%
                            </span>
                          </div>
                          <Progress value={lang.completion_percentage || 0} className="h-2" />
                        </div>

                        {lang.direction === 'rtl' && (
                          <p className="text-xs text-blue-600">
                            📝 Idioma com direção RTL (direita para esquerda)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info('🔄 Exportar traducões em desenvolvimento')}
                        className="gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Exportar
                      </Button>
                      {!lang.is_default && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDefaultMutation.mutate(lang.id)}
                        >
                          Definir Padrão
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(lang.id)}
                        disabled={lang.is_default}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <p className="text-2xl font-bold text-blue-600">{languages.length}</p>
              <p className="text-xs text-gray-600 mt-1">Idiomas Ativos</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <p className="text-2xl font-bold text-green-600">
                {languages.filter(l => l.is_default).length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Padrão</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <p className="text-2xl font-bold text-purple-600">
                {availableToAdd.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Disponíveis</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(
                  languages.reduce((sum, l) => sum + (l.completion_percentage || 0), 0) / Math.max(languages.length, 1)
                )}%
              </p>
              <p className="text-xs text-gray-600 mt-1">Média Tradução</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}