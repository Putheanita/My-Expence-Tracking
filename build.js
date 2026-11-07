import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('[Build] Building frontend for Vercel...');
execSync('npm run build --workspace=frontend', { stdio: 'inherit' });

const publicDir = path.resolve('public');
const distDir = path.resolve('dist');

if (fs.existsSync(publicDir) && !fs.existsSync(distDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true });
}

console.log('[Build] Frontend build ready for Vercel!');
