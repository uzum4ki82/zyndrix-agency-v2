const fs = require('fs');
const path = require('path');

const esPath = path.join('e:', 'Antigravity', 'web agencia ia', 'src', 'dictionaries', 'es.json');
const enPath = path.join('e:', 'Antigravity', 'web agencia ia', 'src', 'dictionaries', 'en.json');

const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function findMissing(source, target, p = '') {
  for (const key in source) {
    const currentPath = p ? `${p}.${key}` : key;
    if (!(key in target)) {
      console.log(`Missing: ${currentPath}`);
    } else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      findMissing(source[key], target[key], currentPath);
    }
  }
}

console.log('--- MISSING IN EN ---');
findMissing(es, en);
console.log('--- MISSING IN ES ---');
findMissing(en, es);
