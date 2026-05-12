import axios from 'axios';

async function testAPIWithoutCache() {
  try {
    console.log('Testing /api/roadmaps endpoint with cache bypass...');
    
    // Test with a timestamp to bypass cache
    const timestamp = Date.now();
    const response = await axios.get(`http://localhost:3000/api/roadmaps?t=${timestamp}`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Full response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error testing API:', (error as any).response?.data || (error as Error).message);
  }
}

testAPIWithoutCache();
