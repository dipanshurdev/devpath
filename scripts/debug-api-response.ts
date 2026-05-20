import axios from 'axios';

async function debugAPIResponse() {
  try {
    console.log('Testing /api/roadmaps endpoint...');
    
    const response = await axios.get('http://localhost:3000/api/roadmaps');
    
    console.log('Full response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error testing API:', (error as any).response?.data || (error as Error).message);
  }
}

debugAPIResponse();
