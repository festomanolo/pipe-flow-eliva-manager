
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build React app
console.log('Building React app...');
execSync('npm run build', { stdio: 'inherit' });

// Copy electron files to dist folder
console.log('Setting up Electron files...');
fs.mkdirSync(path.join(__dirname, 'dist/electron'), { recursive: true });
fs.copyFileSync(
  path.join(__dirname, 'electron/main.js'),
  path.join(__dirname, 'dist/electron/main.js')
);
fs.copyFileSync(
  path.join(__dirname, 'electron/preload.js'),
  path.join(__dirname, 'dist/electron/preload.js')
);

// Copy package.json for Electron
const pkg = require('./package.json');
const electronConfig = require('./electron.config.js');

// Modify package.json for Electron
const electronPkg = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description || 'Eliva Hardware Manager',
  main: 'electron/main.js',
  author: pkg.author || 'Eliva',
  license: pkg.license || 'MIT',
  dependencies: {
    'better-sqlite3': pkg.dependencies['better-sqlite3'],
    'electron-is-dev': pkg.dependencies['electron-is-dev']
  },
  build: electronConfig
};

fs.writeFileSync(
  path.join(__dirname, 'dist/package.json'),
  JSON.stringify(electronPkg, null, 2)
);

// Build Electron app
console.log('Building Electron app...');
execSync('npx electron-builder --config electron.config.js', { stdio: 'inherit' });

console.log('Electron app built successfully!');
