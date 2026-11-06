import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbService } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DIST_DIR = path.join(__dirname, '..', 'frontend', 'dist');

// Serve static frontend assets if built
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// -----------------------------------------------------------------
// SQL TABLE API ROUTES
// -----------------------------------------------------------------

// 1. Expenses Table Routes
app.get('/api/expenses', (req, res) => {
  const expenses = dbService.getExpenses();
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const newExp = dbService.addExpense(req.body);
  res.status(201).json(newExp);
});

app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  dbService.deleteExpense(id);
  res.json({ success: true, id });
});

app.post('/api/expenses/reset', (req, res) => {
  dbService.resetAllExpenses();
  res.json({ success: true, message: 'Expenses table reset.' });
});

// 2. Categories Table Routes
app.get('/api/categories', (req, res) => {
  const categories = dbService.getCategories();
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const { name, monthlyTarget, emoji, tagline, payType } = req.body;
  if (!name || !monthlyTarget) {
    return res.status(400).json({ error: 'Name and target are required' });
  }
  const created = dbService.addCategory({ name, monthlyTarget, emoji, tagline, payType });
  res.status(201).json(created);
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  dbService.deleteCategory(id);
  res.json({ success: true, id });
});

// 3. User Profile Table Routes
app.post('/api/user/avatar', (req, res) => {
  const { avatarUrl, name } = req.body;
  const user = dbService.updateUser(name, avatarUrl, undefined);
  res.json(user);
});

// 4. Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { name, pin } = req.body;
  const settings = dbService.getSettings();

  if (pin && pin !== settings.savingsPin) {
    return res.status(401).json({ error: 'Invalid passcode' });
  }

  const user = dbService.updateUser(name, undefined, true);
  res.json({ success: true, user });
});

app.post('/api/auth/logout', (req, res) => {
  dbService.updateUser(undefined, undefined, false);
  res.json({ success: true });
});

// 5. Settings Table Routes
app.get('/api/settings', (req, res) => {
  const settings = dbService.getSettings();
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  dbService.updateSettings(req.body);
  const updated = dbService.getSettings();
  res.json(updated);
});

// Fallback to React frontend index.html for all non-API routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <div style="font-family: -apple-system, sans-serif; text-align: center; padding: 50px; background: #EBF5FE; min-height: 100vh;">
        <h2 style="color: #1E3A56;">☁️ Recenter Spend Backend is Running!</h2>
        <p style="color: #4A6572; font-size: 16px;">SQL database tables are connected in <code>data/expenses.db</code>.</p>
        <div style="margin-top: 30px;">
          <a href="http://localhost:5173" style="background: #2563EB; color: white; padding: 12px 24px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 16px;">
            👉 Open Live App (localhost:5173)
          </a>
        </div>
      </div>
    `);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SQLite Backend Server] Running on http://localhost:${PORT}`);
  console.log(`[Database File] Ready at data/expenses.db`);
});
