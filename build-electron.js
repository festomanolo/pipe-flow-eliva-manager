
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build React app
console.log('Building React app...');
execSync('npm run build', { stdio: 'inherit' });

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
const electronDistDir = path.join(distDir, 'electron');
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(electronDistDir, { recursive: true });

// Copy electron files to dist folder
console.log('Setting up Electron files...');
fs.copyFileSync(
  path.join(__dirname, 'electron/main.js'),
  path.join(electronDistDir, 'main.js')
);
fs.copyFileSync(
  path.join(__dirname, 'electron/preload.js'),
  path.join(electronDistDir, 'preload.js')
);

// Copy package.json for Electron
const pkg = require('./package.json');
const electronConfig = require('./electron.config.js');

// Modify package.json for Electron
const electronPkg = {
  name: pkg.name || 'eliva-hardware-manager',
  version: pkg.version || '1.0.0',
  description: pkg.description || 'Eliva Hardware Manager',
  main: 'electron/main.js',
  author: pkg.author || 'Eliva',
  license: pkg.license || 'MIT',
  dependencies: {
    'better-sqlite3': pkg.dependencies['better-sqlite3'] || "^11.9.1",
    'electron-is-dev': pkg.dependencies['electron-is-dev'] || "^3.0.1"
  },
  build: electronConfig
};

// Write the modified package.json to dist folder
fs.writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(electronPkg, null, 2)
);

// Make sure package.json is properly created before building
if (fs.existsSync(path.join(distDir, 'package.json'))) {
  console.log('Package.json created in dist folder.');
  
  // Build Electron app
  console.log('Building Electron app...');
  execSync('npx electron-builder --config electron.config.js', { stdio: 'inherit' });
  console.log('Electron app built successfully!');
} else {
  console.error('Failed to create package.json in dist folder.');
  process.exit(1);
}
