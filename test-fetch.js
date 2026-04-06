const fetch = require('node-fetch');
const URL = "https://vrvfftftnlspajplqjye.supabase.co/rest/v1/leads?order=created_at.desc&limit=1";
const KEY = "sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE";

async function testFetch() {
  const res = await fetch(URL, {
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`
    }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

testFetch();
