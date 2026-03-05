import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Check } from 'lucide-react';

const PRESET_COLORS = {
  light: {
    primary_color: '#3B82F6',
    secondary_color: '#8B5CF6',
    accent_color: '#EC4899',
    background_color: '#FFFFFF',
    text_color: '#1F2937'
  },
  dark: {
    primary_color: '#60A5FA',
    secondary_color: '#A78BFA',
    accent_color: '#F472B6',
    background_color: '#1F2937',
    text_color: '#F3F4F6'
  }
};

export default function ThemeManager() {
  const queryClient = useQueryClient();
  const [newTheme, setNewTheme] = useState({
    name: '',
    description: '',
    preset: 'light',
    primary_color: '#3B82F6',
    secondary_color: '#8B5CF6',
    accent_color: '#EC4899',
    danger_color: '#EF4444',
    success_color: '#10B981',
    warning_color: '#F59E0B',
    info_color: '#3B82F6',
    background_color: '#FFFFFF',
    text_color: '#1F2937',
    border_radius: 'md',
    font_family: 'system',
    font_size: 'md'
  });
  const [editingId, setEditingId] = useState(null);
  const [copied, setCopied] = useState(null);

  const { data: themes = [], isLoading } = useQuery({
    queryKey: ['themes'],
    queryFn: () => base44.entities.ThemeConfig.list(),
    initialData: []
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingId) {
        return base44.entities.ThemeConfig.update(editingId, data);
      }
      return base44.entities.ThemeConfig.create(data);
    },
    onSuccess: () => {
      toast.success(editingId ? '✏️ Tema atualizado!' : '🎨 Tema criado!');
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      resetForm();
    }
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id) => {
      // Desativar outros temas
      for (const theme of themes) {
        if (theme.id !== id) {
          await base44.entities.ThemeConfig.update(theme.id, { is_default: false, is_active: false });
        }
      }
      // Ativar novo tema
      return base44.entities.ThemeConfig.update(id, { is_default: true, is_active: true });
    },
    onSuccess: () => {
      toast.success('✓ Tema ativado!');
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ThemeConfig.delete(id),
    onSuccess: () => {
      toast.success('❌ Tema removido');
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    }
  });

  const resetForm = () => {
    setNewTheme({
      name: '',
      description: '',
      preset: 'light',
      primary_color: '#3B82F6',
      secondary_color: '#8B5CF6',
      accent_color: '#EC4899',
      danger_color: '#EF4444',
      success_color: '#10B981',
      warning_color: '#F59E0B',
      info_color: '#3B82F6',
      background_color: '#FFFFFF',
      text_color: '#1F2937',
      border_radius: 'md',
      font_family: 'system',
      font_size: 'md'
    });
    setEditingId(null);
  };

  const handlePresetChange = (preset) => {
    setNewTheme({
      ...newTheme,
      preset,
      ...PRESET_COLORS[preset]
    });
  };

  const handleSave = () => {
    if (!newTheme.name.trim()) {
      toast.error('Digite um nome para o tema');
      return;
    }
    saveMutation.mutate(newTheme);
  };

  const copyThemeCode = (theme) => {
    const code = JSON.stringify(theme, null, 2);
    navigator.clipboard.writeText(code);
    setCopied(theme.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? '✏️ Editar Tema' : '🎨 Novo Tema'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome do Tema</label>
              <Input
                value={newTheme.name}
                onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                placeholder="Ex: Azul Corporativo"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Preset</label>
              <select
                value={newTheme.preset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
              >
                <option value="light">☀️ Claro</option>
                <option value="dark">🌙 Escuro</option>
                <option value="auto">⚙️ Automático</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Input
              value={newTheme.description}
              onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
              placeholder="Descrição opcional do tema"
              className="mt-1"
            />
          </div>

          {/* Colors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4">
            {['primary_color', 'secondary_color', 'accent_color', 'danger_color', 'success_color', 'warning_color', 'info_color', 'background_color', 'text_color'].map(colorKey => (
              <div key={colorKey}>
                <label className="text-xs font-medium capitalize block mb-2">
                  {colorKey.replace('_', ' ')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newTheme[colorKey]}
                    onChange={(e) => setNewTheme({ ...newTheme, [colorKey]: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border"
                  />
                  <Input
                    value={newTheme[colorKey]}
                    onChange={(e) => setNewTheme({ ...newTheme, [colorKey]: e.target.value })}
                    placeholder="#000000"
                    className="text-xs h-10"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Other Settings */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4">
            <div>
              <label className="text-sm font-medium">Raio dos Bordos</label>
              <select
                value={newTheme.border_radius}
                onChange={(e) => setNewTheme({ ...newTheme, border_radius: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
              >
                <option value="sm">Pequeno</option>
                <option value="md">Médio</option>
                <option value="lg">Grande</option>
                <option value="xl">Muito Grande</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Família de Fonte</label>
              <select
                value={newTheme.font_family}
                onChange={(e) => setNewTheme({ ...newTheme, font_family: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
              >
                <option value="system">Sistema</option>
                <option value="sans">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Tamanho da Fonte</label>
              <select
                value={newTheme.font_size}
                onChange={(e) => setNewTheme({ ...newTheme, font_size: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
              >
                <option value="sm">Pequeno</option>
                <option value="md">Médio</option>
                <option value="lg">Grande</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
          >
            {editingId ? 'Atualizar' : 'Criar'} Tema
          </Button>
        </CardContent>
      </Card>

      {/* Themes List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Temas ({themes.length})</h3>
        {isLoading ? (
          <p className="text-sm text-gray-500 py-4">Carregando temas...</p>
        ) : themes.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nenhum tema criado</p>
        ) : (
          <div className="space-y-2">
            {themes.map(theme => (
              <Card key={theme.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded border-2 border-gray-300"
                          style={{ backgroundColor: theme.primary_color }}
                        />
                        <p className="font-semibold">{theme.name}</p>
                        {theme.is_default && (
                          <Badge className="bg-green-100 text-green-800">✓ Ativo</Badge>
                        )}
                      </div>
                      {theme.description && (
                        <p className="text-xs text-gray-600 mb-2">{theme.description}</p>
                      )}
                      <div className="flex gap-2 mb-2">
                        <div className="text-xs">
                          <span className="font-medium">Cores:</span>
                          <div className="flex gap-1 mt-1">
                            {[theme.primary_color, theme.secondary_color, theme.accent_color].map((color, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyThemeCode(theme)}
                        title="Copiar JSON"
                      >
                        {copied === theme.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      {!theme.is_default && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultMutation.mutate(theme.id)}
                        >
                          Ativar
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(theme.id)}
                        disabled={theme.is_default}
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
    </div>
  );
}