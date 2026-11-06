import type { Expense, BudgetSettings, CategoryInfo, UserProfile } from '../types';
import { DEFAULT_CATEGORIES } from '../data/categories';

const API_BASE = '/api';

export const api = {
  // Expenses
  async getExpenses(): Promise<Expense[]> {
    try {
      const res = await fetch(`${API_BASE}/expenses`);
      if (!res.ok) throw new Error('Failed to fetch from server');
      return await res.json();
    } catch {
      const saved = localStorage.getItem('recenter_expenses_backend');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async addExpense(newExp: Omit<Expense, 'id'>): Promise<Expense> {
    try {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp),
      });
      if (!res.ok) throw new Error('Failed to post expense to server');
      return await res.json();
    } catch {
      const created: Expense = {
        ...newExp,
        id: 'exp-' + Date.now(),
      };
      return created;
    }
  },

  async deleteExpense(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  async resetAllExpenses(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/expenses/reset`, {
        method: 'POST',
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Categories
  async getCategories(): Promise<CategoryInfo[]> {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch {
      const saved = localStorage.getItem('recenter_custom_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    }
  },

  async createCategory(catData: { name: string; monthlyTarget: number; emoji?: string; tagline?: string }): Promise<CategoryInfo> {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData),
      });
      if (!res.ok) throw new Error('Failed to create category');
      return await res.json();
    } catch {
      const newCat: CategoryInfo = {
        id: 'cat-' + Date.now(),
        name: catData.name,
        monthlyTarget: catData.monthlyTarget,
        emoji: catData.emoji || '✨',
        tagline: catData.tagline || 'Custom budget',
        iconName: 'Sparkles',
        color: '#0284C7',
        bgColor: '#F0F9FF',
        cadence: 'flexible',
        cadenceLabel: `Target $${catData.monthlyTarget}`,
        specialNotice: `Custom category with $${catData.monthlyTarget} target`,
        payType: 'flexible',
        isCustom: true,
      };
      return newCat;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // User & Avatar
  async updateAvatar(avatarUrl: string, name?: string): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/user/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl, name }),
      });
      if (!res.ok) throw new Error('Failed to update avatar');
      return await res.json();
    } catch {
      return { name: name || 'Mindful User', avatarUrl, isLoggedIn: true };
    }
  },

  // Auth: Login & Logout
  async login(name: string, pin: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pin }),
      });
      return await res.json();
    } catch {
      return { success: true, user: { name: name || 'Mindful User', avatarUrl: '', isLoggedIn: true } };
    }
  },

  async logout(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Settings
  async getSettings(fallback: BudgetSettings): Promise<BudgetSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error('Failed to fetch settings from server');
      return await res.json();
    } catch {
      const saved = localStorage.getItem('recenter_settings_backend');
      return saved ? JSON.parse(saved) : fallback;
    }
  },

  async saveSettings(settings: BudgetSettings): Promise<BudgetSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      return await res.json();
    } catch {
      localStorage.setItem('recenter_settings_backend', JSON.stringify(settings));
      return settings;
    }
  },
};
