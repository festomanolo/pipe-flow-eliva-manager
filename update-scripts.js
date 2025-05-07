
// This script will be run to update package.json scripts without modifying it directly
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

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

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Package.json scripts updated for Electron integration');
