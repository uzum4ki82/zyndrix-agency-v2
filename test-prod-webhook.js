const fetch = require('node-fetch');

const data = {
  name: 'Antigravity Test (Phone Fix)',
  email: 'test-phone@zyndrix.dev',
  phone: '+34 600 000 001',
  budget: 'Premium (10k+)',
  company_name: 'Antigravity AI Lab',
  service: 'IA Audit Correcta',
  message: 'Si ves el telefono y el budget en n8n, el problema esta resuelto. Recuerda actualizar tu nodo de OpenAI.'
};

async function testWebhooks() {
  const prodUrl = 'https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring';
  
  console.log('Sending test data to PRODUCTION n8n...');
  try {
    const res = await fetch(prodUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        record: data,
        source: 'Landing Script Fix'
      })
    });
    console.log('Production response status:', res.status);
    const text = await res.text();
    console.log('Production response body:', text);
  } catch (err) {
    console.error('Production error:', err.message);
  }
}

testWebhooks();
