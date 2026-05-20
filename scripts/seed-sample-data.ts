/**
 * Idempotent Database Seed Script
 *
 * Creates sample roadmaps, nodes, resources, and an admin user.
 * Safe to run multiple times — skips records that already exist.
 *
 * Run: npm run db:seed
 *
 * Requirements: 14.2, 14.3, 14.6
 */

import {
  PrismaClient,
  Difficulty,
  RoadmapType,
  NodeType,
  ResourceType,
  RoadmapStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Admin credentials from env (with safe defaults for dev) ─────────────────
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@devpath.dev";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123456";
const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME ?? "admin";

// ─── Seed data ────────────────────────────────────────────────────────────────

const ROADMAPS = [
  {
    roadmapId: "frontend-developer",
    slug: "frontend-developer",
    title: "Frontend Developer",
    description:
      "A comprehensive roadmap to become a modern frontend developer. Learn HTML, CSS, JavaScript, React, and more.",
    type: RoadmapType.role,
    difficulty: Difficulty.Intermediate,
    estimatedTime: "6-9 months",
    tags: ["frontend", "web", "javascript", "react"],
    nodes: [
      {
        nodeId: "frontend-html-css",
        title: "HTML & CSS Fundamentals",
        description: "Master the building blocks of the web.",
        type: NodeType.checkpoint,
        order: 0,
        resources: [
          {
            title: "MDN Web Docs — HTML",
            url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
            type: ResourceType.documentation,
            difficulty: Difficulty.Beginner,
          },
          {
            title: "CSS Tricks",
            url: "https://css-tricks.com",
            type: ResourceType.article,
            difficulty: Difficulty.Beginner,
          },
        ],
      },
      {
        nodeId: "frontend-javascript",
        title: "JavaScript Essentials",
        description: "Learn modern JavaScript (ES6+).",
        type: NodeType.checkpoint,
        order: 1,
        resources: [
          {
            title: "JavaScript.info",
            url: "https://javascript.info",
            type: ResourceType.tutorial,
            difficulty: Difficulty.Beginner,
          },
          {
            title: "Eloquent JavaScript",
            url: "https://eloquentjavascript.net",
            type: ResourceType.book,
            difficulty: Difficulty.Intermediate,
          },
        ],
      },
      {
        nodeId: "frontend-react",
        title: "React.js",
        description: "Build UIs with React.",
        type: NodeType.checkpoint,
        order: 2,
        resources: [
          {
            title: "React Official Docs",
            url: "https://react.dev",
            type: ResourceType.documentation,
            difficulty: Difficulty.Intermediate,
          },
          {
            title: "React Tutorial for Beginners",
            url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
            type: ResourceType.video,
            difficulty: Difficulty.Beginner,
          },
        ],
      },
      {
        nodeId: "frontend-typescript",
        title: "TypeScript",
        description: "Add type safety to your JavaScript.",
        type: NodeType.checkpoint,
        order: 3,
        resources: [
          {
            title: "TypeScript Handbook",
            url: "https://www.typescriptlang.org/docs/handbook/intro.html",
            type: ResourceType.documentation,
            difficulty: Difficulty.Intermediate,
          },
          {
            title: "Total TypeScript",
            url: "https://www.totaltypescript.com",
            type: ResourceType.course,
            difficulty: Difficulty.Intermediate,
          },
        ],
      },
      {
        nodeId: "frontend-nextjs",
        title: "Next.js",
        description: "Full-stack React framework.",
        type: NodeType.milestone,
        order: 4,
        resources: [
          {
            title: "Next.js Docs",
            url: "https://nextjs.org/docs",
            type: ResourceType.documentation,
            difficulty: Difficulty.Intermediate,
          },
          {
            title: "Next.js App Router Tutorial",
            url: "https://nextjs.org/learn",
            type: ResourceType.tutorial,
            difficulty: Difficulty.Intermediate,
          },
        ],
      },
    ],
  },
  {
    roadmapId: "backend-developer",
    slug: "backend-developer",
    title: "Backend Developer",
    description:
      "Learn server-side development with Node.js, databases, APIs, and cloud deployment.",
    type: RoadmapType.role,
    difficulty: Difficulty.Intermediate,
    estimatedTime: "6-12 months",
    tags: ["backend", "nodejs", "api", "database"],
    nodes: [
      {
        nodeId: "backend-nodejs",
        title: "Node.js Fundamentals",
        description: "Server-side JavaScript with Node.js.",
        type: NodeType.checkpoint,
        order: 0,
        resources: [
          {
            title: "Node.js Official Docs",
            url: "https://nodejs.org/en/docs",
            type: ResourceType.documentation,
            difficulty: Difficulty.Beginner,
          },
          {
            title: "Node.js Crash Course",
            url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
            type: ResourceType.video,
            difficulty: Difficulty.Beginner,
          },
        ],
      },
      {
        nodeId: "backend-express",
        title: "Express.js & REST APIs",
        description: "Build RESTful APIs with Express.",
        type: NodeType.checkpoint,
        order: 1,
        resources: [
          {
            title: "Express.js Guide",
            url: "https://expressjs.com/en/guide/routing.html",
            type: ResourceType.documentation,
            difficulty: Difficulty.Beginner,
          },
          {
            title: "REST API Design Best Practices",
            url: "https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples",
            type: ResourceType.article,
            difficulty: Difficulty.Intermediate,
          },
        ],
      },
      {
        nodeId: "backend-databases",
        title: "Databases (SQL & NoSQL)",
        description: "PostgreSQL, MongoDB, and database design.",
        type: NodeType.checkpoint,
        order: 2,
        resources: [
          {
            title: "PostgreSQL Tutorial",
            url: "https://www.postgresqltutorial.com",
            type: ResourceType.tutorial,
            difficulty: Difficulty.Intermediate,
          },
          {
            title: "MongoDB University",
            url: "https://learn.mongodb.com",
            type: ResourceType.course,
            difficulty: Difficulty.Beginner,
          },
        ],
      },
      {
        nodeId: "backend-auth",
        title: "Authentication & Security",
        description: "JWT, OAuth, and security best practices.",
        type: NodeType.checkpoint,
        order: 3,
        resources: [
          {
            title: "OWASP Top 10",
            url: "https://owasp.org/www-project-top-ten",
            type: ResourceType.documentation,
            difficulty: Difficulty.Intermediate,
          },
          {
            title: "JWT.io Introduction",
            url: "https://jwt.io/introduction",
            type: ResourceType.article,
            difficulty: Difficulty.Beginner,
          },
        ],
      },
      {
        nodeId: "backend-deployment",
        title: "Deployment & DevOps",
        description: "Docker, CI/CD, and cloud platforms.",
        type: NodeType.milestone,
        order: 4,
        resources: [
          {
            title: "Docker Getting Started",
            url: "https://docs.docker.com/get-started",
            type: ResourceType.documentation,
            difficulty: Difficulty.Intermediate,
          },
          {
            title: "Vercel Deployment Guide",
            url: "https://vercel.com/docs",
            type: ResourceType.documentation,
            difficulty: Difficulty.Beginner,
          },
        ],
      },
    ],
  },
  {
    roadmapId: "devops-engineer",
    slug: "devops-engineer",
    title: "DevOps Engineer",
    description:
      "Master CI/CD pipelines, containerization, infrastructure as code, and cloud platforms.",
    type: RoadmapType.role,
    difficulty: Difficulty.Advanced,
    estimatedTime: "9-12 months",
    tags: ["devops", "docker", "kubernetes", "cloud"],
    nodes: [
      {
        nodeId: "devops-linux",
        title: "Linux & Shell Scripting",
        description: "Command line mastery and bash scripting.",
        type: NodeType.checkpoint,
        order: 0,
        resources: [
          {
            title: "The Linux Command Line",
            url: "https://linuxcommand.org/tlcl.php",
            type: ResourceType.book,
            difficulty: Difficulty.Beginner,
          },
          {
            title: "Bash Scripting Tutorial",
            url: "https://www.shellscript.sh",
            type: ResourceType.tutorial,
            difficulty: Difficulty.Beginner,
          },
        ],
      },
      {
        nodeId: "devops-docker",
        title: "Docker & Containers",
        description: "Containerize applications with Docker.",
        type: NodeType.checkpoint,
        order: 1,
        resources: [
          {
            title: "Docker Official Docs",
            url: "https://docs.docker.com",
            type: ResourceType.documentation,
            difficulty: Difficulty.Intermediate,
          },
          {
            title: "Docker & Kubernetes: The Practical Guide",
            url: "https://www.udemy.com/course/docker-kubernetes-the-practical-guide",
            type: ResourceType.course,
            difficulty: Difficulty.Intermediate,
          },
        ],
      },
      {
        nodeId: "devops-kubernetes",
        title: "Kubernetes",
        description: "Container orchestration at scale.",
        type: NodeType.checkpoint,
        order: 2,
        resources: [
          {
            title: "Kubernetes Docs",
            url: "https://kubernetes.io/docs/home",
            type: ResourceType.documentation,
            difficulty: Difficulty.Advanced,
          },
          {
            title: "Kubernetes the Hard Way",
            url: "https://github.com/kelseyhightower/kubernetes-the-hard-way",
            type: ResourceType.github,
            difficulty: Difficulty.Advanced,
          },
        ],
      },
      {
        nodeId: "devops-cicd",
        title: "CI/CD Pipelines",
        description: "GitHub Actions, Jenkins, and automated deployments.",
        type: NodeType.checkpoint,
        order: 3,
        resources: [
          {
            title: "GitHub Actions Docs",
            url: "https://docs.github.com/en/actions",
            type: ResourceType.documentation,
            difficulty: Difficulty.Intermediate,
          },
          {
            title: "CI/CD Best Practices",
            url: "https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment",
            type: ResourceType.article,
            difficulty: Difficulty.Intermediate,
          },
        ],
      },
      {
        nodeId: "devops-cloud",
        title: "Cloud Platforms (AWS/GCP/Azure)",
        description: "Deploy and manage infrastructure in the cloud.",
        type: NodeType.milestone,
        order: 4,
        resources: [
          {
            title: "AWS Free Tier",
            url: "https://aws.amazon.com/free",
            type: ResourceType.documentation,
            difficulty: Difficulty.Intermediate,
          },
          {
            title: "Cloud Computing Fundamentals",
            url: "https://www.coursera.org/learn/cloud-computing",
            type: ResourceType.course,
            difficulty: Difficulty.Beginner,
          },
        ],
      },
    ],
  },
];

// ─── Main seed function ───────────────────────────────────────────────────────

async function seedDatabase() {
  console.log("🚀 Starting idempotent database seed...\n");

  // ── Admin user ──────────────────────────────────────────────────────────────
  console.log("👤 Seeding admin user...");
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existingAdmin) {
    console.log(`   ⏭  Admin already exists (${ADMIN_EMAIL}), skipping.`);
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const admin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        name: "Admin",
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });

    // Create FREE subscription for admin
    await prisma.subscription.create({
      data: {
        userId: admin.id,
        tier: "FREE",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
      },
    });

    console.log(`   ✅ Admin created: ${ADMIN_EMAIL}`);
  }

  // ── Roadmaps ────────────────────────────────────────────────────────────────
  for (const roadmapData of ROADMAPS) {
    const { nodes, ...roadmapFields } = roadmapData;

    // Check if roadmap already exists
    const existing = await prisma.roadmap.findUnique({
      where: { roadmapId: roadmapFields.roadmapId },
    });

    if (existing) {
      console.log(`   ⏭  Roadmap "${roadmapFields.title}" already exists, skipping.`);
      continue;
    }

    console.log(`\n📍 Creating roadmap: ${roadmapFields.title}`);

    const roadmap = await prisma.roadmap.create({
      data: {
        ...roadmapFields,
        status: RoadmapStatus.PUBLISHED,
        isPublished: true,
        isOfficial: true,
        publishedAt: new Date(),
        prerequisites: [],
        keywords: roadmapFields.tags,
      },
    });

    // ── Nodes ──────────────────────────────────────────────────────────────
    for (const nodeData of nodes) {
      const { resources, ...nodeFields } = nodeData;

      const existingNode = await prisma.node.findUnique({
        where: { nodeId: nodeFields.nodeId },
      });

      if (existingNode) {
        console.log(`   ⏭  Node "${nodeFields.title}" already exists, skipping.`);
        continue;
      }

      const node = await prisma.node.create({
        data: {
          ...nodeFields,
          roadmapId: roadmap.id,
          prerequisiteIds: [],
        },
      });

      // ── Resources ────────────────────────────────────────────────────────
      for (let i = 0; i < resources.length; i++) {
        const resourceData = resources[i];
        await prisma.resource.create({
          data: {
            ...resourceData,
            nodeId: node.id,
            order: i,
            isVerified: true,
          },
        });
      }

      console.log(
        `   ✅ Node "${nodeFields.title}" with ${resources.length} resources`
      );
    }

    console.log(`✅ Roadmap "${roadmapFields.title}" seeded.`);
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  const [roadmapCount, nodeCount, resourceCount, userCount] = await Promise.all([
    prisma.roadmap.count(),
    prisma.node.count(),
    prisma.resource.count(),
    prisma.user.count(),
  ]);

  console.log("\n📊 Database Summary:");
  console.log(`   Roadmaps : ${roadmapCount}`);
  console.log(`   Nodes    : ${nodeCount}`);
  console.log(`   Resources: ${resourceCount}`);
  console.log(`   Users    : ${userCount}`);
  console.log("\n🎉 Seed complete!");
  console.log("\n📝 Next steps:");
  console.log("   1. npm run dev");
  console.log(`   2. Login as admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log("   3. Visit /admin to manage roadmaps");
}

seedDatabase()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
