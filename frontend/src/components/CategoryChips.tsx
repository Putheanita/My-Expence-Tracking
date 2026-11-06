import React from 'react';
import { Utensils, Coffee, Sparkles, Fuel, Heart, ShoppingBag, Smartphone, Lock, Plus } from 'lucide-react';
import type { CategoryInfo } from '../types';
import { formatMoney } from '../utils/currency';

interface CategoryChipsProps {
  categories: CategoryInfo[];
  selectedCategory?: string | 'all';
  onSelectCategory: (catId: string | 'all') => void;
  onOpenCreateCategory: () => void;
  categoryTotals?: Record<string, number>;
  currencySymbol?: string;
  isSavingsUnlocked?: boolean;
  onRequirePin?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Utensils: <Utensils size={18} />,
  Coffee: <Coffee size={18} />,
  Sparkles: <Sparkles size={18} />,
  Fuel: <Fuel size={18} />,
  Heart: <Heart size={18} />,
  ShoppingBag: <ShoppingBag size={18} />,
  Smartphone: <Smartphone size={18} />,
  Lock: <Lock size={18} />,
};

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory = 'all',
  onSelectCategory,
  onOpenCreateCategory,
  categoryTotals = {},
  currencySymbol = '$',
  isSavingsUnlocked = false,
  onRequirePin,
}) => {
  return (
    <div className="categories-section">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">Budget Categories</h3>
          <span className="section-subtitle-small">Track vs. monthly targets (5th – 5th)</span>
        </div>
        <div className="category-header-actions">
          <button
            type="button"
            className="add-category-pill-btn"
            onClick={onOpenCreateCategory}
          >
            <Plus size={12} strokeWidth={2.5} />
            <span>New</span>
          </button>
          <button
            type="button"
            className="section-sub-action"
            onClick={() => onSelectCategory('all')}
          >
            {selectedCategory === 'all' ? 'All' : 'Clear'}
          </button>
        </div>
      </div>

      <div className="category-scroll-container">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const isLockedCategory = cat.isLocked && !isSavingsUnlocked;
          const spent = categoryTotals[cat.id] || 0;
          const percent = Math.min(100, Math.round((spent / cat.monthlyTarget) * 100));
          const isOver = spent > cat.monthlyTarget;

          const handleClick = () => {
            if (isLockedCategory && onRequirePin) {
              onRequirePin();
              return;
            }
            onSelectCategory(isSelected ? 'all' : cat.id);
          };

          return (
            <button
              key={cat.id}
              type="button"
              className={`category-pill-card ${isSelected ? 'selected' : ''} ${isLockedCategory ? 'locked-chip' : ''}`}
              onClick={handleClick}
            >
              <div
                className="category-icon-bubble"
                style={{ color: cat.color, backgroundColor: cat.bgColor }}
              >
                {isLockedCategory ? <Lock size={18} /> : (ICON_MAP[cat.iconName] || <span>{cat.emoji}</span>)}
              </div>
              <span className="category-card-name">
                {cat.name} {isLockedCategory ? '🔒' : ''}
              </span>
              <span className="category-card-sub">
                {isLockedCategory ? 'PIN protected' : cat.tagline}
              </span>

              {/* Target & Spent comparison */}
              <div className="category-target-badge">
                <span className={`cat-spent-text ${isOver ? 'over' : ''}`}>
                  {isLockedCategory ? '••••' : formatMoney(spent, currencySymbol, false)}
                </span>
                <span className="cat-target-divider">/</span>
                <span className="cat-target-limit">
                  {isLockedCategory ? '••••' : formatMoney(cat.monthlyTarget, currencySymbol, false)}
                </span>
              </div>

              {/* Micro Progress Bar */}
              <div className="cat-progress-track">
                <div
                  className="cat-progress-fill"
                  style={{
                    width: `${isLockedCategory ? 0 : percent}%`,
                    backgroundColor: isOver ? '#EF4444' : cat.color,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
