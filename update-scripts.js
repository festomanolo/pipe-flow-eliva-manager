
// This script updates package.json scripts without modifying it directly
const fs = require('fs');
const path = require('path');

try {
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  // Check if package.json exists
  if (!fs.existsSync(packageJsonPath)) {
    console.error('package.json not found at: ' + packageJsonPath);
    process.exit(1);
  }
  
  // Read package.json
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);

  // Update scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    "start": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "electron": "electron .",
    "electron:dev": "concurrently \"npm run start\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "node build-electron.js",
    "postinstall": "electron-builder install-app-deps"
  };

  // Update main entry point for Electron
  packageJson.main = "electron/main.js";

  // Write updated package.json back
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log('Package.json scripts updated for Electron integration');
} catch (error) {
  console.error('Error updating package.json:', error);
  process.exit(1);
}
