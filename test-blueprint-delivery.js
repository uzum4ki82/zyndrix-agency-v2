async function testBlueprint() {
  const url = 'https://n8n.zyndrix.dev/webhook/blueprint';
  const data = {
    source: 'BLUEPRINT',
    record: {
      id: 'test-bp-' + Date.now(),
      name: 'Test Antigravity Blueprint',
      email: 'test-blueprint@zyndrix.dev',
      phone: '+34 600 000 000',
      company_name: 'Antigravity Lab',
      message: 'This is a test from the Blueprint form to ensure routing works.',
      service: 'Plano 2026 V6.0',
      team_size: '10-50',
      status: 'testing'
    }
  };

  console.log('--- EXECUTING TEST: BLUEPRINT WEBHOOK ---');
  console.log('Target URL:', url);
  console.log('Payload:', JSON.stringify(data, null, 2));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    console.log('Result Status:', res.status);
    const responseText = await res.text();
    console.log('Result Text:', responseText);
    
    if (res.ok) {
      console.log('✅ TEST SUCCESSFUL: The webhook blueprint received the data.');
    } else {
      console.log('❌ TEST FAILED: Status', res.status);
    }
  } catch (err) {
    console.error('❌ ERROR EXECUTING TEST:', err);
  }
}

testBlueprint();
