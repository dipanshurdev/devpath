import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler, createApiResponse } from '@/lib/api-handler';

export const GET = withErrorHandler(async (_request: NextRequest) => {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  console.log('🔍 Testing API handler directly...');
  
  try {
    const responseData = { 
      data: [
        { id: 'test', title: 'Test Roadmap', type: 'role' }
      ], 
      pagination: { page: 1, pageSize: 20, total: 1 }
    };

    console.log('📤 Response data to be sent:', responseData);

    return createApiResponse({
      ...responseData,
      fromCache: false,
    });
    
  } catch (error) {
    console.error('❌ Error in test handler:', error);
    throw error;
  }
});
