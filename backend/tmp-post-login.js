(async () => {
  try {
    const url = 'http://localhost:8888/api/login';
    const payload = { email: 'a@b.com', password: 'x' };

    // Node 18+ has global fetch
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // timeout can be managed via AbortController if desired
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    try {
      console.log('Body (parsed JSON):', JSON.parse(text));
    } catch (e) {
      console.log('Body (raw):', text);
    }
  } catch (err) {
    console.error('Request failed:', err);
    process.exitCode = 1;
  }
})();
