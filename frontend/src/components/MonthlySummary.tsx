import React, { useState } from 'react';
import { Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { getRecentBudgetCycles } from '../utils/cycle';
import type { Expense, BudgetSettings, CategoryInfo } from '../types';
import { formatMoney } from '../utils/currency';

interface MonthlySummaryProps {
  expenses: Expense[];
  settings: BudgetSettings;
  categories: CategoryInfo[];
  onSelectCategory?: (catId: string) => void;
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  expenses,
  settings,
  categories,
}) => {
  const recentCycles = getRecentBudgetCycles(4, settings.cycleResetDay);
  const [selectedCycleId, setSelectedCycleId] = useState<string>(recentCycles[0].id);

  const activeCycle = recentCycles.find((c) => c.id === selectedCycleId) || recentCycles[0];

  // Filter expenses strictly in this selected cycle
  const cycleExpenses = expenses.filter(
    (e) => e.date >= activeCycle.startStr && e.date < activeCycle.endStr
  );

  const totalSpent = cycleExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = Math.max(0, settings.totalExpenseBudget - totalSpent);
  const totalSaved = Math.max(0, settings.salary - totalSpent);
  const isOverBudget = totalSpent > settings.totalExpenseBudget;

  // Category totals
  const categoryTotals = cycleExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="monthly-summary-container">
      {/* Month / Cycle Selector Bar */}
      <div className="cycle-selector-strip">
        {recentCycles.map((cyc) => {
          const isSelected = cyc.id === selectedCycleId;
          return (
            <button
              key={cyc.id}
              type="button"
              className={`cycle-pill-btn ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedCycleId(cyc.id)}
            >
              <Calendar size={12} />
              <span>{cyc.label}</span>
              {cyc.isCurrent && <span className="current-badge">Active</span>}
            </button>
          );
        })}
      </div>

      {/* Main Monthly Balance Report Card */}
      <div className="monthly-hero-report">
        <div className="report-header-row">
          <div>
            <span className="report-eyebrow">Monthly Financial Summary</span>
            <h3 className="report-cycle-title">{activeCycle.label}</h3>
          </div>
          <div className={`report-status-pill ${isOverBudget ? 'alert' : 'safe'}`}>
            {isOverBudget ? (
              <span>Over by {formatMoney(totalSpent - settings.totalExpenseBudget, settings.currencySymbol)}</span>
            ) : (
              <>
                <CheckCircle2 size={13} />
                <span>On Plan</span>
              </>
            )}
          </div>
        </div>

        {/* 3 Large Metric Columns */}
        <div className="report-metric-columns">
          <div className="report-metric-card">
            <span className="report-metric-label">Total Spent</span>
            <span className={`report-metric-value ${isOverBudget ? 'danger' : ''}`}>
              {formatMoney(totalSpent, settings.currencySymbol)}
            </span>
            <span className="report-metric-sub">Plan: {formatMoney(settings.totalExpenseBudget, settings.currencySymbol)}</span>
          </div>

          <div className="report-metric-card">
            <span className="report-metric-label">Remaining</span>
            <span className="report-metric-value green">
              {formatMoney(remainingBudget, settings.currencySymbol)}
            </span>
            <span className="report-metric-sub">Safe limit</span>
          </div>

          <div className="report-metric-card">
            <span className="report-metric-label">Savings</span>
            <span className="report-metric-value purple">
              {formatMoney(totalSaved, settings.currencySymbol)}
            </span>
            <span className="report-metric-sub">From {formatMoney(settings.salary, settings.currencySymbol)} salary</span>
          </div>
        </div>
      </div>

      {/* Category Target Adherence Table / Progress */}
      <div className="category-report-card">
        <h4 className="report-subheading">Categories Performance ({categories.length})</h4>
        <div className="category-progress-list">
          {categories.map((cat) => {
            const spent = categoryTotals[cat.id] || 0;
            const remaining = cat.monthlyTarget - spent;
            const percent = Math.min(100, Math.round((spent / cat.monthlyTarget) * 100));
            const isCatOver = spent > cat.monthlyTarget;

            return (
              <div key={cat.id} className="category-report-row">
                <div className="cat-row-top">
                  <div className="cat-name-left">
                    <span className="cat-emoji-badge">{cat.emoji}</span>
                    <span className="cat-row-name">{cat.name}</span>
                    <span className="cat-cadence-label">{cat.cadenceLabel}</span>
                  </div>
                  <div className="cat-amounts-right">
                    <span className={`cat-spent-amount ${isCatOver ? 'over' : ''}`}>
                      {formatMoney(spent, settings.currencySymbol)}
                    </span>
                    <span className="cat-slash">/</span>
                    <span className="cat-target-amount">{formatMoney(cat.monthlyTarget, settings.currencySymbol)}</span>
                  </div>
                </div>

                {/* Progress Meter */}
                <div className="cat-row-meter">
                  <div
                    className="cat-meter-fill"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: isCatOver ? '#EF4444' : cat.color,
                    }}
                  />
                </div>

                <div className="cat-row-footer">
                  <span className="cat-notice-text">{cat.specialNotice}</span>
                  <span className={`cat-remain-tag ${remaining >= 0 ? 'good' : 'bad'}`}>
                    {remaining >= 0
                      ? `${formatMoney(remaining, settings.currencySymbol)} left`
                      : `+${formatMoney(Math.abs(remaining), settings.currencySymbol)} over`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Noted Transactions Feed in this month */}
      <div className="monthly-noted-section">
        <div className="noted-section-header">
          <div className="noted-title-wrap">
            <FileText size={16} color="#2563EB" />
            <h4 className="report-subheading">Spending Logs with Notes</h4>
          </div>
          <span className="noted-count-pill">{cycleExpenses.length} entries</span>
        </div>

        {cycleExpenses.length === 0 ? (
          <div className="empty-noted-card">
            <span>☁️ No expenses logged yet for this cycle ({activeCycle.label}).</span>
          </div>
        ) : (
          <div className="noted-expenses-list">
            {cycleExpenses.map((exp) => {
              const cat = categories.find((c) => c.id === exp.category);
              return (
                <div key={exp.id} className="noted-expense-card">
                  <div className="noted-card-top">
                    <div className="noted-card-left">
                      <span className="noted-cat-bubble" style={{ backgroundColor: cat?.bgColor, color: cat?.color }}>
                        {cat?.emoji || '🪙'}
                      </span>
                      <div className="noted-title-info">
                        <span className="noted-exp-title">{exp.title}</span>
                        <span className="noted-exp-meta">
                          {cat?.name || exp.category} • {exp.time || ''} • {exp.date}
                        </span>
                      </div>
                    </div>
                    <span className="noted-exp-amount">
                      -{formatMoney(exp.amount, settings.currencySymbol)}
                    </span>
                  </div>

                  {/* Note / Remark Display */}
                  {exp.notes ? (
                    <div className="noted-remark-pill">
                      <span className="note-pen-icon">📝</span>
                      <span className="note-text-body">{exp.notes}</span>
                    </div>
                  ) : (
                    <div className="noted-remark-pill default-note">
                      <span className="note-pen-icon">🏷️</span>
                      <span className="note-text-body">{cat?.specialNotice || 'Standard purchase'}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
