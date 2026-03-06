import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

export default function BrandingManager() {
  const queryClient = useQueryClient();
  const [branding, setBranding] = useState({
    company_name: '',
    company_logo: '',
    company_logo_dark: '',
    favicon_url: '',
    tagline: '',
    website_url: '',
    support_email: '',
    support_phone: '',
    address: '',
    social_media: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    },
    footer_text: '',
    hero_banner_url: '',
    custom_css: ''
  });

  const { data: existingBranding, isLoading } = useQuery({
    queryKey: ['branding'],
    queryFn: async () => {
      const configs = await base44.entities.BrandingConfig.list();
      return configs?.[0] || null;
    }
  });

  React.useEffect(() => {
    if (existingBranding) {
      setBranding(existingBranding);
    }
  }, [existingBranding]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (existingBranding?.id) {
        return base44.entities.BrandingConfig.update(existingBranding.id, data);
      }
      return base44.entities.BrandingConfig.create(data);
    },
    onSuccess: () => {
      toast.success('✅ Branding salvo!');
      queryClient.invalidateQueries({ queryKey: ['branding'] });
    },
    onError: (error) => {
      toast.error('❌ Erro: ' + error.message);
    }
  });

  const handleSave = () => {
    if (!branding.company_name.trim()) {
      toast.error('Digite o nome da empresa');
      return;
    }
    saveMutation.mutate(branding);
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 py-8">Carregando branding...</p>;
  }

  const updateSocialMedia = (key, value) => {
    setBranding({
      ...branding,
      social_media: {
        ...branding.social_media,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Logo Preview */}
      {(branding.company_logo || branding.company_logo_dark) && (
        <Card>
          <CardHeader>
            <CardTitle>📸 Prévia do Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branding.company_logo && (
                <div>
                  <p className="text-xs font-medium mb-2">Logo Claro</p>
                  <img src={branding.company_logo} alt="Logo" className="h-16 object-contain" />
                </div>
              )}
              {branding.company_logo_dark && (
                <div>
                  <p className="text-xs font-medium mb-2">Logo Escuro</p>
                  <div className="bg-gray-900 p-4 rounded">
                    <img src={branding.company_logo_dark} alt="Logo Dark" className="h-16 object-contain" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Branding Form */}
      <Card>
        <CardHeader>
          <CardTitle>🏢 Configuração de Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome da Empresa *</label>
              <Input
                value={branding.company_name}
                onChange={(e) => setBranding({ ...branding, company_name: e.target.value })}
                placeholder="Ex: Acme Corp"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tagline</label>
              <Input
                value={branding.tagline}
                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                placeholder="Ex: Suporte que funciona"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Logo (URL)</label>
              <Input
                value={branding.company_logo}
                onChange={(e) => setBranding({ ...branding, company_logo: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Logo Escuro (URL)</label>
              <Input
                value={branding.company_logo_dark}
                onChange={(e) => setBranding({ ...branding, company_logo_dark: e.target.value })}
                placeholder="https://example.com/logo-dark.png"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Favicon (URL)</label>
              <Input
                value={branding.favicon_url}
                onChange={(e) => setBranding({ ...branding, favicon_url: e.target.value })}
                placeholder="https://example.com/favicon.ico"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Website</label>
              <Input
                value={branding.website_url}
                onChange={(e) => setBranding({ ...branding, website_url: e.target.value })}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email de Suporte</label>
              <Input
                type="email"
                value={branding.support_email}
                onChange={(e) => setBranding({ ...branding, support_email: e.target.value })}
                placeholder="support@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Telefone de Suporte</label>
              <Input
                value={branding.support_phone}
                onChange={(e) => setBranding({ ...branding, support_phone: e.target.value })}
                placeholder="(11) 3000-0000"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Endereço</label>
            <Input
              value={branding.address}
              onChange={(e) => setBranding({ ...branding, address: e.target.value })}
              placeholder="Rua X, 123 - São Paulo, SP"
              className="mt-1"
            />
          </div>

          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-medium">🌐 Redes Sociais</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Facebook</label>
                <Input
                  value={branding.social_media.facebook}
                  onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Twitter/X</label>
                <Input
                  value={branding.social_media.twitter}
                  onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Instagram</label>
                <Input
                  value={branding.social_media.instagram}
                  onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-sm font-medium">LinkedIn</label>
                <Input
                  value={branding.social_media.linkedin}
                  onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-medium">🖼️ Outros</h4>
            <div>
              <label className="text-sm font-medium">URL da Imagem Hero</label>
              <Input
                value={branding.hero_banner_url}
                onChange={(e) => setBranding({ ...branding, hero_banner_url: e.target.value })}
                placeholder="https://example.com/banner.jpg"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Texto do Rodapé</label>
              <Textarea
                value={branding.footer_text}
                onChange={(e) => setBranding({ ...branding, footer_text: e.target.value })}
                placeholder="© 2026 Sua Empresa. Todos os direitos reservados."
                className="mt-1 h-20"
              />
            </div>

            <div>
              <label className="text-sm font-medium">CSS Customizado (limitado)</label>
              <Textarea
                value={branding.custom_css}
                onChange={(e) => setBranding({ ...branding, custom_css: e.target.value })}
                placeholder=".custom-class { color: blue; }"
                className="mt-1 h-24 font-mono text-xs"
              />
              <p className="text-xs text-gray-500 mt-1">⚠️ CSS será sanitizado por segurança</p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            Salvar Branding
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}