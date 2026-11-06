export type ExpenseCategory = string; // Supports standard + user-created custom categories

export type ExpenseCadence = 'daily' | 'one-time' | 'flexible';

export type CategoryPayType = 'fixed-one-time' | 'daily' | 'flexible';

export interface CategoryInfo {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  iconName: string;
  color: string;
  bgColor: string;
  monthlyTarget: number; // In USD
  cadence: ExpenseCadence;
  cadenceLabel: string;
  standardAmount?: number;
  specialNotice: string;
  payType: CategoryPayType;
  isLocked?: boolean;
  isCustom?: boolean;
}

export type ExpenseMood = 'calm' | 'happy' | 'needed' | 'splurge';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mood?: ExpenseMood;
  notes?: string;
  isOneTime?: boolean;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  isLoggedIn: boolean;
}

export interface BudgetSettings {
  salary: number; // e.g. $350
  totalExpenseBudget: number; // $246 (or auto-sum of category targets)
  currencySymbol: string;
  cycleResetDay: number; // e.g. 5 (5th of each month)
  savingsPin: string; // Default: '1234'
  hideSalary: boolean; // Blur salary by default
  user: UserProfile;
}

export type ActiveTab = 'home' | 'create' | 'history' | 'profile';
