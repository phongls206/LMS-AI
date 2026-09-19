const http = require('http');

function postLogin(payload) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', (e) => resolve({ error: e.message }));
    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function testAll() {
  const users = ['admin01', 'teacher01', 'student01', 'staff01', 'staff02'];
  for (const u of users) {
    const res = await postLogin({ tenDangNhap: u, matKhau: '123456' });
    console.log(`User [${u}]:`, res);
  }
}

testAll();
