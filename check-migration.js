
const key = 'sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE';
const baseUrl = 'https://vrvfftftnlspajplqjye.supabase.co/rest/v1';

async function checkTable(tableName) {
  try {
    const res = await fetch(`${baseUrl}/${tableName}?limit=1`, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    console.log(`Table ${tableName}: ${res.status} ${res.statusText}`);
  } catch (e) {
    console.log(`Table ${tableName}: ERROR ${e.message}`);
  }
}

async function run() {
  const tables = ['leads', 'email_sequences', 'whatsapp_messages', 'conversation_logs', 'ai_insights', 'tasks'];
  for (const table of tables) {
    await checkTable(table);
  }
}

run();
