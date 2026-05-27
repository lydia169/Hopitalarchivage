#!/usr/bin/env node
const { spawn } = require('child_process');
const vite = spawn('npx', ['vite', '--host', '--port', '5173'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});
vite.on('close', (code) => {
  console.log(`Vite exited with code ${code}`);
});