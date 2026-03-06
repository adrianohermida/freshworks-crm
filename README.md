# freshworks-crm

## Site não exibindo no GitHub Pages — auditoria e fix

Para eliminar o cenário mais comum de indisponibilidade, o projeto agora suporta **os dois modos** de publicação:

1. **GitHub Actions (recomendado)**
   - Workflow publica `public/` como artifact do Pages.
2. **Deploy from branch (main/root)**
   - Arquivo `index.html` na raiz redireciona para `public/index.html`.

Com isso, se o repositório estiver configurado em qualquer um dos dois modos, o site abre.

## O que foi ajustado

- Mantido workflow em `.github/workflows/deploy-pages.yml` para deploy de `public/`.
- Adicionado `index.html` na raiz com redirecionamento automático para `./public/index.html`.

## Checklist rápido no GitHub

1. Acesse **Settings → Pages**.
2. Use uma destas opções:
   - **Source: GitHub Actions** (recomendado), ou
   - **Deploy from a branch → main / root**.
3. Se usar Actions, confira o job `Deploy static site to GitHub Pages` em **Actions**.
4. Reabra a URL pública do Pages.

## Estrutura atual

- `public/` → frontend principal (home e dashboard)
- `public/index.html` → home
- `public/dashboard.html` → dashboard
- `src/` → servidor local Node + SQLite para modo API local

## Execução local

```bash
node src/server.js
```
