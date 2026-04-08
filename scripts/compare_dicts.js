const fs = require('fs');

function compareObjects(obj1, obj2, path = '') {
  const missingKeys = [];
  
  for (const key in obj1) {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in obj2)) {
      missingKeys.push(currentPath);
    } else if (typeof obj1[key] === 'object' && obj1[key] !== null) {
      missingKeys.push(...compareObjects(obj1[key], obj2[key], currentPath));
    }
  }
  
  return missingKeys;
}

const es = JSON.parse(fs.readFileSync('src/dictionaries/es.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/dictionaries/en.json', 'utf8'));

console.log('--- COMPARING ES -> EN ---');
const missingInEn = compareObjects(es, en);
if (missingInEn.length > 0) {
  console.log('Missing in EN:');
  missingInEn.forEach(k => console.log(` - ${k}`));
} else {
  console.log('EN is parity with ES');
}

console.log('\n--- COMPARING EN -> ES ---');
const missingInEs = compareObjects(en, es);
if (missingInEs.length > 0) {
  console.log('Missing in ES:');
  missingInEs.forEach(k => console.log(` - ${k}`));
} else {
  console.log('ES is parity with EN');
}
