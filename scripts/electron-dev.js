
const { spawn } = require('child_process');
const { platform } = require('os');
const waitOn = require('wait-on');
const path = require('path');

// Detect platform
const isWin = platform() === 'win32';

// Start Vite dev server
const viteProcess = spawn(
  isWin ? 'npm.cmd' : 'npm',
  ['run', 'dev'],
  { stdio: 'inherit', shell: true }
);

// Wait for Vite server to be available
waitOn({ resources: ['http-get://localhost:8080'], timeout: 30000 })
  .then(() => {
    // Once Vite is ready, start Electron
    const electronProcess = spawn(
      isWin ? 'npx.cmd' : 'npx',
      ['electron', '.'],
      { 
        stdio: 'inherit', 
        shell: true,
        env: {
          ...process.env,
          ELECTRON_START_URL: 'http://localhost:8080',
          NODE_ENV: 'development'
        }
      }
    );

    electronProcess.on('close', (code) => {
      // Kill Vite when Electron closes
      viteProcess.kill();
      process.exit(code);
    });
  })
  .catch((error) => {
    console.error('Error starting dev server:', error);
    viteProcess.kill();
    process.exit(1);
  });
