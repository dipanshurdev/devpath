const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/roadmaps',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log('Success:', parsed.success);
      console.log('Roadmaps found:', parsed.data?.data?.length);
      console.log('First roadmap:', parsed.data?.data?.[0]?.title);
      console.log('Role-based roadmaps:', parsed.data?.data?.filter(r => r.type === 'role').length);
    } catch(e) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();
