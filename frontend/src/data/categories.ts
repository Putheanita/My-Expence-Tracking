import type { CategoryInfo } from '../types';

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  {
    id: 'phone',
    name: 'Phone Top-up',
    tagline: '$1 each recharge',
    emoji: '📱',
    iconName: 'Smartphone',
    color: '#0284C7', // cyan blue
    bgColor: '#F0F9FF',
    monthlyTarget: 4,
    cadence: 'one-time',
    cadenceLabel: '$1 / top-up',
    standardAmount: 1, // $1 each time toward $4 target!
    specialNotice: 'Recharge $1.00 each time ($4.00 monthly target)',
    payType: 'flexible',
  },
  {
    id: 'mom',
    name: 'For Mom',
    tagline: 'Fixed monthly 1-time',
    emoji: '❤️',
    iconName: 'Heart',
    color: '#E11D48', // rose
    bgColor: '#FFF1F2',
    monthlyTarget: 25,
    cadence: 'one-time',
    cadenceLabel: 'Fixed $25',
    standardAmount: 25,
    specialNotice: '1-time fixed payment: $25.00/mo',
    payType: 'fixed-one-time',
  },
  {
    id: 'coffee',
    name: 'Coffee',
    tagline: 'Daily cups & sips',
    emoji: '☕',
    iconName: 'Coffee',
    color: '#D97706', // warm amber
    bgColor: '#FFFBEB',
    monthlyTarget: 35,
    cadence: 'flexible',
    cadenceLabel: 'Target $35',
    specialNotice: 'Target $35.00 • Pay whatever you spend',
    payType: 'flexible',
  },
  {
    id: 'food',
    name: 'Food Daily',
    tagline: 'Breakfast & Lunch',
    emoji: '🥗',
    iconName: 'Utensils',
    color: '#059669', // fresh green
    bgColor: '#ECFDF5',
    monthlyTarget: 80,
    cadence: 'flexible',
    cadenceLabel: 'Target $80',
    specialNotice: 'Target $80.00 • Pay whatever you spend',
    payType: 'flexible',
  },
  {
    id: 'gasoline',
    name: 'Gasoline',
    tagline: 'Fill as needed',
    emoji: '⛽',
    iconName: 'Fuel',
    color: '#2563EB', // blue
    bgColor: '#EFF6FF',
    monthlyTarget: 32,
    cadence: 'flexible',
    cadenceLabel: 'Target $32',
    specialNotice: 'Target $32.00 • Pay whatever you spend',
    payType: 'flexible',
  },
  {
    id: 'skincare',
    name: 'Skincare',
    tagline: 'Care purchases',
    emoji: '🧴',
    iconName: 'Sparkles',
    color: '#DB2777', // soft pink
    bgColor: '#FDF2F8',
    monthlyTarget: 40,
    cadence: 'flexible',
    cadenceLabel: 'Target $40',
    specialNotice: 'Target $40.00 • Pay whatever you spend',
    payType: 'flexible',
  },
  {
    id: 'other',
    name: 'Other',
    tagline: 'Little extras',
    emoji: '🛍️',
    iconName: 'ShoppingBag',
    color: '#7C3AED', // soft purple
    bgColor: '#F5F3FF',
    monthlyTarget: 30,
    cadence: 'flexible',
    cadenceLabel: 'Target $30',
    specialNotice: 'Target $30.00 • Pay whatever you spend',
    payType: 'flexible',
  },
  {
    id: 'savings',
    name: 'Savings Vault',
    tagline: 'Secured with PIN',
    emoji: '💎',
    iconName: 'Lock',
    color: '#0D9488', // teal
    bgColor: '#F0FDFA',
    monthlyTarget: 104, // Guaranteed monthly savings ($350 - $246)
    cadence: 'flexible',
    cadenceLabel: 'Goal: $104',
    specialNotice: '🔒 Secret Savings Vault (PIN required)',
    payType: 'flexible',
    isLocked: true,
  },
];

export const CATEGORIES = DEFAULT_CATEGORIES;
