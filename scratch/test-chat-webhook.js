async function testChatWebhook() {
  const url = 'https://n8n.zyndrix.dev/webhook/7f93bc65-c3da-4de3-99e4-800040bdbc35/chat';
  const payload = { 
    message: 'hola de prueba desde servidor', 
    sessionId: 'human-chat-session' 
  };

  console.log('--- TESTING CHAT WEBHOOK ---');
  console.log('URL:', url);
  console.log('Payload:', JSON.stringify(payload));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('HTTP Status:', res.status);
    const text = await res.text();
    console.log('Response Body:', text);
    
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON Success:', !!json);
    } catch (e) {
      console.log('Response is not valid JSON (this might be the issue if the frontend expects .json())');
    }

  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
  }
}

testChatWebhook();
