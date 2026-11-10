import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('[Build] Building frontend for Vercel...');
execSync('npm run build --workspace=frontend', { stdio: 'inherit' });

const src = path.resolve('frontend/dist');
const targets = [
  path.resolve('public'),
  path.resolve('dist'),
  path.resolve('frontend/public'),
];

if (fs.existsSync(src)) {
  for (const target of targets) {
    try {
      fs.cpSync(src, target, { recursive: true, force: true });
    } catch (_) {}
  }
}

console.log('[Build] Frontend build ready in all output directories for Vercel!');
