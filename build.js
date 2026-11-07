import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('[Build] Building frontend with Vite...');
execSync('npm run build --workspace=frontend', { stdio: 'inherit' });

const publicDir = path.resolve('public');
const distDir = path.resolve('dist');
const localDist = path.resolve('frontend/dist');

if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true, force: true });
  fs.cpSync(publicDir, localDist, { recursive: true, force: true });
}

console.log('[Build] Done! All output directories (public, dist, frontend/dist) ready for Vercel.');


