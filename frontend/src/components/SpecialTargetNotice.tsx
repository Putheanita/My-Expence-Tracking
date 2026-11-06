import React, { useState } from 'react';
import { Sparkles, Utensils, Coffee, Fuel, Heart, ShoppingBag, Smartphone, Lock, CheckCircle, Plus } from 'lucide-react';
import type { CategoryInfo } from '../types';
import { formatMoney, toBaseUSD } from '../utils/currency';

interface SpecialTargetNoticeProps {
  categories: CategoryInfo[];
  categoryTotals: Record<string, number>;
  currencySymbol: string;
  isSavingsUnlocked?: boolean;
  onRequirePin?: () => void;
  onQuickExpend: (catId: string, amount: number, title: string) => void;
  onOpenCustomExpend?: (catId: string) => void;
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

export const SpecialTargetNotice: React.FC<SpecialTargetNoticeProps> = ({
  categories,
  categoryTotals,
  currencySymbol,
  isSavingsUnlocked = false,
  onRequirePin,
  onQuickExpend,
}) => {
  const [justLogged, setJustLogged] = useState<string | null>(null);
  // Store custom input amounts per category
  const [inputAmounts, setInputAmounts] = useState<Record<string, string>>({});

  const handlePayAmount = (cat: CategoryInfo) => {
    if (cat.isLocked && !isSavingsUnlocked) {
      if (onRequirePin) onRequirePin();
      return;
    }

    let amt: number | undefined;
    const rawTyped = parseFloat(inputAmounts[cat.id] || '');
    if (!isNaN(rawTyped) && rawTyped > 0) {
      amt = toBaseUSD(rawTyped, currencySymbol);
    } else if (cat.id === 'phone') {
      amt = 1.0; // Regular $1 recharge (4,000 ៛)
    } else if (cat.id === 'mom') {
      amt = 25.0; // Regular $25 monthly (100,000 ៛)
    } else {
      // Do not set an arbitrary one-time amount!
      // Prompt user to type the amount they spent
      alert(`Please enter the amount you spent for ${cat.name}`);
      return;
    }

    if (!amt || amt <= 0) return;

    const formattedAmount = formatMoney(amt, currencySymbol);

    const defaultTitles: Record<string, string> = {
      phone: `Phone Top-up (${formattedAmount})`,
      mom: `Payment For Mom (${formattedAmount})`,
      coffee: `Coffee Purchase (${formattedAmount})`,
      food: `Food / Meal (${formattedAmount})`,
      gasoline: `Gasoline (${formattedAmount})`,
      skincare: `Skincare (${formattedAmount})`,
      other: `Expense (${formattedAmount})`,
      savings: `Savings Deposit (${formattedAmount})`,
    };

    onQuickExpend(cat.id, amt, defaultTitles[cat.id] || `${cat.name} (${formattedAmount})`);
    
    // Clear the typed input
    setInputAmounts((prev) => ({ ...prev, [cat.id]: '' }));
    setJustLogged(cat.id);
    setTimeout(() => setJustLogged(null), 1200);
  };

  return (
    <div className="special-targets-section">
      <div className="special-targets-header">
        <div className="header-title-wrap">
          <div className="sparkle-bubble">
            <Sparkles size={14} color="#2563EB" />
          </div>
          <div>
            <h3 className="section-title">Monthly Targets & Payments</h3>
            <span className="section-subtitle-small">Pay whatever you spend today toward each target</span>
          </div>
        </div>
      </div>

      {/* Target Focus Cards List */}
      <div className="target-cards-grid">
        {categories.map((cat) => {
          const isLockedCategory = cat.isLocked && !isSavingsUnlocked;
          const spent = categoryTotals[cat.id] || 0;
          const remaining = Math.max(0, cat.monthlyTarget - spent);
          const percent = Math.min(100, Math.round((spent / cat.monthlyTarget) * 100));
          const isOver = spent > cat.monthlyTarget;
          const isLogged = justLogged === cat.id;
          const currentInputVal = inputAmounts[cat.id] || '';

          return (
            <div key={cat.id} className={`special-target-card ${isLockedCategory ? 'card-locked' : ''}`}>
              {/* Top Row: Icon + Names + Target Tag */}
              <div className="target-card-top">
                <div
                  className="target-icon-wrap"
                  style={{ backgroundColor: cat.bgColor, color: cat.color }}
                >
                  {isLockedCategory ? <Lock size={18} /> : (ICON_MAP[cat.iconName] || <span>{cat.emoji}</span>)}
                </div>

                <div className="target-info-col">
                  <div className="target-name-row">
                    <span className="target-card-title">
                      {cat.name} {isLockedCategory ? '🔒' : ''}
                    </span>
                    <span className="target-pill-budget">
                      Target: {formatMoney(cat.monthlyTarget, currencySymbol)}
                    </span>
                  </div>
                  <span className="target-card-notice">
                    {isLockedCategory
                      ? '🔒 Passcode required to view and deposit'
                      : cat.id === 'phone'
                      ? `Phone target ${formatMoney(4, currencySymbol)} (${formatMoney(1, currencySymbol)} each recharge)`
                      : cat.id === 'mom'
                      ? `Monthly target ${formatMoney(25, currencySymbol)} for mom`
                      : `Monthly target ${formatMoney(cat.monthlyTarget, currencySymbol)} • Spend whatever needed`}
                  </span>
                </div>
              </div>

              {/* Middle Row: Numbers (Target / Spent / Remaining) */}
              <div className="target-number-hero">
                <div className="number-stat-box">
                  <span className="number-stat-label">Target</span>
                  <span className={`number-stat-target ${isLockedCategory ? 'blurred-vault-text' : ''}`}>
                    {isLockedCategory ? '••••' : formatMoney(cat.monthlyTarget, currencySymbol)}
                  </span>
                </div>

                <div className="number-stat-divider" />

                <div className="number-stat-box">
                  <span className="number-stat-label">Paid / Spent</span>
                  <span className={`number-stat-spent ${isOver ? 'over' : ''} ${isLockedCategory ? 'blurred-vault-text' : ''}`}>
                    {isLockedCategory ? '••••' : formatMoney(spent, currencySymbol)}
                  </span>
                </div>

                <div className="number-stat-divider" />

                <div className="number-stat-box">
                  <span className="number-stat-label">Remaining</span>
                  <span className={`number-stat-remain ${isLockedCategory ? 'blurred-vault-text' : ''}`}>
                    {isLockedCategory ? '••••' : formatMoney(remaining, currencySymbol)}
                  </span>
                </div>
              </div>

              {/* Progress Bar with glow */}
              <div className="target-meter-track">
                <div
                  className="target-meter-fill"
                  style={{
                    width: `${isLockedCategory ? 0 : percent}%`,
                    backgroundColor: isOver ? '#EF4444' : cat.color,
                  }}
                />
              </div>

              {/* Payment Actions Row: Just Input and Payment Button */}
              <div className="target-expend-footer">
                {isLockedCategory ? (
                  <>
                    <span className="expend-amount-tag">Confidential Savings Vault</span>
                    <button
                      type="button"
                      className="one-tap-expend-btn unlock-btn"
                      onClick={() => onRequirePin && onRequirePin()}
                    >
                      <Lock size={13} />
                      <span>Unlock with PIN</span>
                    </button>
                  </>
                ) : (
                  <div className="pay-inline-input-row">
                    <div className="inline-input-wrapper">
                      <span className="inline-currency-symbol">{currencySymbol}</span>
                      <input
                        type="number"
                        step={currencySymbol === '៛' ? '100' : '0.01'}
                        min={currencySymbol === '៛' ? '100' : '0.01'}
                        placeholder={
                          cat.id === 'phone'
                            ? currencySymbol === '៛' ? '4000' : '1.00'
                            : cat.id === 'mom'
                            ? currencySymbol === '៛' ? '100000' : '25.00'
                            : currencySymbol === '៛' ? 'e.g. 20000' : '0.00'
                        }
                        className="inline-amount-field"
                        value={currentInputVal}
                        onChange={(e) =>
                          setInputAmounts({ ...inputAmounts, [cat.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePayAmount(cat);
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      className={`inline-pay-btn ${isLogged ? 'logged' : ''}`}
                      onClick={() => handlePayAmount(cat)}
                    >
                      {isLogged ? (
                        <>
                          <CheckCircle size={14} color="#FFFFFF" />
                          <span>Paid!</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} strokeWidth={2.6} />
                          <span>
                            {currentInputVal ? `Pay ${currentInputVal} ${currencySymbol === '៛' ? '៛' : ''}` : 'Payment'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
