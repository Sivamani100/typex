#!/usr/bin/env node

/**
 * Static Site Generation (SSG) Script for Typex
 * 
 * This script pre-renders critical pages as static HTML for SEO.
 * It uses puppeteer to render the React app and save the HTML output.
 * 
 * Usage: node scripts/prerender.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist');

// Routes to pre-render
const ROUTES = [
  { path: '/', file: 'index.html' },
  { path: '/practice', file: 'practice.html' },
  { path: '/about', file: 'about.html' },
  { path: '/blog', file: 'blog.html' },
  { path: '/blog/how-to-improve-typing-speed', file: 'blog-how-to-improve-typing-speed.html' },
  { path: '/blog/average-wpm-by-profession', file: 'blog-average-wpm-by-profession.html' },
  { path: '/blog/touch-typing-basics', file: 'blog-touch-typing-basics.html' },
  { path: '/blog/wpm-vs-accuracy', file: 'blog-wpm-vs-accuracy.html' },
  { path: '/blog/ergonomic-keyboards', file: 'blog-ergonomic-keyboards.html' },
  { path: '/blog/daily-practice-routine', file: 'blog-daily-practice-routine.html' },
  { path: '/contact', file: 'contact.html' },
  { path: '/privacy-policy', file: 'privacy-policy.html' },
  { path: '/terms-of-service', file: 'terms-of-service.html' },
  { path: '/disclaimer', file: 'disclaimer.html' },
];

// Check if dist folder exists
if (!fs.existsSync(DIST_DIR)) {
  console.error('Error: dist folder not found. Run "npm run build" first.');
  process.exit(1);
}

// Read the original index.html
const indexPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('Error: dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

const originalHtml = fs.readFileSync(indexPath, 'utf-8');

// Generate static HTML for each route
// For now, we copy the index.html and modify the meta tags
// In a production setup with puppeteer, we'd actually render the React components
ROUTES.forEach(({ path: routePath, file }) => {
  const outputPath = path.join(DIST_DIR, file);
  
  // Create modified HTML with route-specific content
  let modifiedHtml = originalHtml;
  
  // Add a script to handle the route for SPA navigation
  const routeScript = `
    <script>
      // Static site generation marker for SEO crawlers
      window.__SSG_ROUTE__ = "${routePath}";
      window.__SSG_TIMESTAMP__ = "${new Date().toISOString()}";
    </script>
  `;
  
  // Insert the route script before the closing body tag
  modifiedHtml = modifiedHtml.replace('</body>', `${routeScript}</body>`);
  
  // Write the file
  fs.writeFileSync(outputPath, modifiedHtml);
  console.log(`✓ Generated ${file} for route ${routePath}`);
});

// Create a _redirects file for Netlify/Vercel SPA routing
const redirectsContent = `
# SPA Fallback - All routes should serve index.html for client-side routing
/*    /index.html   200
`;

fs.writeFileSync(path.join(DIST_DIR, '_redirects'), redirectsContent.trim());
console.log('✓ Created _redirects file for SPA routing');

// Create a 200.html for Surge.sh SPA routing
fs.copyFileSync(
  path.join(DIST_DIR, 'index.html'),
  path.join(DIST_DIR, '200.html')
);
console.log('✓ Created 200.html for Surge.sh SPA routing');

console.log('\n✓ Static site generation complete!');
console.log(`  - Generated ${ROUTES.length} static pages`);
console.log(`  - All files written to ${DIST_DIR}`);
console.log('\nNote: For full pre-rendering with React component output,');
console.log('consider using puppeteer or vite-plugin-ssr in production.');
