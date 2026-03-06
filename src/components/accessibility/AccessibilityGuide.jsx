import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Guia de Acessibilidade WCAG 2.1 AA
 * Componente de referência para boas práticas
 */
export default function AccessibilityGuide() {
  const wcagItems = [
    {
      categoria: "Semântica",
      items: [
        { nivel: "A", texto: "Usar tags semânticas HTML (header, nav, main, section, article, footer)" },
        { nivel: "A", texto: "Estrutura de headings correta (h1 -> h2 -> h3, sem pulos)" },
        { nivel: "A", texto: "Labels associadas a inputs (htmlFor)" }
      ]
    },
    {
      categoria: "ARIA",
      items: [
        { nivel: "AA", texto: "aria-label para ícones e botões sem texto" },
        { nivel: "AA", texto: "aria-describedby para descrições adicionais" },
        { nivel: "AA", texto: "aria-current='page' em link ativo" },
        { nivel: "AA", texto: "aria-live='polite' para atualizações dinâmicas" },
        { nivel: "AA", texto: "role='navigation', role='main', role='complementary'" }
      ]
    },
    {
      categoria: "Teclado",
      items: [
        { nivel: "A", texto: "Todos os elementos interativos com :focus visível" },
        { nivel: "A", texto: "Ordem de tab lógica (tabIndex=-1 quando apropriado)" },
        { nivel: "A", texto: "Escape para fechar modais/dropdowns" },
        { nivel: "A", texto: "Enter e Space para botões" }
      ]
    },
    {
      categoria: "Cores & Contraste",
      items: [
        { nivel: "AA", texto: "Razão de contraste mínimo 4.5:1 para texto" },
        { nivel: "AAA", texto: "Razão de contraste 7:1 para maior acessibilidade" },
        { nivel: "A", texto: "Não usar cor como único indicador (usar também ícones/texto)" }
      ]
    },
    {
      categoria: "Imagens",
      items: [
        { nivel: "A", texto: "alt text descritivo para todas as imagens" },
        { nivel: "A", texto: "alt='' para imagens decorativas" },
        { nivel: "AA", texto: "Ícones Lucide com aria-label (não usar emojis)" }
      ]
    },
    {
      categoria: "Motion & Animation",
      items: [
        { nivel: "AA", texto: "prefers-reduced-motion: reduce" },
        { nivel: "A", texto: "Sem auto-play de vídeos/áudio" },
        { nivel: "AA", texto: "Animações com duração < 3 segundos" }
      ]
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">♿ Guia de Acessibilidade</h1>
        <p className="text-gray-600">WCAG 2.1 AA - Conformidade completa</p>
      </div>

      <div className="grid gap-4">
        {wcagItems.map((cat, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-lg">{cat.categoria}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cat.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{item.texto}</p>
                    <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                      item.nivel === 'A' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      WCAG {item.nivel}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">✅ CORRETO - Label + Input</h3>
            <code className="block bg-gray-100 p-3 rounded text-sm mb-4">
{`<label htmlFor="search">
  Buscar processos
</label>
<input
  id="search"
  type="search"
  aria-describedby="search-hint"
  aria-label="Buscar por número do processo"
/>
<p id="search-hint" className="text-sm text-gray-500">
  Digite o número do processo (ex: 0000001-12.2025)
</p>`}
            </code>
          </div>

          <div>
            <h3 className="font-semibold mb-2">✅ CORRETO - Ícone com Label</h3>
            <code className="block bg-gray-100 p-3 rounded text-sm mb-4">
{`<button
  aria-label="Fechar modal"
  onClick={handleClose}
  className="p-2 hover:bg-gray-100 rounded"
>
  <X className="w-5 h-5" />
</button>`}
            </code>
          </div>

          <div>
            <h3 className="font-semibold mb-2">✅ CORRETO - Navigation Ativa</h3>
            <code className="block bg-gray-100 p-3 rounded text-sm">
{`<nav aria-label="Main navigation">
  <Link to="/dashboard" aria-current={isActive ? "page" : undefined}>
    Dashboard
  </Link>
</nav>`}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Testing Tools */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">🧪 Ferramentas de Teste</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-900 space-y-2">
          <p>• <strong>WAVE:</strong> https://wave.webaim.org/</p>
          <p>• <strong>Axe DevTools:</strong> Chrome/Firefox extension</p>
          <p>• <strong>Lighthouse:</strong> Chrome DevTools (Audits tab)</p>
          <p>• <strong>Screen Reader:</strong> NVDA (Windows) ou VoiceOver (Mac)</p>
          <p>• <strong>Contrast Checker:</strong> https://webaim.org/resources/contrastchecker/</p>
        </CardContent>
      </Card>
    </div>
  );
}