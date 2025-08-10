#!/usr/bin/env node
// scripts/npm-build-helper.js
// This script helps prepare the monorepo for npm-based builds on DigitalOcean

const fs = require('fs');
const path = require('path');

console.log('Preparing project for npm build...');

// Function to create a simplified package.json without workspace references
function simplifyPackageJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const pkg = JSON.parse(content);
    
    // Backup original
    fs.writeFileSync(filePath + '.yarn-backup', content);
    
    // Remove Yarn-specific fields
    delete pkg.packageManager;
    delete pkg.workspaces;
    
    // Convert workspace dependencies to file references
    if (pkg.dependencies) {
      Object.keys(pkg.dependencies).forEach(key => {
        if (pkg.dependencies[key] === '*' && key.startsWith('@open-swe/')) {
          // Convert workspace reference to relative path
          if (key === '@open-swe/shared') {
            pkg.dependencies[key] = 'file:../../packages/shared';
          }
        }
      });
    }
    
    // Write simplified version
    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2));
    console.log(`Simplified ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process main package.json
simplifyPackageJson('package.json');

// Process shared package
simplifyPackageJson('packages/shared/package.json');

// Process agent package
simplifyPackageJson('apps/open-swe/package.json');

// Create a minimal .npmrc to help with the build
const npmrcContent = `
legacy-peer-deps=true
force=true
strict-ssl=false
fetch-retries=5
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
`;

fs.writeFileSync('.npmrc', npmrcContent);
console.log('Created .npmrc with relaxed settings');

console.log('Project prepared for npm build!');
