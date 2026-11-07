import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = !!process.env.VERCEL;
const DATA_DIR = isVercel ? '/tmp/data' : path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'expenses.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// If running in Vercel serverless environment, copy seed database to /tmp if available
const localSeedDb = path.join(__dirname, 'data', 'expenses.db');
if (isVercel && fs.existsSync(localSeedDb) && !fs.existsSync(DB_PATH)) {
  try {
    fs.copyFileSync(localSeedDb, DB_PATH);
  } catch (e) {
    console.warn('[Database] Initializing fresh SQLite db in /tmp:', e);
  }
}

export const db = new DatabaseSync(DB_PATH);

// -----------------------------------------------------------------
// 1. CREATE SQL TABLES
// -----------------------------------------------------------------

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    emoji TEXT,
    icon_name TEXT,
    color TEXT,
    bg_color TEXT,
    monthly_target REAL NOT NULL,
    cadence TEXT DEFAULT 'one-time',
    cadence_label TEXT,
    standard_amount REAL DEFAULT 0,
    special_notice TEXT,
    pay_type TEXT DEFAULT 'flexible',
    is_locked INTEGER DEFAULT 0,
    is_custom INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    category_id TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    mood TEXT,
    notes TEXT,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL,
    avatar_url TEXT,
    is_logged_in INTEGER DEFAULT 0
  );
`);

// -----------------------------------------------------------------
// 2. SEED DEFAULT DATA IF TABLES ARE EMPTY
// -----------------------------------------------------------------

const DEFAULT_CATEGORIES = [
  {
    id: 'phone',
    name: 'Phone Top-up',
    tagline: '$1 each recharge',
    emoji: '📱',
    icon_name: 'Smartphone',
    color: '#0284C7',
    bg_color: '#F0F9FF',
    monthly_target: 4,
    cadence: 'one-time',
    cadence_label: '$1 / top-up',
    standard_amount: 1,
    special_notice: 'Recharge $1.00 each time ($4.00 monthly target)',
    pay_type: 'flexible',
    is_locked: 0,
    is_custom: 0,
  },
  {
    id: 'mom',
    name: 'For Mom',
    tagline: 'Fixed monthly 1-time',
    emoji: '❤️',
    icon_name: 'Heart',
    color: '#E11D48',
    bg_color: '#FFF1F2',
    monthly_target: 25,
    cadence: 'one-time',
    cadence_label: 'Fixed $25',
    standard_amount: 25,
    special_notice: '1-time fixed payment: $25.00/mo',
    pay_type: 'fixed-one-time',
    is_locked: 0,
    is_custom: 0,
  },
  {
    id: 'coffee',
    name: 'Coffee',
    tagline: 'Daily cups & sips',
    emoji: '☕',
    icon_name: 'Coffee',
    color: '#D97706',
    bg_color: '#FFFBEB',
    monthly_target: 35,
    cadence: 'flexible',
    cadence_label: 'Target $35',
    standard_amount: null,
    special_notice: 'Target $35.00 • Pay whatever you spend',
    pay_type: 'flexible',
    is_locked: 0,
    is_custom: 0,
  },
  {
    id: 'food',
    name: 'Food Daily',
    tagline: 'Breakfast & Lunch',
    emoji: '🥗',
    icon_name: 'Utensils',
    color: '#059669',
    bg_color: '#ECFDF5',
    monthly_target: 80,
    cadence: 'flexible',
    cadence_label: 'Target $80',
    standard_amount: null,
    special_notice: 'Target $80.00 • Pay whatever you spend',
    pay_type: 'flexible',
    is_locked: 0,
    is_custom: 0,
  },
  {
    id: 'gasoline',
    name: 'Gasoline',
    tagline: 'Fill as needed',
    emoji: '⛽',
    icon_name: 'Fuel',
    color: '#2563EB',
    bg_color: '#EFF6FF',
    monthly_target: 32,
    cadence: 'flexible',
    cadence_label: 'Target $32',
    standard_amount: null,
    special_notice: 'Target $32.00 • Pay whatever you spend',
    pay_type: 'flexible',
    is_locked: 0,
    is_custom: 0,
  },
  {
    id: 'skincare',
    name: 'Skincare',
    tagline: 'Care purchases',
    emoji: '🧴',
    icon_name: 'Sparkles',
    color: '#DB2777',
    bg_color: '#FDF2F8',
    monthly_target: 40,
    cadence: 'flexible',
    cadence_label: 'Target $40',
    standard_amount: null,
    special_notice: 'Target $40.00 • Pay whatever you spend',
    pay_type: 'flexible',
    is_locked: 0,
    is_custom: 0,
  },
  {
    id: 'other',
    name: 'Other',
    tagline: 'Little extras',
    emoji: '🛍️',
    icon_name: 'ShoppingBag',
    color: '#7C3AED',
    bg_color: '#F5F3FF',
    monthly_target: 30,
    cadence: 'flexible',
    cadence_label: 'Target $30',
    standard_amount: null,
    special_notice: 'Target $30.00 • Pay whatever you spend',
    pay_type: 'flexible',
    is_locked: 0,
    is_custom: 0,
  },
  {
    id: 'savings',
    name: 'Savings Vault',
    tagline: 'Secured with PIN',
    emoji: '💎',
    icon_name: 'Lock',
    color: '#0D9488',
    bg_color: '#F0FDFA',
    monthly_target: 104,
    cadence: 'flexible',
    cadence_label: 'Goal: $104',
    standard_amount: null,
    special_notice: '🔒 Secret Savings Vault (PIN required)',
    pay_type: 'flexible',
    is_locked: 1,
    is_custom: 0,
  },
];

// Check if categories need seeding
const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
if (catCount === 0) {
  const insertCat = db.prepare(`
    INSERT INTO categories (
      id, name, tagline, emoji, icon_name, color, bg_color,
      monthly_target, cadence, cadence_label, standard_amount,
      special_notice, pay_type, is_locked, is_custom
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  for (const c of DEFAULT_CATEGORIES) {
    insertCat.run(
      c.id, c.name, c.tagline, c.emoji, c.icon_name, c.color, c.bg_color,
      c.monthly_target, c.cadence, c.cadence_label, c.standard_amount,
      c.special_notice, c.pay_type, c.is_locked, c.is_custom
    );
  }
} else {
  // Update any existing non-phone, non-mom categories to flexible without preset amounts
  try {
    db.prepare(`
      UPDATE categories
      SET cadence = 'flexible', standard_amount = NULL
      WHERE id NOT IN ('phone', 'mom')
    `).run();
  } catch (e) {
    console.error('Category update notice:', e);
  }
}

// Check if settings need seeding
const DEFAULT_SETTINGS = {
  salary: 350,
  totalExpenseBudget: 246,
  currencySymbol: '$',
  cycleResetDay: 5,
  savingsPin: '1234',
  hideSalary: true,
};

const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get().count;
if (settingsCount === 0) {
  const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
    insertSetting.run(k, JSON.stringify(v));
  }
}

// Check user profile
const userCount = db.prepare('SELECT COUNT(*) as count FROM user_profile').get().count;
if (userCount === 0) {
  db.prepare(`
    INSERT INTO user_profile (id, name, avatar_url, is_logged_in)
    VALUES (1, 'Nita', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', 0)
  `).run();
}

// -----------------------------------------------------------------
// 3. DATABASE HELPER METHODS (SQL QUERIES)
// -----------------------------------------------------------------

export const dbService = {
  // Expenses Queries
  getExpenses() {
    const rows = db.prepare('SELECT * FROM expenses ORDER BY date DESC, time DESC').all();
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      amount: r.amount,
      category: r.category_id,
      date: r.date,
      time: r.time,
      mood: r.mood,
      notes: r.notes,
    }));
  },

  addExpense(exp) {
    const id = exp.id || 'exp-' + Date.now();
    db.prepare(`
      INSERT INTO expenses (id, title, amount, category_id, date, time, mood, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      exp.title,
      exp.amount,
      exp.category,
      exp.date,
      exp.time,
      exp.mood || null,
      exp.notes || null,
      Date.now()
    );
    return { ...exp, id };
  },

  deleteExpense(id) {
    db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
    return true;
  },

  resetAllExpenses() {
    db.prepare('DELETE FROM expenses').run();
    return true;
  },

  // Categories Queries
  getCategories() {
    const rows = db.prepare('SELECT * FROM categories').all();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      tagline: r.tagline,
      emoji: r.emoji,
      iconName: r.icon_name,
      color: r.color,
      bgColor: r.bg_color,
      monthlyTarget: r.monthly_target,
      cadence: r.cadence,
      cadenceLabel: r.cadence_label,
      standardAmount: r.standard_amount,
      specialNotice: r.special_notice,
      payType: r.pay_type,
      isLocked: Boolean(r.is_locked),
      isCustom: Boolean(r.is_custom),
    }));
  },

  addCategory(cat) {
    const id = 'cat-' + Date.now();
    db.prepare(`
      INSERT INTO categories (
        id, name, tagline, emoji, icon_name, color, bg_color,
        monthly_target, cadence, cadence_label, standard_amount,
        special_notice, pay_type, is_locked, is_custom
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)
    `).run(
      id,
      cat.name,
      cat.tagline || 'Custom budget',
      cat.emoji || '✨',
      'Sparkles',
      '#0284C7',
      '#F0F9FF',
      cat.monthlyTarget,
      'one-time',
      `Target $${cat.monthlyTarget}`,
      Math.min(10, cat.monthlyTarget),
      `Custom category with $${cat.monthlyTarget} target`,
      cat.payType || 'flexible'
    );

    this.recomputeTotalBudget();
    return this.getCategories().find((c) => c.id === id);
  },

  deleteCategory(id) {
    db.prepare('DELETE FROM categories WHERE id = ? AND is_custom = 1').run(id);
    this.recomputeTotalBudget();
    return true;
  },

  recomputeTotalBudget() {
    const row = db.prepare(`
      SELECT SUM(monthly_target) as total
      FROM categories
      WHERE id != 'savings'
    `).get();
    const newTotal = row.total || 246;
    this.saveSetting('totalExpenseBudget', newTotal);
    return newTotal;
  },

  // Settings Queries
  getSettings() {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    for (const r of rows) {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch {
        settings[r.key] = r.value;
      }
    }
    const user = this.getUser();
    return { ...DEFAULT_SETTINGS, ...settings, user };
  },

  saveSetting(key, value) {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(
      key,
      JSON.stringify(value)
    );
  },

  updateSettings(newSettings) {
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    for (const [k, v] of Object.entries(newSettings)) {
      if (k !== 'user') {
        stmt.run(k, JSON.stringify(v));
      }
    }
  },

  // User Queries
  getUser() {
    const u = db.prepare('SELECT * FROM user_profile WHERE id = 1').get();
    return {
      name: u ? u.name : 'Nita',
      avatarUrl: u ? u.avatar_url : '',
      isLoggedIn: u ? Boolean(u.is_logged_in) : false,
    };
  },

  updateUser(name, avatarUrl, isLoggedIn) {
    const current = this.getUser();
    const finalName = name !== undefined ? name : current.name;
    const finalAvatar = avatarUrl !== undefined ? avatarUrl : current.avatarUrl;
    const finalLogged = isLoggedIn !== undefined ? (isLoggedIn ? 1 : 0) : (current.isLoggedIn ? 1 : 0);

    db.prepare(`
      UPDATE user_profile
      SET name = ?, avatar_url = ?, is_logged_in = ?
      WHERE id = 1
    `).run(finalName, finalAvatar, finalLogged);

    return this.getUser();
  },
};
