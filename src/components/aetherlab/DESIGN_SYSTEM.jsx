# Aetherlab Design System

Documentação centralizada do design system baseado na marca Aetherlab.

## 🎨 Paleta de Cores

### Cores Primárias
- **Primary**: `#7E57FF` (Púrpura) - Cor principal da marca
- **Primary Light**: `#9F7FFF` (Hover/Lighter states)
- **Primary Dark**: `#6A4AD1` (Active/Darker states)

### Cores Neutras
- **White**: `#ffffff` - Fundo claro, cards
- **Black**: `#081828` - Headings, texto principal
- **Light Gray**: `#F4F7FA` - Backgrounds alternados
- **Body Text**: `#727272` - Texto secundário
- **Border**: `#F4EEFB` - Bordas e separadores

### Cores de Status
- **Success**: `#10B981` - Confirmação, sucesso
- **Warning**: `#F59E0B` - Alertas, atenção
- **Error**: `#EF4444` - Erros, deletar
- **Info**: `#3B82F6` - Informações

## 📝 Tipografia

### Font Family
- **Primary**: DM Sans (UI text)
- **Mono**: Fira Code (código)

### Escalas
- **H1**: 48px, 700 (bold), line-height 56px
- **H2**: 36px, 700 (bold), line-height 44px
- **H3**: 28px, 600 (semibold), line-height 36px
- **H4**: 24px, 600 (semibold), line-height 32px
- **Body**: 16px, 400 (regular), line-height 24px
- **Small**: 14px, 400 (regular), line-height 20px
- **Caption**: 12px, 400 (regular), line-height 16px

## 📐 Espaçamento

Base unit: **8px**

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

## 🎯 Border Radius

- **none**: 0
- **sm**: 4px
- **base**: 8px
- **md**: 10px (padrão Aetherlab)
- **lg**: 12px
- **xl**: 16px
- **full**: 9999px (pill shape)

## 🌈 Sombras

- **sm**: Sombra leve para elevação
- **base**: Sombra padrão
- **md**: Sombra média para cards
- **lg**: Sombra forte para modals
- **xl**: Sombra extra para overlays
- **primary-sm**: Sombra com cor primária (15% opacidade)
- **primary-md**: Sombra com cor primária (20% opacidade)

## ⏱️ Transições

- **fast**: 150ms (micro-interactions)
- **base**: 200ms (padrão)
- **slow**: 300ms (transições principais)

## 📱 Breakpoints (Mobile-first)

- **xs**: 0px (mobile)
- **sm**: 480px (smartphone landscape)
- **md**: 768px (tablet)
- **lg**: 992px (laptop)
- **xl**: 1200px (desktop)
- **2xl**: 1400px (desktop grande)

## 🧩 Componentes Reutilizáveis

### Básicos
- `SectionTitle` - Títulos de seção
- `HeroSection` - Hero com imagem
- `ServiceCard` - Cards de serviços
- `BlogCard` - Cards de blog
- `PricingCard` - Cards de preço

### Formulários
- `ContactForm` - Formulário de contato
- `NewsletterForm` - Newsletter signup

### Seções
- `CTASection` - Call-to-action
- `AboutSection` - Seção sobre com features
- `PortfolioGrid` - Grid de portfólio com filtros
- `FAQSection` - FAQ com accordion

### Interativo
- `TestimonialSlider` - Slider de depoimentos
- `ScrollTop` - Botão voltar ao topo
- `Preloader` - Loading indicator

## 🚀 Uso

```jsx
import { designTokens, getToken } from '@/components/design-system/DesignTokens';

// Acessar tokens
const primaryColor = designTokens.colors.primary;
const spacing = getToken('spacing.md');

// Em componentes
<div style={{ 
  backgroundColor: designTokens.colors.primary,
  borderRadius: designTokens.borderRadius.md,
  padding: designTokens.spacing.lg
}}>
  Conteúdo
</div>
```

## 📋 Checklist de Conformidade

- [ ] Usar apenas cores da paleta definida
- [ ] Manter consistência de espaçamento (múltiplos de 8px)
- [ ] Aplicar border-radius padrão (10px)
- [ ] Usar tipografia conforme escala definida
- [ ] Aplicar transições suaves (150-300ms)
- [ ] Testar em todos os breakpoints
- [ ] Manter contraste mínimo de 4.5:1 para acessibilidade