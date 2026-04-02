#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const files = [
  'ZYNDRIX_MASTER_FUNNEL_V10_FIXED.json',
  'ZYNDRIX_FINAL_MASTER_360_AUTOMATION_FIXED.json',
  'ZYNDRIX_ULTIMATE_AGENCY_OPERATOR_V12_FIXED.json'
];

console.log('🔍 Validating JSON syntax...\n');

let allValid = true;

files.forEach(file => {
  try {
    const filepath = path.join(__dirname, file);
    const content = fs.readFileSync(filepath, 'utf8');
    JSON.parse(content);
    console.log(`✅ ${file} - Valid JSON`);
  } catch (error) {
    console.log(`❌ ${file} - ERROR: ${error.message}`);
    allValid = false;
  }
});

console.log('\n' + (allValid ? '✅ All files are ready for import!' : '⚠️ Some files have errors'));
process.exit(allValid ? 0 : 1);
