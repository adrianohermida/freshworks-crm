const fs = require('fs');
const path = require('path');

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules', 'data']);
const conflictRegex = /^(<<<<<<<|=======|>>>>>>>)( .*)?$/gm;
const matches = [];

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = path.relative(root, fullPath);

    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        walk(fullPath);
      }
      continue;
    }

    let content;
    try {
      content = fs.readFileSync(fullPath, 'utf8');
    } catch (_error) {
      continue;
    }

    const fileMatches = [];
    let match;
    while ((match = conflictRegex.exec(content)) !== null) {
      const line = content.slice(0, match.index).split('\n').length;
      fileMatches.push({ marker: match[1], line });
    }

    if (fileMatches.length > 0) {
      matches.push({ file: relativePath, fileMatches });
    }
  }
}

walk(root);

if (matches.length > 0) {
  console.error('Marcadores de conflito encontrados:');
  matches.forEach((entry) => {
    console.error(`\n- ${entry.file}`);
    entry.fileMatches.forEach((item) => {
      console.error(`  linha ${item.line}: ${item.marker}`);
    });
  });
  process.exit(1);
}

console.log('Nenhum marcador de conflito encontrado.');
