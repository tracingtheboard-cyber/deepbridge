// Using global fetch (Node 18+)

async function testBridge() {
  const url = 'http://localhost:3000/api/v1/chat/completions';
  const payload = {
    model: "deepseek-chat",
    messages: [
      { role: "user", content: "Hello! Who are you?" }
    ],
    stream: false
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    console.log('--- Bridge Response ---');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

testBridge();
