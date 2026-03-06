#!/usr/bin/env bash
set -euo pipefail

BASE_BRANCH="${1:-main}"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Erro: execute dentro de um repositório Git."
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [ "$CURRENT_BRANCH" = "$BASE_BRANCH" ]; then
  echo "Erro: você está na branch base ($BASE_BRANCH). Troque para a branch do PR."
  exit 1
fi

echo "[1/6] Buscando atualizações remotas..."
git fetch origin "$BASE_BRANCH"

echo "[2/6] Fazendo merge de origin/$BASE_BRANCH em $CURRENT_BRANCH..."
set +e
git merge --no-ff "origin/$BASE_BRANCH"
MERGE_EXIT=$?
set -e

if [ $MERGE_EXIT -ne 0 ]; then
  echo "[3/6] Merge com conflitos detectado."
  echo "Arquivos com conflito:"
  git diff --name-only --diff-filter=U || true
  echo
  echo "Resolva os arquivos acima, depois execute:"
  echo "  git add -A"
  echo "  npm run check:conflicts"
  echo "  git commit -m 'Resolve merge conflicts with $BASE_BRANCH'"
  echo "  git push"
  exit 1
fi

echo "[3/6] Merge concluído sem conflitos."

echo "[4/6] Executando validação de marcadores..."
npm run check:conflicts

echo "[5/6] Estado atual do repositório:"
git status --short

echo "[6/6] Concluído. Se houver mudanças, faça commit e push."
