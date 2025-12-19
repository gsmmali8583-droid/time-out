#!/usr/bin/env node

/**
 * Quick deployment script for free hosting
 * Run: node deploy.js [platform]
 * Platforms: vercel, netlify, surge
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const platform = process.argv[2] || 'vercel';

console.log('🚀 E-commerce Site Deployment Script');
console.log('=====================================');

function runCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Done!\n');
  } catch (error) {
    console.error(`❌ Error: ${description}`);
    console.error(error.message);
    process.exit(1);
  }
}

function checkBuild() {
  const buildPath = path.join(__dirname, 'client', 'build');
  if (!fs.existsSync(buildPath)) {
    console.log('🔨 Building production version...');
    runCommand('cd client && npm run build', 'Building React app');
  } else {
    console.log('✅ Build already exists');
  }
}

switch (platform.toLowerCase()) {
  case 'vercel':
    console.log('🔥 Deploying to Vercel...\n');

    // Check if Vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'pipe' });
    } catch {
      console.log('Installing Vercel CLI...');
      runCommand('npm install -g vercel', 'Installing Vercel CLI');
    }

    checkBuild();
    runCommand('vercel --prod', 'Deploying to Vercel');
    break;

  case 'netlify':
    console.log('🌐 Deploying to Netlify...\n');

    // Check if Netlify CLI is installed
    try {
      execSync('netlify --version', { stdio: 'pipe' });
    } catch {
      console.log('Installing Netlify CLI...');
      runCommand('npm install -g netlify-cli', 'Installing Netlify CLI');
    }

    checkBuild();
    runCommand('netlify deploy --prod --dir=client/build', 'Deploying to Netlify');
    break;

  case 'surge':
    console.log('📱 Deploying to Surge...\n');

    // Check if Surge is installed
    try {
      execSync('surge --version', { stdio: 'pipe' });
    } catch {
      console.log('Installing Surge...');
      runCommand('npm install -g surge', 'Installing Surge');
    }

    checkBuild();
    runCommand('cd client/build && surge', 'Deploying to Surge');
    break;

  case 'firebase':
    console.log('🔥 Deploying to Firebase...\n');

    // Check if Firebase CLI is installed
    try {
      execSync('firebase --version', { stdio: 'pipe' });
    } catch {
      console.log('Installing Firebase CLI...');
      runCommand('npm install -g firebase-tools', 'Installing Firebase CLI');
    }

    checkBuild();
    runCommand('firebase deploy', 'Deploying to Firebase');
    break;

  default:
    console.log('❌ Unknown platform. Available options:');
    console.log('   vercel (recommended)');
    console.log('   netlify');
    console.log('   surge');
    console.log('   firebase');
    console.log('\nUsage: node deploy.js [platform]');
    process.exit(1);
}

console.log('🎉 Deployment completed successfully!');
console.log('🌐 Your site should be live now!');
console.log('📖 Check DEPLOYMENT.md for more hosting options');
