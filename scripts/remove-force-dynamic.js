#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files that should keep force-dynamic (API routes and server-side pages with dynamic data)
const KEEP_DYNAMIC = [
  'api/',
  'webhooks/',
  'upload/',
  'verify-email',
  'signup',
  'sign-out',
  'complete-profile',
  'verify-email-new',
  'video-call',
  'video-chat',
  'messages',
  'conversations',
  'employment',
  'profile',
  'writers',
  'social',
  'search',
  'orders',
  'gigs',
  'forgot-password',
  'launch-page',
  'packages',
  'success',
  'research',
  'meeting',
  'messenger',
  'update-work',
  'blog',
  'certification',
  'certifications',
  'scratch-cards',
  'dealoforge/create-course',
  'dealoforge/dashboard',
  'marketplace/product-details',
  'marketplace/shop',
  'marketplace/edit-work',
  'marketplace/create-work',
  'employment/jobs',
  'employment/show',
  'employment/new-company',
  'employment/new-listing',
  'employment/create-company',
  'employment/search',
  'employment/dealojobs',
  'employment/bulk-hiring',
  'video-chat/personal-room',
  'video-chat/upcoming',
  'video-chat/recordings',
  'video-chat/previous',
  'writers/dashboard',
  'writers/create-blog',
  'writers/verify-email',
  'writers/login',
  'writers/signup',
  'dealoforge/dashboard/upgrade',
  'dealoforge/dashboard/logout',
  'dealoforge/dashboard/explore',
  'dealoforge/dashboard/metrics',
  'dealoforge/create-course/chapter',
  'dealoforge/create-course',
  'certification/assessment',
  'certifications/explore',
  'certifications/my-certifications',
  'conversations/layout',
  'blog',
  'meeting',
  'messenger',
  'update-work',
  'dealoforge/dashboard/metrics'
];

// Files that are definitely client-side and should not have force-dynamic
const CLIENT_SIDE_PAGES = [
  'page.tsx',
  'layout.tsx'
];

function shouldKeepDynamic(filePath) {
  return KEEP_DYNAMIC.some(pattern => filePath.includes(pattern));
}

function isClientSidePage(filePath) {
  return CLIENT_SIDE_PAGES.some(pattern => filePath.endsWith(pattern));
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if it's an API route or should keep dynamic
    if (shouldKeepDynamic(filePath)) {
      console.log(`⏭️  Skipping ${filePath} (should keep dynamic)`);
      return;
    }
    
    // Check if it's a client-side page
    const isClientSide = content.includes('"use client"') || isClientSidePage(filePath);
    
    if (isClientSide && content.includes('export const dynamic = "force-dynamic"')) {
      // Remove the force-dynamic line
      const newContent = content
        .replace(/\/\/ Force dynamic rendering to prevent static generation issues\s*\n\s*export const dynamic = "force-dynamic";\s*\n?/g, '')
        .replace(/export const dynamic = "force-dynamic";\s*\n?/g, '');
      
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent);
        console.log(`✅ Removed force-dynamic from ${filePath}`);
      }
    } else if (content.includes('export const dynamic = "force-dynamic"')) {
      console.log(`⚠️  ${filePath} has force-dynamic but might need it - manual review needed`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

console.log('🚀 Starting force-dynamic removal process...\n');

// Start from the app directory
const appDir = path.join(__dirname, '..', 'app');
walkDirectory(appDir);

console.log('\n✅ Force-dynamic removal process completed!');
console.log('\n📋 Next steps:');
console.log('1. Run npm run build to test the changes');
console.log('2. Check for any build errors');
console.log('3. Test critical pages manually');

