import axios from 'axios';

async function testRoadmapAPI() {
  try {
    console.log('Testing /api/roadmaps endpoint...');
    
    // Test without filters (should get all roadmaps)
    const response = await axios.get('http://localhost:3000/api/roadmaps');
    
    console.log('Response status:', response.status);
    console.log('Response data structure:');
    console.log('- success:', response.data.success);
    console.log('- data length:', response.data.data?.length);
    console.log('- fromCache:', response.data.fromCache);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('\nFirst roadmap:');
      console.log(JSON.stringify(response.data.data[0], null, 2));
      
      console.log('\nAll roadmaps with types:');
      response.data.data.forEach((roadmap: any, index: number) => {
        console.log(`${index + 1}. ${roadmap.title} - type: ${roadmap.type}, published: ${roadmap.isPublished}`);
      });
      
      // Filter for role-based roadmaps
      const roleRoadmaps = response.data.data.filter((r: any) => r.type === 'role');
      console.log(`\nRole-based roadmaps found: ${roleRoadmaps.length}`);
      roleRoadmaps.forEach((roadmap: any) => {
        console.log(`- ${roadmap.title}`);
      });
    } else {
      console.log('No roadmaps found in response');
    }
    
  } catch (error) {
    console.error('Error testing API:', (error as any).response?.data || (error as Error).message);
  }
}

// Only run if this is the main module
if (require.main === module) {
  testRoadmapAPI();
}
