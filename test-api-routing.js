async function testLocalApi() {
  const url = 'http://localhost:3000/api/lead';
  const scenarios = [
    {
      name: 'Scenario 1: Normal Lead (Home/General)',
      body: {
        name: 'Lead General Test',
        email: 'general@zyndrix.dev',
        service: 'Audit'
      }
    },
    {
      name: 'Scenario 2: Blueprint Lead (Explicit Source)',
      body: {
        name: 'Blueprint Lead Test',
        email: 'blueprint@zyndrix.dev',
        source: 'BLUEPRINT'
      }
    }
  ];

  for (const scenario of scenarios) {
    console.log(`--- RUNNING: ${scenario.name} ---`);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenario.body)
      });
      
      console.log('API Status:', res.status);
      const json = await res.json();
      console.log('API Response:', JSON.stringify(json, null, 2));
    } catch (err) {
      console.error(`❌ FAILED ${scenario.name}:`, err.message);
      if (err.message.includes('ECONNREFUSED')) {
        console.log('💡 TIP: Make sure the dev server is running on http://localhost:3000');
      }
    }
    console.log('\n');
  }
}

testLocalApi();
