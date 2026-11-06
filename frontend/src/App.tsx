import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BudgetHero } from './components/BudgetHero';
import { CategoryChips } from './components/CategoryChips';
import { SpecialTargetNotice } from './components/SpecialTargetNotice';
import { MonthlySummary } from './components/MonthlySummary';
import { ExpenseHistory } from './components/ExpenseHistory';
import { AddExpenseView } from './components/AddExpenseView';
import { BottomNav } from './components/BottomNav';
import { ProfileView } from './components/ProfileView';
import { PinModal } from './components/PinModal';
import { LoginPage } from './components/LoginPage';
import { AvatarPickerModal } from './components/AvatarPickerModal';
import { CreateCategoryModal } from './components/CreateCategoryModal';
import { CycleDayModal } from './components/CycleDayModal';
import { getCurrentBudgetCycle } from './utils/cycle';
import { formatMoney } from './utils/currency';
import { DEFAULT_CATEGORIES } from './data/categories';
import { api } from './services/api';
import type { Expense, BudgetSettings, ActiveTab, CategoryInfo, CategoryPayType } from './types';
import './App.css';

const DEFAULT_SETTINGS: BudgetSettings = {
  salary: 350,
  totalExpenseBudget: 246,
  currencySymbol: '$',
  cycleResetDay: 5,
  savingsPin: '1234',
  hideSalary: true,
  user: {
    name: 'Nita',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    isLoggedIn: false, // Show Login Page first!
  },
};

export function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<BudgetSettings>(DEFAULT_SETTINGS);
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedAddCategory, setSelectedAddCategory] = useState<string>('coffee');
  
  // Modals
  const [isSavingsUnlocked, setIsSavingsUnlocked] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Load from Backend on startup
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [fetchedExpenses, fetchedSettings, fetchedCategories] = await Promise.all([
          api.getExpenses(),
          api.getSettings(DEFAULT_SETTINGS),
          api.getCategories(),
        ]);
        setExpenses(fetchedExpenses);
        setSettings(fetchedSettings);
        if (fetchedCategories && fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
        }
        setIsBackendConnected(true);
      } catch {
        setIsBackendConnected(false);
      }
    }
    loadInitialData();
  }, []);

  // Compute 5th-to-5th monthly cycle
  const cycle = getCurrentBudgetCycle(settings.cycleResetDay);

  // Filter expenses that belong to the current 5th-to-5th cycle
  const currentCycleExpenses = expenses.filter(
    (e) => e.date >= cycle.startStr && e.date <= cycle.endStr
  );

  const totalSpentCycle = currentCycleExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = Math.max(0, settings.totalExpenseBudget - totalSpentCycle);
  const projectedSavings = Math.max(0, settings.salary - totalSpentCycle);

  // Category totals for current cycle
  const categoryTotals = currentCycleExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleAddExpense = async (newExp: Omit<Expense, 'id'>) => {
    const saved = await api.addExpense(newExp);
    setExpenses([saved, ...expenses]);
  };

  const handleQuickExpend = async (categoryId: string, amount: number, title: string) => {
    const now = new Date();
    const newExp: Omit<Expense, 'id'> = {
      title,
      amount,
      category: categoryId,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      notes: `${title} logged in 1-tap`,
      mood: 'calm',
    };
    await handleAddExpense(newExp);
  };

  const handleOpenCustomExpend = (catId: string) => {
    setSelectedAddCategory(catId);
    setCurrentTab('create');
  };

  const handleDeleteExpense = async (id: string) => {
    await api.deleteExpense(id);
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleResetData = async () => {
    if (confirm('Reset all expense data to a completely fresh empty slate?')) {
      await api.resetAllExpenses();
      setExpenses([]);
      alert('All expenses have been reset! Ready for your fresh start.');
    }
  };

  const handleUpdateSettings = async (newVals: Partial<BudgetSettings>) => {
    const updated = { ...settings, ...newVals };
    setSettings(updated);
    await api.saveSettings(updated);
  };

  const toggleSalaryBlur = () => {
    handleUpdateSettings({ hideSalary: !settings.hideSalary });
  };

  // Auth: Login
  const handleLogin = async (name: string, pin: string): Promise<boolean> => {
    const res = await api.login(name, pin);
    if (res.success && res.user) {
      setSettings((prev) => ({
        ...prev,
        user: { ...prev.user, ...res.user, isLoggedIn: true },
      }));
      return true;
    }
    return false;
  };

  // Auth: Logout
  const handleLogout = async () => {
    await api.logout();
    setSettings((prev) => ({
      ...prev,
      user: { ...prev.user, isLoggedIn: false },
    }));
  };

  // Avatar update
  const handleSelectAvatar = async (newUrl: string) => {
    const updatedUser = await api.updateAvatar(newUrl, settings.user.name);
    setSettings((prev) => ({
      ...prev,
      user: { ...prev.user, avatarUrl: updatedUser.avatarUrl },
    }));
  };

  // Create Category
  const handleCreateCategory = async (catData: {
    name: string;
    monthlyTarget: number;
    emoji: string;
    tagline: string;
    payType: CategoryPayType;
  }) => {
    const created = await api.createCategory(catData);
    const updatedCats = [...categories, created];
    setCategories(updatedCats);

    // Update total planned expense budget
    const newTotal = updatedCats
      .filter((c) => c.id !== 'savings')
      .reduce((sum, c) => sum + (c.monthlyTarget || 0), 0);
    handleUpdateSettings({ totalExpenseBudget: newTotal });
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete this custom category?')) {
      await api.deleteCategory(id);
      const updatedCats = categories.filter((c) => c.id !== id);
      setCategories(updatedCats);

      const newTotal = updatedCats
        .filter((c) => c.id !== 'savings')
        .reduce((sum, c) => sum + (c.monthlyTarget || 0), 0);
      handleUpdateSettings({ totalExpenseBudget: newTotal });
    }
  };

  return (
    <div className="mobile-app-viewport">
      <div className="phone-screen-frame">
        {/* iOS Dynamic Island Simulator bar on top */}
        <div className="ios-status-bar">
          <span className="status-time">9:41</span>
          <div className="dynamic-island" />
          <div className="status-icons">
            <span
              className={`backend-indicator-dot ${isBackendConnected ? 'online' : 'offline'}`}
              title={isBackendConnected ? 'Backend Connected' : 'Offline Mode'}
            />
            <span className="signal-bar">●●●</span>
            <span className="wifi-icon">⚡</span>
            <span className="battery-pill">78</span>
          </div>
        </div>

        {/* If not logged in, render the Login Screen */}
        {!settings.user?.isLoggedIn ? (
          <LoginPage defaultName={settings.user?.name || 'Nita'} onLogin={handleLogin} />
        ) : (
          <>
            {/* View Switching */}
            <main className="screen-scroll-body">
              {currentTab === 'home' && (
                <div className="home-tab-content">
                  <Header
                    user={settings.user}
                    onAvatarClick={() => setIsAvatarModalOpen(true)}
                    onNotificationClick={() =>
                      alert(
                        `Cycle: ${cycle.label}\nYou have ${formatMoney(remainingBudget, settings.currencySymbol)} left of your monthly budget (${cycle.daysRemaining} days remaining)!`
                      )
                    }
                    onSearchClick={() => setCurrentTab('history')}
                  />

                  <BudgetHero
                    salary={settings.salary}
                    totalBudget={settings.totalExpenseBudget}
                    spentMonth={totalSpentCycle}
                    remainingBudget={remainingBudget}
                    projectedSavings={projectedSavings}
                    currencySymbol={settings.currencySymbol}
                    cycleLabel={cycle.label}
                    daysRemaining={cycle.daysRemaining}
                    hideSalary={settings.hideSalary}
                    onToggleSalaryBlur={toggleSalaryBlur}
                    onQuickAdd={() => setCurrentTab('create')}
                    onEditCycleDay={() => setIsCycleModalOpen(true)}
                  />

                  {/* Special Target Display with 1-Tap Expend and PIN Protection */}
                  <SpecialTargetNotice
                    categories={categories}
                    categoryTotals={categoryTotals}
                    currencySymbol={settings.currencySymbol}
                    isSavingsUnlocked={isSavingsUnlocked}
                    onRequirePin={() => setIsPinModalOpen(true)}
                    onQuickExpend={handleQuickExpend}
                    onOpenCustomExpend={handleOpenCustomExpend}
                  />

                  <CategoryChips
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onOpenCreateCategory={() => setIsCreateCategoryModalOpen(true)}
                    categoryTotals={categoryTotals}
                    currencySymbol={settings.currencySymbol}
                    isSavingsUnlocked={isSavingsUnlocked}
                    onRequirePin={() => setIsPinModalOpen(true)}
                  />

                  <ExpenseHistory
                    expenses={currentCycleExpenses.slice(0, 5)}
                    onDeleteExpense={handleDeleteExpense}
                    currencySymbol={settings.currencySymbol}
                    selectedCategory={selectedCategory}
                  />
                </div>
              )}

              {currentTab === 'create' && (
                <AddExpenseView
                  categories={categories}
                  initialCategory={selectedAddCategory}
                  onBack={() => setCurrentTab('home')}
                  onAddExpense={(exp) => {
                    handleAddExpense(exp);
                    setCurrentTab('home');
                  }}
                  currencySymbol={settings.currencySymbol}
                />
              )}

              {currentTab === 'history' && (
                <div className="history-tab-content">
                  <div className="page-header-inline">
                    <h2 className="session-title">Monthly Summary & Notes</h2>
                    <span className="session-subtitle">Track your 5th–5th cycles and notes</span>
                  </div>

                  <MonthlySummary
                    expenses={expenses}
                    settings={settings}
                    categories={categories}
                    onSelectCategory={(catId) => setSelectedCategory(catId)}
                  />
                </div>
              )}

              {currentTab === 'profile' && (
                <ProfileView
                  settings={settings}
                  categories={categories}
                  onUpdateSettings={handleUpdateSettings}
                  onOpenAvatarPicker={() => setIsAvatarModalOpen(true)}
                  onOpenCreateCategory={() => setIsCreateCategoryModalOpen(true)}
                  onDeleteCategory={handleDeleteCategory}
                  onLogout={handleLogout}
                  onResetData={handleResetData}
                  onBack={() => setCurrentTab('home')}
                />
              )}
            </main>

            {/* Floating Frosted Glass Bottom Navigation */}
            <BottomNav
              currentTab={currentTab}
              onChangeTab={setCurrentTab}
              onOpenAdd={() => {
                setSelectedAddCategory('coffee');
                setCurrentTab('create');
              }}
            />

            {/* PIN Code Confirmation Modal for Savings Vault */}
            <PinModal
              isOpen={isPinModalOpen}
              correctPin={settings.savingsPin || '1234'}
              onClose={() => setIsPinModalOpen(false)}
              onSuccess={() => {
                setIsSavingsUnlocked(true);
                setIsPinModalOpen(false);
              }}
            />

            {/* Avatar Photo Picker Modal */}
            <AvatarPickerModal
              isOpen={isAvatarModalOpen}
              currentAvatar={settings.user.avatarUrl}
              onClose={() => setIsAvatarModalOpen(false)}
              onSelectAvatar={handleSelectAvatar}
            />

            {/* Create Category Modal */}
            <CreateCategoryModal
              isOpen={isCreateCategoryModalOpen}
              onClose={() => setIsCreateCategoryModalOpen(false)}
              onCreateCategory={handleCreateCategory}
              currencySymbol={settings.currencySymbol}
            />

            {/* Set Month Start Date Modal */}
            <CycleDayModal
              isOpen={isCycleModalOpen}
              currentDay={settings.cycleResetDay}
              onClose={() => setIsCycleModalOpen(false)}
              onSaveDay={(day) => handleUpdateSettings({ cycleResetDay: day })}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
