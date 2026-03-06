const fs = require('fs');
const path = require('path');

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules', 'data']);
const conflictPattern = /^(<<<<<<<|=======|>>>>>>>)/m;
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

    const content = fs.readFileSync(fullPath, 'utf8');
    if (conflictPattern.test(content)) {
      matches.push(relativePath);
    }
  }
}

walk(root);

if (matches.length > 0) {
  console.error('Marcadores de conflito encontrados nos arquivos:');
  matches.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log('Nenhum marcador de conflito encontrado.');
