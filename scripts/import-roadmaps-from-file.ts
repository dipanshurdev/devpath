import { PrismaClient, RoadmapType, Difficulty, RoadmapStatus, NodeType, ResourceType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper function to normalize difficulty
function normalizeDifficulty(difficulty: string): Difficulty {
  const normalized = difficulty?.toLowerCase().trim();
  switch (normalized) {
    case 'beginner':
    case 'easy':
      return Difficulty.Beginner;
    case 'intermediate':
    case 'medium':
      return Difficulty.Intermediate;
    case 'advanced':
    case 'hard':
      return Difficulty.Advanced;
    default:
      return Difficulty.Intermediate;
  }
}

// Helper function to normalize resource type
function normalizeResourceType(type: string): ResourceType {
  const normalized = type?.toLowerCase().trim();
  switch (normalized) {
    case 'article':
      return ResourceType.article;
    case 'documentation':
    case 'docs':
      return ResourceType.documentation;
    case 'video':
      return ResourceType.video;
    case 'tutorial':
      return ResourceType.tutorial;
    case 'course':
      return ResourceType.course;
    case 'book':
      return ResourceType.book;
    case 'tool':
      return ResourceType.tool;
    case 'podcast':
      return ResourceType.podcast;
    case 'github':
      return ResourceType.github;
    case 'interactive':
    case 'game':
      return ResourceType.interactive;
    case 'cheatsheet':
      return ResourceType.cheatsheet;
    case 'exercise':
      return ResourceType.exercise;
    default:
      return ResourceType.documentation;
  }
}

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to extract roadmap type
function extractRoadmapType(title: string, type?: string): RoadmapType {
  const titleLower = title.toLowerCase();
  const typeLower = type?.toLowerCase();

  if (titleLower.includes('frontend') || titleLower.includes('backend') || titleLower.includes('fullstack') || titleLower.includes('devops')) {
    return RoadmapType.role;
  }
  if (titleLower.includes('react') || titleLower.includes('vue') || titleLower.includes('angular') || titleLower.includes('node')) {
    return RoadmapType.skill;
  }
  if (typeLower === 'role') return RoadmapType.role;
  if (typeLower === 'skill') return RoadmapType.skill;
  if (typeLower === 'project') return RoadmapType.project;
  
  return RoadmapType.role; // default
}

// Parse the roadmaps file
function parseRoadmapsFile(filePath: string): any[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Split by separator lines (looking for lines with only dashes, with optional blank lines)
    // This matches: newline + optional blank lines + dashes + optional blank lines + newline
    const sections = content.split(/\n\s*\n-{30,}\n\s*\n/);
    
    const roadmaps: any[] = [];
    
    for (const section of sections) {
      const trimmedSection = section.trim();
      if (!trimmedSection) continue;
      
      try {
        // Look for pattern "Name:{" or "Name: {" at the start, OR just "{"
        const lines = trimmedSection.split('\n');
        let jsonStartLine = -1;
        
        // Find the line that starts the JSON
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          // Check for "Name: {" or "Name:{" pattern
          if (line.match(/^[A-Z][a-zA-Z\s]*:\s*\{/)) {
            jsonStartLine = i;
            break;
          }
          // Check for just "{" at the start (for roadmaps without header)
          if (line === '{') {
            jsonStartLine = i;
            break;
          }
        }
        
        if (jsonStartLine === -1) continue;
        
        // Extract everything from the "{" onwards
        const firstLine = lines[jsonStartLine];
        const jsonStart = firstLine.indexOf('{');
        
        // Combine from the opening brace onwards
        let jsonContent = firstLine.substring(jsonStart);
        for (let i = jsonStartLine + 1; i < lines.length; i++) {
          jsonContent += '\n' + lines[i];
        }
        
        // Find the matching closing brace by counting braces
        let braceCount = 0;
        let endIndex = -1;
        
        for (let i = 0; i < jsonContent.length; i++) {
          if (jsonContent[i] === '{') braceCount++;
          if (jsonContent[i] === '}') braceCount--;
          
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
        
        if (endIndex > 0) {
          jsonContent = jsonContent.substring(0, endIndex);
        }
        
        // Parse the JSON
        const roadmapData = JSON.parse(jsonContent);
        
        // Only include if it has essential data
        if (roadmapData.roadmap_id && roadmapData.title) {
          console.log(`   ✓ Parsed: ${roadmapData.title}`);
          roadmaps.push(roadmapData);
        }
      } catch (parseError: any) {
        // Silently skip invalid sections
        continue;
      }
    }
    
    return roadmaps;
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
}

// Transform and clean roadmap data
function transformRoadmapData(rawRoadmap: any) {
  const roadmapId = rawRoadmap.roadmap_id || generateSlug(rawRoadmap.title);
  const slug = generateSlug(rawRoadmap.title);
  
  return {
    roadmapId,
    slug,
    title: rawRoadmap.title?.trim() || 'Untitled Roadmap',
    description: rawRoadmap.description?.trim() || '',
    summary: rawRoadmap.description?.trim().substring(0, 200),
    type: extractRoadmapType(rawRoadmap.title, rawRoadmap.type),
    difficulty: normalizeDifficulty(rawRoadmap.difficulty || 'Intermediate'),
    estimatedTime: rawRoadmap.estimated_time_to_finish || '3-6 months',
    prerequisites: [],
    tags: [],
    status: RoadmapStatus.PUBLISHED,
    isOfficial: true,
    isFeatured: false,
    isPublished: true,
    inConstruction: rawRoadmap.inConstruction || false,
    keywords: [],
    viewCount: 0,
    likeCount: 0,
    bookmarkCount: 0,
    completionCount: 0,
    order: 0,
    priority: 0,
  };
}

// Transform node data
function transformNodeData(rawNode: any, index: number) {
  const nodeId = rawNode.nodeId || `node_${Date.now()}_${index}`;
  
  return {
    nodeId,
    title: rawNode.title?.trim() || 'Untitled Node',
    description: rawNode.description?.trim() || '',
    content: rawNode.description?.trim() || '',
    type: NodeType.checkpoint,
    order: index,
    level: 1,
    prerequisiteIds: [],
    estimatedTime: '1-2 weeks',
    difficulty: rawNode.difficulty ? normalizeDifficulty(rawNode.difficulty) : undefined,
    isOptional: false,
    isLocked: false,
    completionCount: 0,
  };
}

// Transform resource data
function transformResourceData(rawResource: any, index: number) {
  return {
    title: rawResource.title?.trim() || 'Untitled Resource',
    description: rawResource.description?.trim() || rawResource.title?.trim() || '',
    url: rawResource.url?.trim() || '',
    type: normalizeResourceType(rawResource.type || rawResource.tag || 'article'),
    difficulty: rawResource.difficulty ? normalizeDifficulty(rawResource.difficulty) : undefined,
    duration: rawResource.estimatedTime || '30 minutes',
    order: index,
    isVerified: true,
    isPremium: false,
    viewCount: 0,
    clickCount: 0,
    rating: 0,
  };
}

async function importRoadmaps() {
  console.log('🚀 Starting roadmap import...\n');
  
  // Check project root first, then Downloads folder
  const projectRootPath = path.join(__dirname, '..', 'roadmaps.txt');
  const downloadsPath = path.join(__dirname, '..', '..', 'Downloads', 'roadmaps.txt');
  
  let filePath = projectRootPath;
  
  if (!fs.existsSync(projectRootPath)) {
    if (fs.existsSync(downloadsPath)) {
      filePath = downloadsPath;
    } else {
      console.error('❌ File not found in either location:');
      console.error('   - Project root:', projectRootPath);
      console.error('   - Downloads:', downloadsPath);
      console.log('💡 Please ensure roadmaps.txt is in your project root or Downloads folder');
      return;
    }
  }
  
  console.log('📁 Using file:', filePath);
  
  console.log('📖 Reading roadmaps file...');
  const rawRoadmaps = parseRoadmapsFile(filePath);
  
  if (rawRoadmaps.length === 0) {
    console.error('❌ No roadmaps found in file');
    return;
  }
  
  console.log(`✅ Found ${rawRoadmaps.length} roadmaps\n`);
  
  let importedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const rawRoadmap of rawRoadmaps) {
    try {
      console.log(`\n📍 Processing: ${rawRoadmap.title}`);
      
      // Check if roadmap already exists
      const existingRoadmap = await prisma.roadmap.findUnique({
        where: { roadmapId: rawRoadmap.roadmap_id },
      });
      
      if (existingRoadmap) {
        console.log(`   ⏭️  Skipped (already exists)`);
        skippedCount++;
        continue;
      }
      
      // Transform roadmap data
      const roadmapData = transformRoadmapData(rawRoadmap);
      
      // Create roadmap
      const roadmap = await prisma.roadmap.create({
        data: roadmapData,
      });
      
      console.log(`   ✅ Created roadmap: ${roadmap.title}`);
      
      // Process nodes
      if (rawRoadmap.nodes && Array.isArray(rawRoadmap.nodes) && rawRoadmap.nodes.length > 0) {
        console.log(`   📦 Processing ${rawRoadmap.nodes.length} nodes...`);
        
        for (let i = 0; i < rawRoadmap.nodes.length; i++) {
          const rawNode = rawRoadmap.nodes[i];
          
          try {
            // Transform node data
            const nodeData = transformNodeData(rawNode, i);
            
            // Create node
            const node = await prisma.node.create({
              data: {
                ...nodeData,
                roadmapId: roadmap.id,
              },
            });
            
            // Process resources
            if (rawNode.resources && Array.isArray(rawNode.resources)) {
              console.log(`      📚 Adding ${rawNode.resources.length} resources to "${node.title}"...`);
              
              for (let j = 0; j < rawNode.resources.length; j++) {
                const rawResource = rawNode.resources[j];
                
                try {
                  // Skip if no URL
                  if (!rawResource.url) {
                    console.log(`         ⏭️  Skipped resource (no URL): ${rawResource.title}`);
                    continue;
                  }
                  
                  // Transform resource data
                  const resourceData = transformResourceData(rawResource, j);
                  
                  // Create resource
                  await prisma.resource.create({
                    data: {
                      ...resourceData,
                      nodeId: node.id,
                    },
                  });
                } catch (resourceError: any) {
                  // Skip duplicate resources
                  if (!resourceError.message.includes('duplicate key')) {
                    console.error(`         ❌ Error creating resource: ${resourceError.message}`);
                  }
                }
              }
            }
            
            console.log(`      ✅ Created node: ${node.title}`);
          } catch (nodeError: any) {
            console.error(`      ❌ Error creating node: ${nodeError.message}`);
          }
        }
      } else {
        console.log(`   ⚠️  No nodes found for this roadmap`);
      }
      
      importedCount++;
      console.log(`   🎉 Successfully imported: ${roadmap.title}`);
      
    } catch (error: any) {
      console.error(`   ❌ Error importing roadmap: ${error.message}`);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Import Summary:');
  console.log('='.repeat(60));
  console.log(`✅ Successfully imported: ${importedCount} roadmaps`);
  console.log(`⏭️  Skipped (already exist): ${skippedCount} roadmaps`);
  console.log(`❌ Errors: ${errorCount} roadmaps`);
  console.log('='.repeat(60) + '\n');
}

// Main execution
async function main() {
  try {
    await importRoadmaps();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
