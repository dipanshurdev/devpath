import axios from 'axios';

async function testFrontendDataStructure() {
  try {
    console.log('Testing frontend data structure...');
    
    // Simulate the exact same call as useRoadmaps hook
    const { data } = await axios.get('http://localhost:3000/api/roadmaps');
    
    console.log('API Response structure:');
    console.log('- success:', data.success);
    console.log('- data type:', typeof data.data);
    console.log('- data.data type:', typeof data.data?.data);
    console.log('- data.data length:', data.data?.data?.length);
    
    if (data.success && data.data?.data) {
      console.log('\n✅ Frontend data structure is correct!');
      console.log('Roadmaps available:', data.data.data.length);
      
      // Test filtering like RoleBased component does
      const roleBasedRoadmaps = data.data.data.filter((roadmap: any) => roadmap.type === 'role');
      console.log('Role-based roadmaps found:', roleBasedRoadmaps.length);
      
      console.log('\nRole-based roadmaps:');
      roleBasedRoadmaps.forEach((roadmap: any, index: number) => {
        console.log(`${index + 1}. ${roadmap.title} (${roadmap.type}) - ${roadmap.difficulty}`);
      });
      
      // Test the exact data structure the frontend expects
      console.log('\nFirst roadmap structure:');
      console.log(JSON.stringify(data.data.data[0], null, 2));
      
    } else {
      console.log('❌ Frontend data structure is incorrect');
      console.log('Full response:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('Error testing frontend data:', (error as any).response?.data || (error as Error).message);
  }
}

testFrontendDataStructure();
