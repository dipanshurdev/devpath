/**
 * Idempotent Database Seed Script
 * 
 * This script can be run multiple times safely without creating duplicates
 * or causing data inconsistencies. It uses upsert operations and proper cleanup.
 * 
 * Usage: npm run db:seed
 */

import { PrismaClient, Difficulty, RoadmapType, NodeType, ResourceType, RoadmapStatus, UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma/client';
import bcrypt from 'bcryptjs';

// Seed configuration
const SEED_CONFIG = {
  ADMIN_USER: {
    email: 'admin@devpath.com',
    username: 'admin',
    name: 'Admin User',
    password: 'admin123!', // Change in production
    role: 'SUPER_ADMIN',
  },
  SAMPLE_USER: {
    email: 'user@devpath.com',
    username: 'demo',
    name: 'Demo User',
    password: 'demo123!', // Change in production
    role: 'USER',
  },
};

// Sample roadmap data
const SAMPLE_ROADMAP = {
  roadmapId: 'fullstack-developer',
  slug: 'fullstack-developer',
  title: 'Full Stack Developer',
  description: 'Complete roadmap to become a full stack developer',
  summary: 'Learn frontend, backend, and deployment technologies to build modern web applications',
  difficulty: Difficulty.Intermediate,
  estimatedTime: '6-12 months',
  type: RoadmapType.role,
  category: 'Web Development',
  tags: ['web development', 'full stack', 'javascript'],
  keywords: ['react', 'node', 'database', 'api'],
  icon: '🚀',
  color: '#3B82F6',
  prerequisites: [],
  status: RoadmapStatus.PUBLISHED,
  isPublished: true,
  isOfficial: true,
  isFeatured: true,
  seoTitle: 'Full Stack Developer Roadmap - DevPath',
  seoDescription: 'Complete learning path to become a full stack developer with modern technologies',
};

// Sample nodes
const SAMPLE_NODES = [
  {
    nodeId: 'frontend-basics',
    title: 'Frontend Basics',
    description: 'Learn HTML, CSS, and JavaScript fundamentals',
    type: NodeType.checkpoint,
    order: 0,
    prerequisiteIds: [],
  },
  {
    nodeId: 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'Master React.js and modern frontend development',
    type: NodeType.checkpoint,
    order: 1,
    prerequisiteIds: ['frontend-basics'],
  },
  {
    nodeId: 'backend-basics',
    title: 'Backend Basics',
    description: 'Learn Node.js, Express, and API development',
    type: NodeType.checkpoint,
    order: 2,
    prerequisiteIds: [],
  },
];

// Sample resources
const SAMPLE_RESOURCES = [
  {
    title: 'MDN Web Docs',
    description: 'Comprehensive web development documentation',
    url: 'https://developer.mozilla.org',
    type: ResourceType.documentation,
    difficulty: Difficulty.Beginner,
    order: 0,
    nodeId: 'frontend-basics',
    isVerified: true,
  },
  {
    title: 'JavaScript.info',
    description: 'Modern JavaScript tutorial',
    url: 'https://javascript.info',
    type: ResourceType.tutorial,
    difficulty: Difficulty.Beginner,
    order: 1,
    nodeId: 'frontend-basics',
    isVerified: true,
  },
  {
    title: 'React Official Docs',
    description: 'Official React documentation',
    url: 'https://react.dev',
    type: ResourceType.documentation,
    difficulty: Difficulty.Intermediate,
    order: 0,
    nodeId: 'react-fundamentals',
    isVerified: true,
  },
  {
    title: 'Node.js Documentation',
    description: 'Official Node.js docs',
    url: 'https://nodejs.org/docs',
    type: ResourceType.documentation,
    difficulty: Difficulty.Intermediate,
    order: 0,
    nodeId: 'backend-basics',
    isVerified: true,
  },
];

/**
 * Clean up existing sample data (for fresh starts)
 */
async function cleanupSampleData() {
  console.log('🧹 Cleaning up existing sample data...');
  
  try {
    // Delete in specific order to respect foreign key constraints
    await prisma.resource.deleteMany({
      where: {
        node: {
          roadmap: {
            roadmapId: { in: [SAMPLE_ROADMAP.roadmapId] },
          },
        },
      },
    });

    await prisma.node.deleteMany({
      where: {
        roadmapId: { in: [SAMPLE_ROADMAP.roadmapId] },
      },
    });

    await prisma.roadmap.deleteMany({
      where: { roadmapId: { in: [SAMPLE_ROADMAP.roadmapId] } },
    });

    console.log('   ✅ Sample data cleaned up');
  } catch (error) {
    console.error('   ⚠️ Error cleaning up sample data:', error);
    throw error;
  }
}

/**
 * Seed users with idempotent upsert
 */
async function seedUsers() {
  console.log('👥 Seeding users...');

  try {
    // Seed admin user
    const adminPasswordHash = await bcrypt.hash(SEED_CONFIG.ADMIN_USER.password, 10);
    await prisma.user.upsert({
      where: { email: SEED_CONFIG.ADMIN_USER.email },
      update: {
        name: SEED_CONFIG.ADMIN_USER.name,
        username: SEED_CONFIG.ADMIN_USER.username,
        password: adminPasswordHash,
        role: SEED_CONFIG.ADMIN_USER.role as UserRole,
        emailVerified: new Date(),
        updatedAt: new Date(),
      },
      create: {
        email: SEED_CONFIG.ADMIN_USER.email,
        name: SEED_CONFIG.ADMIN_USER.name,
        username: SEED_CONFIG.ADMIN_USER.username,
        password: adminPasswordHash,
        role: SEED_CONFIG.ADMIN_USER.role as UserRole,
        emailVerified: new Date(),
      },
    });

    // Seed demo user
    const demoPasswordHash = await bcrypt.hash(SEED_CONFIG.SAMPLE_USER.password, 10);
    await prisma.user.upsert({
      where: { email: SEED_CONFIG.SAMPLE_USER.email },
      update: {
        name: SEED_CONFIG.SAMPLE_USER.name,
        username: SEED_CONFIG.SAMPLE_USER.username,
        password: demoPasswordHash,
        role: SEED_CONFIG.SAMPLE_USER.role as UserRole,
        emailVerified: new Date(),
        updatedAt: new Date(),
      },
      create: {
        email: SEED_CONFIG.SAMPLE_USER.email,
        name: SEED_CONFIG.SAMPLE_USER.name,
        username: SEED_CONFIG.SAMPLE_USER.username,
        password: demoPasswordHash,
        role: SEED_CONFIG.SAMPLE_USER.role as UserRole,
        emailVerified: new Date(),
      },
    });

    // Create FREE subscriptions for all users
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: [SEED_CONFIG.ADMIN_USER.email, SEED_CONFIG.SAMPLE_USER.email],
        },
      },
    });

    for (const user of users) {
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          tier: 'FREE',
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          updatedAt: new Date(),
        },
        create: {
          userId: user.id,
          tier: 'FREE',
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
        },
      });
    }

    console.log(`   ✅ Created ${users.length} users with subscriptions`);
  } catch (error) {
    console.error('   ❌ Error seeding users:', error);
    throw error;
  }
}

/**
 * Seed roadmap with idempotent upsert
 */
async function seedRoadmap() {
  console.log('📍 Seeding sample roadmap...');

  try {
    const roadmap = await prisma.roadmap.upsert({
      where: { roadmapId: SAMPLE_ROADMAP.roadmapId },
      update: {
        ...SAMPLE_ROADMAP,
        updatedAt: new Date(),
      },
      create: {
        ...SAMPLE_ROADMAP,
        creatorId: (await prisma.user.findUnique({ 
          where: { email: SEED_CONFIG.ADMIN_USER.email },
          select: { id: true }
        }))?.id,
      },
    });

    console.log(`   ✅ Roadmap created: ${roadmap.title}`);
    return roadmap;
  } catch (error) {
    console.error('   ❌ Error seeding roadmap:', error);
    throw error;
  }
}

/**
 * Seed nodes with idempotent upsert
 */
async function seedNodes(roadmapId: string) {
  console.log('📦 Seeding nodes...');

  try {
    for (const nodeData of SAMPLE_NODES) {
      await prisma.node.upsert({
        where: { nodeId: nodeData.nodeId },
        update: {
          ...nodeData,
          roadmapId,
          updatedAt: new Date(),
        },
        create: {
          ...nodeData,
          roadmapId,
        },
      });
    }

    console.log(`   ✅ Created ${SAMPLE_NODES.length} nodes`);
  } catch (error) {
    console.error('   ❌ Error seeding nodes:', error);
    throw error;
  }
}

/**
 * Seed resources with idempotent create (skip on duplicate)
 */
async function seedResources() {
  console.log('📚 Seeding resources...');

  try {
    let createdCount = 0;
    let skippedCount = 0;

    for (const resourceData of SAMPLE_RESOURCES) {
      try {
        const node = await prisma.node.findUnique({
          where: { nodeId: resourceData.nodeId },
          select: { id: true }
        });
        
        if (!node) {
          console.log(`   ⚠️ Node not found for resource: ${resourceData.title}`);
          continue;
        }
        
        await prisma.resource.create({
          data: {
            ...resourceData,
            nodeId: node.id,
          },
        });
        createdCount++;
      } catch (error: any) {
        if (error.message?.includes('duplicate key') || error.code === 'P2002') {
          skippedCount++;
          console.log(`   ⏭️ Skipping duplicate resource: ${resourceData.title}`);
        } else {
          throw error;
        }
      }
    }

    console.log(`   ✅ Created ${createdCount} resources, skipped ${skippedCount} duplicates`);
  } catch (error) {
    console.error('   ❌ Error seeding resources:', error);
    throw error;
  }
}

/**
 * Main seeding function
 */
async function seedDatabase(clean: boolean = false) {
  console.log('🚀 Starting idempotent database seeding...\n');

  try {
    // Clean up existing sample data if requested
    if (clean) {
      await cleanupSampleData();
      console.log('');
    }

    // Seed in order to respect foreign key constraints
    await seedUsers();
    const roadmap = await seedRoadmap();
    await seedNodes(roadmap.id);
    await seedResources();

    // Get final statistics
    const stats = await Promise.all([
      prisma.roadmap.count(),
      prisma.node.count(),
      prisma.resource.count(),
      prisma.user.count(),
      prisma.subscription.count(),
    ]);

    console.log('\n✅ Seeding completed successfully!\n');
    console.log('📊 Database Summary:');
    console.log(`   Users: ${stats[3]}`);
    console.log(`   Subscriptions: ${stats[4]}`);
    console.log(`   Roadmaps: ${stats[0]}`);
    console.log(`   Nodes: ${stats[1]}`);
    console.log(`   Resources: ${stats[2]}`);
    console.log('\n🎉 Your database is ready!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: npx prisma studio (to view your data)');
    console.log('2. Start your app: npm run dev');
    console.log('3. Register at: http://localhost:3000/register');
    console.log('4. Login with demo user: user@devpath.com / demo123!');
    console.log('5. Access admin dashboard: http://localhost:3000/admin');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI argument handling
const args = process.argv.slice(2);
const shouldClean = args.includes('--clean') || args.includes('-c');

// Run seeding
if (require.main === module) {
  seedDatabase(shouldClean);
}

export { seedDatabase, SEED_CONFIG };
