import React from 'react';
import { Trash2, Coffee, Utensils, Sparkles, Fuel, Heart, ShoppingBag, Smartphone } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import type { Expense, ExpenseCategory } from '../types';
import { formatMoney } from '../utils/currency';

interface ExpenseHistoryProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  currencySymbol: string;
  selectedCategory: ExpenseCategory | 'all';
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Utensils: <Utensils size={16} />,
  Coffee: <Coffee size={16} />,
  Sparkles: <Sparkles size={16} />,
  Fuel: <Fuel size={16} />,
  Heart: <Heart size={16} />,
  ShoppingBag: <ShoppingBag size={16} />,
  Smartphone: <Smartphone size={16} />,
};

export const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({
  expenses,
  onDeleteExpense,
  currencySymbol,
  selectedCategory,
}) => {
  const filtered = selectedCategory === 'all'
    ? expenses
    : expenses.filter((e) => e.category === selectedCategory);

  if (filtered.length === 0) {
    return (
      <div className="empty-history-card">
        <div className="empty-cloud-icon">☁️</div>
        <h4 className="empty-title">All peaceful here</h4>
        <p className="empty-sub">No spending recorded in this view.</p>
      </div>
    );
  }

  return (
    <div className="history-list-section">
      <div className="history-header">
        <h3 className="section-title">Recent Spending Flow</h3>
        <span className="history-count">{filtered.length} entries</span>
      </div>

      <div className="history-cards-container">
        {filtered.map((item) => {
          const catInfo = CATEGORIES.find((c) => c.id === item.category);
          const icon = catInfo ? ICON_MAP[catInfo.iconName] : <span>🪙</span>;

          return (
            <div key={item.id} className="history-item-card">
              <div
                className="history-cat-icon"
                style={{
                  backgroundColor: catInfo?.bgColor || '#F1F5F9',
                  color: catInfo?.color || '#334155',
                }}
              >
                {icon}
              </div>

              <div className="history-details">
                <span className="history-title">{item.title}</span>
                <div className="history-meta">
                  <span className="history-cat-tag">{catInfo?.name || item.category}</span>
                  <span className="meta-bullet">•</span>
                  <span className="history-time">{item.time || item.date}</span>
                </div>
                {/* Note / Remark pill */}
                {item.notes && (
                  <div className="history-note-badge">
                    <span className="history-note-icon">📝</span>
                    <span className="history-note-text">{item.notes}</span>
                  </div>
                )}
              </div>

              <div className="history-right-col">
                <span className="history-amount">
                  -{formatMoney(item.amount, currencySymbol)}
                </span>
                <button
                  type="button"
                  className="history-delete-btn"
                  onClick={() => onDeleteExpense(item.id)}
                  aria-label="Delete"
                >
                  <Trash2 size={13} color="#94A3B8" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
