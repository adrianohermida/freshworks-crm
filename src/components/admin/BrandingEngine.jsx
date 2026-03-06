import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function BrandingEngine() {
  const [branding, setBranding] = useState({
    logo_url: '',
    primary_color: '#00bcd4',
    secondary_color: '#00e676',
    accent_color: '#2196f3',
    font_family: 'Inter',
    company_name: 'DataJud',
    custom_domain: ''
  });

  const [preview, setPreview] = useState(false);

  const fonts = ['Inter', 'Poppins', 'Roboto', 'Montserrat', 'Open Sans'];
  const themes = [
    { name: 'Blue', primary: '#2196f3', secondary: '#1976d2', accent: '#0d47a1' },
    { name: 'Cyan', primary: '#00bcd4', secondary: '#0097a7', accent: '#006064' },
    { name: 'Green', primary: '#4caf50', secondary: '#388e3c', accent: '#1b5e20' },
    { name: 'Purple', primary: '#9c27b0', secondary: '#7b1fa2', accent: '#4a148c' }
  ];

  const applyTheme = (theme) => {
    setBranding({
      ...branding,
      primary_color: theme.primary,
      secondary_color: theme.secondary,
      accent_color: theme.accent
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="themes">Temas</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customização de Marca</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Empresa</Label>
                <Input
                  value={branding.company_name}
                  onChange={(e) => setBranding({...branding, company_name: e.target.value})}
                  placeholder="Seu nome da empresa"
                />
              </div>

              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={branding.logo_url}
                  onChange={(e) => setBranding({...branding, logo_url: e.target.value})}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label>Cor Primária</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={branding.primary_color}
                    onChange={(e) => setBranding({...branding, primary_color: e.target.value})}
                    className="h-10 w-20 rounded cursor-pointer"
                  />
                  <Input
                    value={branding.primary_color}
                    onChange={(e) => setBranding({...branding, primary_color: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fonte</Label>
                <select
                  value={branding.font_family}
                  onChange={(e) => setBranding({...branding, font_family: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {fonts.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Domínio Customizado</Label>
                <Input
                  value={branding.custom_domain}
                  onChange={(e) => setBranding({...branding, custom_domain: e.target.value})}
                  placeholder="custom.example.com"
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                ✓ Salvar Customização
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Temas Pré-definidos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {themes.map(theme => (
                <button
                  key={theme.name}
                  onClick={() => applyTheme(theme)}
                  className="p-4 rounded-lg border-2 hover:border-gray-800 transition text-center"
                >
                  <div className="space-y-2">
                    <div className="flex gap-1 justify-center">
                      <div className="w-6 h-6 rounded" style={{backgroundColor: theme.primary}}></div>
                      <div className="w-6 h-6 rounded" style={{backgroundColor: theme.secondary}}></div>
                      <div className="w-6 h-6 rounded" style={{backgroundColor: theme.accent}}></div>
                    </div>
                    <p className="text-sm font-semibold">{theme.name}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="p-8 rounded-lg border-2 space-y-4"
                style={{
                  backgroundColor: `${branding.primary_color}15`,
                  borderColor: branding.primary_color,
                  fontFamily: branding.font_family
                }}
              >
                <h2 style={{color: branding.primary_color}} className="text-2xl font-bold">
                  {branding.company_name}
                </h2>
                <p className="text-gray-700">Seu aplicativo customizado</p>
                <Button style={{backgroundColor: branding.primary_color}} className="text-white">
                  Botão Principal
                </Button>
                <div className="flex gap-2 pt-4">
                  <div
                    className="h-3 rounded flex-1"
                    style={{backgroundColor: branding.primary_color}}
                  ></div>
                  <div
                    className="h-3 rounded flex-1"
                    style={{backgroundColor: branding.secondary_color}}
                  ></div>
                  <div
                    className="h-3 rounded flex-1"
                    style={{backgroundColor: branding.accent_color}}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}