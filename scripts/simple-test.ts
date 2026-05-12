const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/test-debug',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e.message);
  });

  req.end();
}

testAPI();
