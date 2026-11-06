import React from 'react';
import { TrendingUp, ShieldCheck, Wallet, Sparkles, ChevronRight, PiggyBank, Calendar, Eye, EyeOff } from 'lucide-react';
import { CloudMascot } from './CloudMascot';
import { formatMoney } from '../utils/currency';

interface BudgetHeroProps {
  salary: number;
  totalBudget: number;
  spentMonth: number;
  remainingBudget: number;
  projectedSavings: number;
  currencySymbol: string;
  cycleLabel: string;
  daysRemaining: number;
  hideSalary: boolean;
  onToggleSalaryBlur: () => void;
  onQuickAdd: () => void;
  onEditCycleDay?: () => void;
}

export const BudgetHero: React.FC<BudgetHeroProps> = ({
  salary,
  totalBudget,
  spentMonth,
  remainingBudget,
  projectedSavings,
  currencySymbol,
  cycleLabel,
  daysRemaining,
  hideSalary,
  onToggleSalaryBlur,
  onQuickAdd,
  onEditCycleDay,
}) => {
  return (
    <div className="budget-hero-card">
      <div className="hero-backdrop-glow" />

      {/* Cycle Tag & Tagline */}
      <div className="hero-top-badge-row">
        <button
          type="button"
          className="cycle-badge-pill clickable"
          onClick={onEditCycleDay}
          title="Tap to change month start date"
        >
          <Calendar size={13} color="#2563EB" />
          <span className="cycle-label-text">{cycleLabel}</span>
          <span className="cycle-dot">•</span>
          <span className="cycle-days-left">{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left</span>
          <span className="cycle-edit-tag">⚙️</span>
        </button>

        {/* Privacy Eye Toggle */}
        <button
          type="button"
          className="privacy-toggle-btn"
          onClick={onToggleSalaryBlur}
          aria-label={hideSalary ? 'Unhide salary' : 'Blur salary'}
          title="Toggle Salary Privacy"
        >
          {hideSalary ? <EyeOff size={14} color="#64748B" /> : <Eye size={14} color="#2563EB" />}
          <span className="privacy-label">{hideSalary ? 'Private' : 'Visible'}</span>
        </button>
      </div>

      {/* Card Header text */}
      <div className="hero-text-content">
        <div className="hero-tag-quote">
          Salary {hideSalary ? '••••' : formatMoney(salary, currencySymbol)}<br />
          Plan {formatMoney(totalBudget, currencySymbol)}<br />
          Save ♡
        </div>
        <h2 className="hero-main-heading">
          A calmer, <br />brighter wallet
        </h2>
        <p className="hero-sub-heading">
          Monthly plan: {formatMoney(totalBudget, currencySymbol)} expenses • {hideSalary ? '••••' : formatMoney(salary - totalBudget, currencySymbol)} savings target.
        </p>
      </div>

      {/* Fluffy Cloud Mascot Centerpiece */}
      <div className="hero-mascot-wrapper">
        <CloudMascot size={175} />
      </div>

      {/* Quick Action Pill Button */}
      <button type="button" className="featured-session-pill" onClick={onQuickAdd}>
        <div className="session-pill-icon">
          <Sparkles size={16} color="#2A7B67" />
        </div>
        <div className="session-pill-text">
          <span className="pill-eyebrow">Quick Habit</span>
          <span className="pill-title">Log Today's Spending</span>
        </div>
        <ChevronRight size={16} color="#5A7E9A" className="pill-arrow" />
      </button>

      {/* 4-Metric Strip showing user's exact budget numbers */}
      <div className="hero-metric-strip">
        <div
          className="metric-item clickable-metric"
          onClick={onToggleSalaryBlur}
          title="Tap to toggle salary blur"
        >
          <div className="metric-icon-wrap blue-soft">
            <Wallet size={14} color="#2563EB" />
          </div>
          <span className={`metric-value ${hideSalary ? 'blurred-salary-text' : ''}`}>
            {formatMoney(salary, currencySymbol)}
          </span>
          <span className="metric-label">Salary 🔒</span>
        </div>

        <div className="metric-divider" />

        <div className="metric-item">
          <div className="metric-icon-wrap purple-soft">
            <TrendingUp size={14} color="#7C3AED" />
          </div>
          <span className="metric-value">{formatMoney(spentMonth, currencySymbol)}</span>
          <span className="metric-label">Spent</span>
        </div>

        <div className="metric-divider" />

        <div className="metric-item">
          <div className="metric-icon-wrap green-soft">
            <ShieldCheck size={14} color="#059669" />
          </div>
          <span className="metric-value">{formatMoney(remainingBudget, currencySymbol)}</span>
          <span className="metric-label">Left</span>
        </div>

        <div className="metric-divider" />

        <div className="metric-item">
          <div className="metric-icon-wrap mint-soft">
            <PiggyBank size={14} color="#0D9488" />
          </div>
          <span className="metric-value">{formatMoney(projectedSavings, currencySymbol)}</span>
          <span className="metric-label">Savings</span>
        </div>
      </div>

      {/* Carousel dots */}
      <div className="carousel-dots">
        <span className="dot active" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  );
};
