import axios from 'axios';

async function testApi() {
  try {
    const resp = await axios.get('http://localhost:5002/api/quotes/converted');
    console.log('API Response:', JSON.stringify(resp.data, null, 2));
  } catch (err: any) {
    console.error('API Error:', err.message);
  }
}

testApi();
