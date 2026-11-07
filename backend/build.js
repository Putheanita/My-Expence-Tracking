import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const distDir = path.resolve('dist');

for (const dir of [publicDir, distDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const html = `<!DOCTYPE html>
<html>
<head><title>Expense Tracker Backend API</title></head>
<body style="font-family:sans-serif;text-align:center;padding:50px;">
  <h2>Expense Tracker API is Live</h2>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

console.log('[Backend Build] Backend build complete. Directories (public, dist) ready.');
