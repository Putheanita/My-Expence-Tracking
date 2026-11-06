import React from 'react';
import { Home, Sprout, Plus, User, ListOrdered } from 'lucide-react';
import type { ActiveTab } from '../types';

interface BottomNavProps {
  currentTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab, onOpenAdd }) => {
  return (
    <nav className="bottom-dock-container">
      <div className="bottom-dock-glass">
        {/* Home */}
        <button
          type="button"
          className={`dock-item ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => onChangeTab('home')}
          aria-label="Home"
        >
          <div className="dock-icon-wrapper">
            <Home size={20} />
          </div>
          <span className="dock-label">Home</span>
          {currentTab === 'home' && <span className="dock-active-pill" />}
        </button>

        {/* History / Sessions */}
        <button
          type="button"
          className={`dock-item ${currentTab === 'history' ? 'active' : ''}`}
          onClick={() => onChangeTab('history')}
          aria-label="History"
        >
          <div className="dock-icon-wrapper">
            <ListOrdered size={20} />
          </div>
          <span className="dock-label">Logs</span>
          {currentTab === 'history' && <span className="dock-active-pill" />}
        </button>

        {/* Center Floating Plus */}
        <button
          type="button"
          className="dock-fab-btn"
          onClick={onOpenAdd}
          aria-label="Add new expense"
        >
          <div className="fab-inner-glow">
            <Plus size={24} color="#FFFFFF" strokeWidth={2.6} />
          </div>
        </button>

        {/* Categories / Rituals */}
        <button
          type="button"
          className={`dock-item ${currentTab === 'create' ? 'active' : ''}`}
          onClick={() => onChangeTab('create')}
          aria-label="Rituals"
        >
          <div className="dock-icon-wrapper">
            <Sprout size={20} />
          </div>
          <span className="dock-label">Sessions</span>
          {currentTab === 'create' && <span className="dock-active-pill" />}
        </button>

        {/* Profile */}
        <button
          type="button"
          className={`dock-item ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => onChangeTab('profile')}
          aria-label="Profile"
        >
          <div className="dock-icon-wrapper">
            <User size={20} />
          </div>
          <span className="dock-label">You</span>
          {currentTab === 'profile' && <span className="dock-active-pill" />}
        </button>
      </div>
    </nav>
  );
};

