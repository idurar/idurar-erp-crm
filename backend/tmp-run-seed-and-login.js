const fs = require('fs');
(async () => {
  try {
    const seedRes = await fetch('http://localhost:8888/__dev/seed-test-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.com', password: 'x' }),
    });
    const seedJson = await seedRes.json().catch(() => null);

    const loginRes = await fetch('http://localhost:8888/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.com', password: 'x' }),
    });
    const loginJson = await loginRes.json().catch(() => null);

    const out = {
      seed: { status: seedRes.status, body: seedJson },
      login: { status: loginRes.status, body: loginJson },
    };

    fs.writeFileSync('./tmp-seed-login-result.json', JSON.stringify(out, null, 2), 'utf8');
    console.log('Wrote ./tmp-seed-login-result.json');
  } catch (err) {
    fs.writeFileSync('./tmp-seed-login-result.json', JSON.stringify({ error: err.message }), 'utf8');
    console.error(err);
    process.exit(1);
  }
})();
