
const path = require('path');
const { app } = require('electron');

// Set app paths
process.env.DIST = path.join(__dirname, 'dist');
process.env.VITE_PUBLIC = app.isPackaged 
  ? process.env.DIST 
  : path.join(process.env.DIST, '../public');

// Import main.js
require('./electron/main');
