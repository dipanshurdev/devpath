import { withErrorHandler, createApiResponse } from '@/lib/api-handler';
import { NextRequest } from 'next/server';

// Test the API handler directly
export const GET = withErrorHandler(async (request: NextRequest) => {
  console.log('🔍 Testing API handler directly...');
  
  try {
    // Simulate the exact same logic as the roadmaps API
    const responseData = { 
      data: [
        { id: 'test', title: 'Test Roadmap', type: 'role' }
      ], 
      pagination: { page: 1, pageSize: 20, total: 1 }
    };

    console.log('📤 Response data to be sent:', responseData);

    const response = createApiResponse({
      ...responseData,
      fromCache: false,
    });

    console.log('📤 Final response object:', response);
    return response;
    
  } catch (error) {
    console.error('❌ Error in test handler:', error);
    throw error;
  }
});
