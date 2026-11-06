import React from 'react';
import { Bell, Search, Camera } from 'lucide-react';
import type { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  onAvatarClick: () => void;
  onNotificationClick?: () => void;
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onAvatarClick,
  onNotificationClick,
  onSearchClick,
}) => {
  return (
    <header className="app-header">
      {/* Top Profile & Greeting Row */}
      <div className="header-top-row">
        <div className="header-user-info">
          <div className="avatar-wrapper clickable-avatar" onClick={onAvatarClick} title="Tap to update image">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
              alt={user.name || 'Profile'}
              className="user-avatar"
            />
            <span className="online-badge" />
            <div className="avatar-camera-overlay">
              <Camera size={11} color="#FFFFFF" />
            </div>
          </div>
          <div className="greeting-text">
            <span className="greeting-sub">Good morning, {user.name || 'Nita'}</span>
            <span className="greeting-main">A calmer wallet is closer ♡</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="glass-icon-btn notification-btn"
            onClick={onNotificationClick}
            aria-label="Notifications"
          >
            <Bell size={18} color="#2A4B6B" />
            <span className="pulse-dot" />
          </button>
          <button
            type="button"
            className="glass-icon-btn"
            onClick={onSearchClick}
            aria-label="Search"
          >
            <Search size={18} color="#2A4B6B" />
          </button>
        </div>
      </div>

      {/* Brand Title Row */}
      <div className="brand-header">
        <div className="brand-logo-wrap">
          <div className="brand-leaf-icon">
            <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
              <path
                d="M20 32C20 32 10 26 10 18C10 12.5 14.5 8 20 8C25.5 8 30 12.5 30 18C30 26 20 32 20 32Z"
                stroke="#2B506E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M20 14V26" stroke="#2B506E" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 20C17 22 20 22 20 22" stroke="#2B506E" strokeWidth="2" strokeLinecap="round" />
              <path d="M26 20C23 22 20 22 20 22" stroke="#2B506E" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="brand-title">Recenter</h1>
        </div>
        <p className="brand-subtitle">Mindful spending. A brighter you.</p>
      </div>
    </header>
  );
};
