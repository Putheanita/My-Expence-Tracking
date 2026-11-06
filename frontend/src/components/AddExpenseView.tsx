import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Send, Zap, Check, FileText } from 'lucide-react';
import { StarMascot } from './CloudMascot';
import type { Expense, CategoryInfo, ExpenseMood } from '../types';
import { formatMoney, toBaseUSD, KHR_RATE } from '../utils/currency';

interface AddExpenseViewProps {
  categories: CategoryInfo[];
  initialCategory?: string;
  onBack: () => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  currencySymbol: string;
}

export const AddExpenseView: React.FC<AddExpenseViewProps> = ({
  categories,
  initialCategory,
  onBack,
  onAddExpense,
  currencySymbol,
}) => {
  const [activeSegment, setActiveSegment] = useState<'create' | 'templates'>('create');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<string>(initialCategory || categories[0]?.id || 'food');
  const [mood] = useState<ExpenseMood>('calm');
  const [submitted, setSubmitted] = useState(false);

  const [quickAmounts, setQuickAmounts] = useState<Record<string, string>>({});

  // Regular fixed 1-tap templates
  const REGULAR_FIXED_TEMPLATES = [
    { title: 'Phone Top-up', amount: 1.0, category: 'phone', mood: 'needed' as ExpenseMood, note: '$1.00 phone top-up (toward $4 target)' },
    { title: 'Monthly Gift For Mom', amount: 25.0, category: 'mom', mood: 'happy' as ExpenseMood, note: 'Fixed monthly payment for Mom' },
  ];

  const QUICK_NOTE_CHIPS = [
    'Office canteen',
    'Morning brew',
    'Full tank',
    'Fixed plan',
    'With friend',
    'Discounted',
  ];

  const activeCategoryObj = categories.find((c) => c.id === category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    const baseAmount = toBaseUSD(parsedAmount, currencySymbol);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    onAddExpense({
      title: title.trim(),
      amount: baseAmount,
      category,
      date: dateStr,
      time: timeStr,
      notes: notes.trim() || undefined,
      mood,
    });

    setSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 600);
  };

  const handleInstantExpend = (tpl: typeof REGULAR_FIXED_TEMPLATES[0]) => {
    const now = new Date();
    onAddExpense({
      title: tpl.title,
      amount: tpl.amount,
      category: tpl.category,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      notes: tpl.note,
      mood: tpl.mood,
    });
    setSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 600);
  };

  const handleQuickCategoryPay = (cat: CategoryInfo) => {
    const rawTyped = parseFloat(quickAmounts[cat.id] || '');
    if (isNaN(rawTyped) || rawTyped <= 0) {
      alert(`Please enter the payment amount for ${cat.name}`);
      return;
    }

    const baseAmount = toBaseUSD(rawTyped, currencySymbol);
    const now = new Date();
    onAddExpense({
      title: `${cat.name} (${formatMoney(baseAmount, currencySymbol)})`,
      amount: baseAmount,
      category: cat.id,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      notes: `Payment toward ${formatMoney(cat.monthlyTarget, currencySymbol)} monthly target`,
      mood: 'calm',
    });

    setQuickAmounts({ ...quickAmounts, [cat.id]: '' });
    setSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 600);
  };

  return (
    <div className="create-session-page">
      {/* Top Bar with Back Arrow */}
      <div className="session-nav-bar">
        <button type="button" className="glass-back-btn" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={18} color="#274A69" />
        </button>
        <div className="session-nav-titles">
          <h2 className="session-title">Add Expense</h2>
          <span className="session-subtitle">
            {activeCategoryObj?.id === 'mom'
              ? `Fixed ${formatMoney(25, currencySymbol)} monthly payment`
              : activeCategoryObj?.id === 'phone'
              ? `Phone target ${formatMoney(4, currencySymbol)} (${formatMoney(1, currencySymbol)} recharge)`
              : `Target: ${formatMoney(activeCategoryObj?.monthlyTarget || 0, currencySymbol)} • Enter amount spent`}
          </span>
        </div>
        <div style={{ width: 38 }} />
      </div>

      {/* Pill Segmented Switch */}
      <div className="session-segmented-control">
        <button
          type="button"
          className={`segment-btn ${activeSegment === 'create' ? 'active' : ''}`}
          onClick={() => setActiveSegment('create')}
        >
          <Sparkles size={14} className="segment-icon" />
          <span>Custom Entry</span>
        </button>
        <button
          type="button"
          className={`segment-btn ${activeSegment === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveSegment('templates')}
        >
          <Zap size={14} className="segment-icon" />
          <span>Quick Tap</span>
        </button>
      </div>

      {activeSegment === 'templates' ? (
        <div className="templates-container">
          <p className="templates-guide-text">Regular fixed 1-tap items:</p>
          <div className="template-cards-list">
            {REGULAR_FIXED_TEMPLATES.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                className="template-card instant-card"
                onClick={() => handleInstantExpend(tpl)}
              >
                <div className="template-card-left">
                  <span className="template-card-title">{tpl.title}</span>
                  <span className="template-card-category">📝 {tpl.note}</span>
                </div>
                <div className="template-card-right">
                  <span className="template-card-price">{formatMoney(tpl.amount, currencySymbol)}</span>
                  <span className="template-instant-badge">⚡ 1-Tap</span>
                </div>
              </button>
            ))}
          </div>

          <p className="templates-guide-text" style={{ marginTop: 18 }}>
            Enter payment amount for other categories:
          </p>
          <div className="quick-pay-cards-list">
            {categories
              .filter((c) => c.id !== 'mom' && c.id !== 'phone' && !c.isLocked)
              .map((cat) => {
                const currentVal = quickAmounts[cat.id] || '';
                return (
                  <div key={cat.id} className="quick-cat-pay-card">
                    <div className="quick-cat-header">
                      <span className="quick-cat-title">
                        {cat.emoji} {cat.name}
                      </span>
                      <span className="quick-cat-target">
                        Target: {formatMoney(cat.monthlyTarget, currencySymbol)}
                      </span>
                    </div>

                    <div className="pay-inline-input-row" style={{ marginTop: 8 }}>
                      <div className="inline-input-wrapper">
                        <span className="inline-currency-symbol">{currencySymbol}</span>
                        <input
                          type="number"
                          step={currencySymbol === '៛' ? '100' : '0.01'}
                          min={currencySymbol === '៛' ? '100' : '0.01'}
                          placeholder={currencySymbol === '៛' ? 'e.g. 20000' : 'Enter amount'}
                          className="inline-amount-field"
                          value={currentVal}
                          onChange={(e) =>
                            setQuickAmounts({ ...quickAmounts, [cat.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleQuickCategoryPay(cat);
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        className="inline-pay-btn"
                        onClick={() => handleQuickCategoryPay(cat)}
                      >
                        <Zap size={13} />
                        <span>{currentVal ? `Pay ${currentVal} ${currencySymbol === '៛' ? '៛' : ''}` : 'Payment'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="session-main-form">
          <div className="session-canvas-card">
            <h3 className="canvas-prompt-heading">What did you spend on?</h3>
            <p className="canvas-prompt-sub">
              {activeCategoryObj?.id === 'mom'
                ? `Fixed payment for ${activeCategoryObj.name} (${formatMoney(25, currencySymbol)})`
                : activeCategoryObj?.id === 'phone'
                ? `Phone top-up (${formatMoney(1, currencySymbol)} or custom) toward ${formatMoney(4, currencySymbol)} target`
                : `Enter whatever amount you spent today for ${activeCategoryObj?.name || 'budget'}.`}
            </p>

            <div className="canvas-star-wrap">
              <StarMascot size={100} />
              <span className="star-quote">A brighter you starts here ♡</span>
            </div>

            {/* Description */}
            <div className="input-group">
              <input
                type="text"
                className="mindful-input"
                placeholder={activeCategoryObj ? `e.g. ${activeCategoryObj.name} payment` : 'e.g. Lunch, gas, coffee'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Amount */}
            <div className="input-group amount-group">
              <span className="amount-symbol">{currencySymbol}</span>
              <input
                type="number"
                step={currencySymbol === '៛' ? '100' : '0.01'}
                min={currencySymbol === '៛' ? '100' : '0.01'}
                className="mindful-input amount-input"
                placeholder={currencySymbol === '៛' ? '0' : '0.00'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Live Dual Currency Conversion Tag */}
            {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
              <div className="live-exchange-pill">
                💱 {currencySymbol === '៛'
                  ? `≈ $${(parseFloat(amount) / KHR_RATE).toFixed(2)} USD (at $1 = 4,000៛)`
                  : `≈ ${(Math.round(parseFloat(amount) * KHR_RATE)).toLocaleString()} ៛ KHR (at $1 = 4,000៛)`}
              </div>
            )}

            {/* Note / Remark Field */}
            <div className="input-group note-input-group">
              <div className="note-input-prefix">
                <FileText size={16} color="#4A8FD8" />
              </div>
              <input
                type="text"
                className="mindful-input note-input"
                placeholder="Add spending note (e.g. PTT station, Canteen lunch)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Fast Quick Note Chips */}
            <div className="quick-note-chips-row">
              {QUICK_NOTE_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="quick-note-chip"
                  onClick={() => setNotes(chip)}
                >
                  +{chip}
                </button>
              ))}
            </div>

            {/* Submit Row with Guidance */}
            <div className="canvas-actions-row">
              <span className="amount-helper-hint">
                {activeCategoryObj?.id === 'mom'
                  ? `Fixed ${formatMoney(25, currencySymbol)} monthly`
                  : activeCategoryObj?.id === 'phone'
                  ? `${formatMoney(1, currencySymbol)} per top-up or custom`
                  : `Target ${formatMoney(activeCategoryObj?.monthlyTarget || 0, currencySymbol)} • Enter amount spent`}
              </span>

              {/* Floating Blue Send Pill */}
              <button
                type="submit"
                className={`session-send-pill ${submitted ? 'success' : ''}`}
                disabled={!title.trim() || !amount}
                aria-label="Save expense"
              >
                {submitted ? <Check size={20} color="#FFFFFF" /> : <Send size={18} color="#FFFFFF" />}
              </button>
            </div>
          </div>

          {/* Category Selector */}
          <div className="session-bottom-categories">
            <span className="category-select-label">Select Category</span>
            <div className="session-category-row">
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`session-cat-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setCategory(cat.id);
                      if (cat.id === 'mom') {
                        setAmount(currencySymbol === '៛' ? '100000' : '25');
                      } else if (cat.id === 'phone') {
                        setAmount(currencySymbol === '៛' ? '4000' : '1');
                      } else {
                        setAmount('');
                      }
                      if (!title || categories.some((c) => c.name === title)) {
                        setTitle(cat.name);
                      }
                    }}
                  >
                    <div
                      className="cat-pill-bubble"
                      style={{ backgroundColor: cat.bgColor, color: cat.color }}
                    >
                      <span className="cat-pill-emoji">{cat.emoji}</span>
                    </div>
                    <span className="cat-pill-name">{cat.name}</span>
                    <span className="cat-pill-tagline">{formatMoney(cat.monthlyTarget, currencySymbol, false)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
