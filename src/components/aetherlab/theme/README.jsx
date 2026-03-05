# Aetherlab Design System

Design system centralizado com variáveis e componentes reutilizáveis baseado nas especificações de estilo.

## 📋 Componentes Base

### Typography
- `H1`, `H2`, `H3`, `H4` - Headings semânticos
- `Body` - Corpo de texto com variações
- `Small` - Texto pequeno
- `Label` - Labels de formulário

### Layout
- `Container` - Container responsivo
- `Section` - Seções com padding
- `Grid` - Grid responsivo
- `Card` - Cartões com variações
- `Divider` - Divisor visual

### Forms
- `Button` - Botões com variações
- `Input` - Campos de entrada
- `Badge` - Badges/tags

## 🎨 Paleta de Cores

```javascript
Primary: #7E57FF (roxo principal)
Black: #081828 (preto do sistema)
Gray: #F4F7FA (cinza claro)
Border: #F4EEFB (bordas)
Text Body: #727272 (cinza do texto)
Text Heading: #081828 (preto dos títulos)
```

## 📐 Tipografia

- **Font**: DM Sans
- **Sizes**: 12px a 48px
- **Weights**: 300 a 800

## 📱 Breakpoints

- Desktop: 1400px+
- Laptop: 1200px - 1399px
- LG: 992px - 1199px
- MD: 768px - 991px
- SM: 480px - 767px
- XS: 0 - 479px

## 💡 Uso

```jsx
import { H1, Body } from '@/components/aetherlab/Typography';
import { Container, Card, Grid } from '@/components/aetherlab/Container';
import Button from '@/components/aetherlab/Button';
import { COLORS } from '@/components/aetherlab/theme/ThemeConfig';

export default function Page() {
  return (
    <Container>
      <H1>Título Principal</H1>
      <Body>Corpo de texto...</Body>
      <Grid cols={3}>
        <Card>Conteúdo</Card>
      </Grid>
      <Button>Clique aqui</Button>
    </Container>
  );
}
```

## 🔧 Customização

Todos os componentes aceitam props padrão do React (`className`, event handlers, etc) e suportam customização via props específicas.