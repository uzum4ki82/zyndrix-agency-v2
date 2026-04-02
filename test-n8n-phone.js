async function test() {
  const url = 'https://n8n.zyndrix.dev/webhook-test/zyndrix-lead-scoring';
  const data = {
    source: 'TEST_PHONE_FIX',
    record: {
      id: 'test-' + Date.now(),
      name: 'Test Antigravity',
      email: 'test@zyndrix.dev',
      phone: '+34 600 000 000',
      company_name: 'Antigravity Lab',
      message: 'Testing if phone number reaches n8n',
      service: 'test-service',
      status: 'testing'
    }
  };

  console.log('Sending test data to n8n:', JSON.stringify(data, null, 2));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    console.log('n8n Response Status:', res.status);
    console.log('n8n Response:', await res.text());
  } catch (err) {
    console.error('Error sending to n8n:', err);
  }
}

test();
