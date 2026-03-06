# freshworks-crm

Base inicial de uma **página operacional para escritório de advocacia**.

## Revisão e correção para conflitos que “não avançam”

Se o GitHub mostra algo como “0 conflicts” no arquivo mas você ainda não consegue concluir o merge, normalmente é por um destes motivos:

1. Sobrou marcador (`<<<<<<<`, `=======`, `>>>>>>>`) em algum arquivo.
2. O arquivo conflitado não foi marcado manualmente como resolvido no editor web.
3. Outro arquivo ainda está em conflito, mesmo que o atual esteja limpo.

Para reduzir esse problema de forma permanente, este repositório agora inclui:

- `.gitignore` consolidado (evita ruído de arquivos locais no merge);
- script automático `scripts/check-conflict-markers.js`;
- comando `npm run check` que falha se existir qualquer marcador de conflito.

## Como destravar o merge no PR (passo a passo)

1. Atualize sua branch local com `main`:
   ```bash
   git fetch origin
   git checkout sua-branch
   git merge origin/main
   ```
2. Rode validação de conflito:
   ```bash
   npm run check:conflicts
   ```
3. Se listar arquivos, remova os marcadores manualmente.
4. Faça commit da resolução:
   ```bash
   git add -A
   git commit -m "Resolve merge conflicts"
   git push
   ```
5. Volte ao PR: ele deve permitir avançar normalmente.

## GitHub Pages (configuração correta)

1. Vá em **Settings → Pages**.
2. Em **Build and deployment**, selecione **Source: GitHub Actions**.
3. Faça push na branch `main` (ou `master`).
4. Verifique em **Actions** a execução do workflow `Deploy static site to GitHub Pages`.

## Estrutura atual

- `public/` → frontend estático publicado no GitHub Pages
- `src/` → servidor local Node + SQLite para modo API local

## Funcionamento da página

- Tenta buscar `./api/dashboard/summary` (modo servidor local).
- Se não houver API (GitHub Pages), usa `./dashboard-summary.json`.

## SQL Server no Windows 11

Execute o script:

- `public/sql-server-setup.sql`

Validação no SSMS:

```sql
USE AdvocaciaOperacional;
GO
SELECT COUNT(*) AS total_integracoes FROM dbo.integrations_status;
GO
SELECT TOP 4 integration_key, integration_name, status
FROM dbo.integrations_status
ORDER BY integration_name;
```

Esperado: `total_integracoes = 4`.

## Execução local

```bash
node src/server.js
```
