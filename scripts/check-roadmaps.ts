import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRoadmaps() {
  try {
    // Check all roadmaps
    const allRoadmaps = await prisma.roadmap.findMany({
      select: {
        id: true,
        roadmapId: true,
        title: true,
        type: true,
        difficulty: true,
        isPublished: true,
        isFeatured: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('=== All Roadmaps ===');
    console.log(`Total: ${allRoadmaps.length}`);
    allRoadmaps.forEach(roadmap => {
      console.log(`- ${roadmap.title} (${roadmap.type}) - ${roadmap.difficulty}`);
    });

    // Check role-based roadmaps specifically
    const roleRoadmaps = allRoadmaps.filter(r => r.type === 'role');
    console.log('\n=== Role-Based Roadmaps ===');
    console.log(`Total: ${roleRoadmaps.length}`);
    roleRoadmaps.forEach(roadmap => {
      console.log(`- ${roadmap.title}`);
    });

    // Check skill-based roadmaps
    const skillRoadmaps = allRoadmaps.filter(r => r.type === 'skill');
    console.log('\n=== Skill-Based Roadmaps ===');
    console.log(`Total: ${skillRoadmaps.length}`);
    skillRoadmaps.forEach(roadmap => {
      console.log(`- ${roadmap.title}`);
    });

    // Check project-based roadmaps
    const projectRoadmaps = allRoadmaps.filter(r => r.type === 'project');
    console.log('\n=== Project-Based Roadmaps ===');
    console.log(`Total: ${projectRoadmaps.length}`);
    projectRoadmaps.forEach(roadmap => {
      console.log(`- ${roadmap.title}`);
    });

  } catch (error) {
    console.error('Error checking roadmaps:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRoadmaps();
