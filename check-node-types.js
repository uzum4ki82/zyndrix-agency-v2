const fs = require('fs');

const files = [
  'ZYNDRIX_MASTER_FUNNEL_V10_FIXED.json',
  'ZYNDRIX_FINAL_MASTER_360_AUTOMATION_FIXED.json',
  'ZYNDRIX_ULTIMATE_AGENCY_OPERATOR_V12_FIXED.json'
];

files.forEach(file => {
  try {
    const content = JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log(`\n📄 ${file}`);
    console.log('─'.repeat(50));
    content.nodes.forEach(node => {
      console.log(`  [${node.id}] ${node.name} → ${node.type}`);
    });
  } catch (e) {
    console.log(`❌ ${file}: ${e.message}`);
  }
});
