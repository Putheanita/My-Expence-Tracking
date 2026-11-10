export type ExpenseCategory = string;

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
  salary: number; 
  totalExpenseBudget: number; 
  currencySymbol: string;
  cycleResetDay: number; 
  savingsPin: string; 
  hideSalary: boolean; 
  user: UserProfile;
}

export type ActiveTab = 'home' | 'create' | 'history' | 'profile';
