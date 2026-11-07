import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('[Build] Building frontend with Vite...');
execSync('npm run build --workspace=frontend', { stdio: 'inherit' });

const srcDir = path.resolve('frontend/dist');
const targets = [path.resolve('public'), path.resolve('dist')];

for (const target of targets) {
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, target, { recursive: true });
    console.log(`[Build] Copied build files to: ${target}`);
  }
}
console.log('[Build] Done! Build output ready for Vercel.');
