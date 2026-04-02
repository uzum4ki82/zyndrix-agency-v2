const url = 'https://vrvfftftnlspajplqjye.supabase.co/rest/v1/leads';
const key = 'sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE';

async function test() {
  const res = await fetch('https://vrvfftftnlspajplqjye.supabase.co/rest/v1/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      name: 'ANTIGRAVITY TEST',
      email: 'terminal-test@zyndrix.dev',
      company_name: 'ZYNDRIX LABS',
      message: 'TESTING SYSTEM PERSISTENCE',
      service: 'Blueprint V12 Final'
    })
  });
  
  console.log('STATUS:', res.status);
  console.log('TEXT:', await res.text());
}

test();
