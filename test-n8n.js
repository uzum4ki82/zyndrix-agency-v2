const url = 'https://n8n.zyndrix.dev/webhook/leadmagnet';

async function test() {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source: 'ANTIGRAVITY_TEST',
      record: {
        id: 'test-uuid-123',
        name: 'ANTIGRAVITY TEST',
        email: 'test@zyndrix.dev',
        company_name: 'TEST_LAB',
        message: 'TESTING WEBHOOK REACHABILITY'
      }
    })
  });
  
  console.log('STATUS:', res.status);
  console.log('TEXT:', await res.text());
}

test();
