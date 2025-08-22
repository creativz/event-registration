const https = require('https');

// Test the Firebase Function directly
const testEmailFunction = () => {
  const data = JSON.stringify({
    testEmail: 'zimarcilla@gmail.com'
  });

  const options = {
    hostname: 'us-central1-microsite-baac6.cloudfunctions.net',
    port: 443,
    path: '/testEmail',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);

    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('Response:', responseData);
      try {
        const parsed = JSON.parse(responseData);
        console.log('Parsed response:', parsed);
      } catch (e) {
        console.log('Could not parse response as JSON');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.write(data);
  req.end();
};

console.log('🧪 Testing Firebase Function...');
testEmailFunction();
