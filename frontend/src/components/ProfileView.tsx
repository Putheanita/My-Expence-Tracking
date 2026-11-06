import React, { useState } from 'react';
import { Wallet, DollarSign, RefreshCw, ArrowLeft, Calendar, KeyRound, Eye, EyeOff, Camera, Plus, Trash2, LogOut } from 'lucide-react';
import type { BudgetSettings, CategoryInfo } from '../types';
import { formatMoney, KHR_RATE } from '../utils/currency';

interface ProfileViewProps {
  settings: BudgetSettings;
  categories: CategoryInfo[];
  onUpdateSettings: (newSettings: Partial<BudgetSettings>) => void;
  onOpenAvatarPicker: () => void;
  onOpenCreateCategory: () => void;
  onDeleteCategory: (id: string) => void;
  onLogout: () => void;
  onResetData: () => void;
  onBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  settings,
  categories,
  onUpdateSettings,
  onOpenAvatarPicker,
  onOpenCreateCategory,
  onDeleteCategory,
  onLogout,
  onResetData,
  onBack,
}) => {
  const [pinInput, setPinInput] = useState(settings.savingsPin || '1234');
  const [pinSaved, setPinSaved] = useState(false);
  const savingsTarget = Math.max(0, settings.salary - settings.totalExpenseBudget);

  const handleSavePin = () => {
    if (pinInput.length === 4) {
      onUpdateSettings({ savingsPin: pinInput });
      setPinSaved(true);
      setTimeout(() => setPinSaved(false), 1500);
    } else {
      alert('PIN must be exactly 4 digits!');
    }
  };

  return (
    <div className="profile-page">
      <div className="session-nav-bar">
        <button type="button" className="glass-back-btn" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={18} color="#274A69" />
        </button>
        <div className="session-nav-titles">
          <h2 className="session-title">Your Space</h2>
          <span className="session-subtitle">Profile, categories & security</span>
        </div>
        <div style={{ width: 38 }} />
      </div>

      {/* User Profile Hero */}
      <div className="profile-hero-card">
        <div className="avatar-large-wrap clickable-avatar-large" onClick={onOpenAvatarPicker} title="Tap to update image">
          <img
            src={settings.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt="Profile"
            className="avatar-large"
          />
          <div className="avatar-camera-pill">
            <Camera size={13} color="#FFFFFF" />
            <span>Edit</span>
          </div>
        </div>
        <h3 className="profile-name">{settings.user?.name || 'Nita'}</h3>
        <p className="profile-quote">
          {settings.hideSalary ? '••••' : formatMoney(settings.salary, settings.currencySymbol)} Salary ➔ {formatMoney(settings.totalExpenseBudget, settings.currencySymbol)} Expenses + {formatMoney(savingsTarget, settings.currencySymbol)} Savings
        </p>

        <button type="button" className="edit-avatar-text-btn" onClick={onOpenAvatarPicker}>
          Update Profile Photo
        </button>
      </div>

      {/* Manage Categories Section */}
      <div className="profile-settings-card">
        <div className="card-header-with-action">
          <h4 className="card-subheading">Categories ({categories.length})</h4>
          <button type="button" className="add-cat-card-btn" onClick={onOpenCreateCategory}>
            <Plus size={13} />
            <span>Add Category</span>
          </button>
        </div>

        <div className="plan-breakdown-list">
          {categories.map((cat) => (
            <div key={cat.id} className="plan-breakdown-row">
              <span className="plan-cat-name">
                {cat.emoji} {cat.name} {cat.isCustom ? '✨' : ''}
              </span>
              <div className="cat-row-right-actions">
                <span className="plan-cat-target">{formatMoney(cat.monthlyTarget, settings.currencySymbol)}</span>
                {cat.isCustom && (
                  <button
                    type="button"
                    className="delete-custom-cat-btn"
                    onClick={() => onDeleteCategory(cat.id)}
                    title="Delete category"
                  >
                    <Trash2 size={12} color="#EF4444" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="plan-breakdown-row savings-highlight">
            <span className="plan-cat-name">💎 Guaranteed Savings</span>
            <span className="plan-cat-target">+{formatMoney(savingsTarget, settings.currencySymbol)}</span>
          </div>
        </div>
      </div>

      {/* Security & Privacy Settings */}
      <div className="profile-settings-card">
        <h4 className="card-subheading">Privacy & Security</h4>

        {/* Salary Blur Toggle */}
        <div className="setting-row">
          <div className="setting-label-wrap">
            {settings.hideSalary ? <EyeOff size={16} color="#64748B" /> : <Eye size={16} color="#2563EB" />}
            <span>Blur Salary Amount</span>
          </div>
          <button
            type="button"
            className={`toggle-switch-btn ${settings.hideSalary ? 'on' : 'off'}`}
            onClick={() => onUpdateSettings({ hideSalary: !settings.hideSalary })}
          >
            {settings.hideSalary ? 'Blurred 🔒' : 'Visible 👁️'}
          </button>
        </div>

        {/* Savings Vault PIN Code */}
        <div className="setting-row">
          <div className="setting-label-wrap">
            <KeyRound size={16} color="#0D9488" />
            <span>Savings PIN Code</span>
          </div>
          <div className="pin-setting-wrap">
            <input
              type="password"
              maxLength={4}
              className="setting-pin-input"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
            />
            <button type="button" className="save-pin-btn" onClick={handleSavePin}>
              {pinSaved ? '✓ Saved' : 'Set PIN'}
            </button>
          </div>
        </div>
      </div>

      {/* Cycle & Budget Settings */}
      <div className="profile-settings-card">
        <h4 className="card-subheading">Cycle & Income Settings</h4>

        <div className="setting-col-block">
          <div className="setting-row" style={{ padding: '8px 0 4px 0' }}>
            <div className="setting-label-wrap">
              <Calendar size={16} color="#3B82F6" />
              <span>Month Start Date</span>
            </div>
            <div className="setting-input-wrap">
              <span className="currency-prefix">Day</span>
              <input
                type="number"
                min="1"
                max="28"
                className="setting-number-input"
                value={settings.cycleResetDay}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) onUpdateSettings({ cycleResetDay: Math.min(28, Math.max(1, val)) });
                }}
              />
            </div>
          </div>
          
          {/* Quick preset selector buttons */}
          <div className="cycle-quick-pills-row">
            {[1, 5, 10, 15, 20, 25].map((d) => (
              <button
                key={d}
                type="button"
                className={`cycle-quick-chip ${settings.cycleResetDay === d ? 'active' : ''}`}
                onClick={() => onUpdateSettings({ cycleResetDay: d })}
              >
                {d === 1 ? '1st' : d === 5 ? '5th' : `${d}th`}
              </button>
            ))}
          </div>
          <span className="setting-hint-text">
            Cycle runs from day {settings.cycleResetDay} to day {settings.cycleResetDay} of next month.
          </span>
        </div>

        <div className="setting-row">
          <div className="setting-label-wrap">
            <Wallet size={16} color="#2563EB" />
            <span>Monthly Salary</span>
          </div>
          <div className="setting-input-wrap">
            <span className="currency-prefix">{settings.currencySymbol}</span>
            <input
              type="number"
              step={settings.currencySymbol === '៛' ? '1000' : '1'}
              className="setting-number-input"
              value={settings.currencySymbol === '៛' ? Math.round(settings.salary * KHR_RATE) : settings.salary}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                onUpdateSettings({ salary: settings.currencySymbol === '៛' ? val / KHR_RATE : val });
              }}
            />
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label-wrap">
            <DollarSign size={16} color="#10B981" />
            <span>Currency</span>
          </div>
          <div className="currency-selector-pills">
            <button
              type="button"
              className={`currency-pill-btn ${settings.currencySymbol === '$' ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ currencySymbol: '$' })}
            >
              $ Dollar (USD)
            </button>
            <button
              type="button"
              className={`currency-pill-btn ${settings.currencySymbol === '៛' ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ currencySymbol: '៛' })}
            >
              ៛ Riel (KHR)
            </button>
          </div>
        </div>

        <div className="rate-info-pill">
          <span className="rate-badge">Exchange Rate: $1 = 4,000 ៛</span>
          <span className="rate-subtext">
            {settings.currencySymbol === '៛'
              ? `Salary: ${formatMoney(settings.salary, '៛')} (≈ $${settings.salary.toFixed(0)} USD)`
              : `Salary: $${settings.salary} (≈ ${(settings.salary * KHR_RATE).toLocaleString()} ៛ KHR)`}
          </span>
        </div>
      </div>

      {/* Account Actions */}
      <div className="profile-danger-card">
        <button type="button" className="logout-action-btn" onClick={onLogout}>
          <LogOut size={15} />
          <span>Sign Out / Lock App</span>
        </button>

        <div style={{ marginTop: 8 }}>
          <button type="button" className="reset-data-btn" onClick={onResetData}>
            <RefreshCw size={13} />
            <span>Reset All Expense Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
