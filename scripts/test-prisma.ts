import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPrismaConnection() {
  try {
    console.log('Testing Prisma connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Prisma connected successfully');
    
    // Test count query
    const roadmapCount = await prisma.roadmap.count();
    console.log(`✅ Total roadmaps in database: ${roadmapCount}`);
    
    // Test findMany with simple query
    const simpleRoadmaps = await prisma.roadmap.findMany({
      take: 3,
      select: {
        id: true,
        roadmapId: true,
        title: true,
        type: true,
        difficulty: true,
        isPublished: true,
      }
    });
    
    console.log('✅ First 3 roadmaps:');
    simpleRoadmaps.forEach((roadmap, index) => {
      console.log(`${index + 1}. ${roadmap.title} (${roadmap.type}) - published: ${roadmap.isPublished}`);
    });
    
    // Test the exact query from API
    const apiRoadmaps = await prisma.roadmap.findMany({
      where: {
        isPublished: true,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            nodes: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      skip: 0,
      take: 20,
    });
    
    console.log(`✅ API query result: ${apiRoadmaps.length} roadmaps found`);
    apiRoadmaps.forEach((roadmap, index) => {
      console.log(`${index + 1}. ${roadmap.title} (${roadmap.type}) - published: ${roadmap.isPublished}`);
    });
    
  } catch (error) {
    console.error('❌ Prisma error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();
