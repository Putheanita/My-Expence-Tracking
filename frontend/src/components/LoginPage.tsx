import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, User } from 'lucide-react';
import { CloudMascot } from './CloudMascot';

interface LoginPageProps {
  defaultName: string;
  onLogin: (name: string, pin: string) => Promise<boolean>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultName, onLogin }) => {
  const [name, setName] = useState(defaultName || 'Nita');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await onLogin(name.trim() || 'Nita', pin.trim());
    setLoading(false);

    if (!success) {
      setError('Incorrect passcode! (Default is 1234)');
    }
  };

  return (
    <div className="login-page-screen">
      <div className="login-top-decoration">
        <div className="cloud-aura-large" />
      </div>

      <div className="login-content-box">
        {/* Brand header with leaf */}
        <div className="login-brand-wrap">
          <div className="brand-logo-wrap">
            <div className="brand-leaf-icon">
              <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
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
          <p className="brand-subtitle">Small rituals. A brighter financial you.</p>
        </div>

        {/* Mascot Centerpiece */}
        <div className="login-mascot-wrap">
          <CloudMascot size={190} />
          <span className="login-mascot-quote">A calmer you is closer ♡</span>
        </div>

        {/* Login Form Card */}
        <form onSubmit={handleSubmit} className="login-glass-card">
          <div className="login-card-header">
            <h2 className="login-heading">Welcome Back</h2>
            <p className="login-subtext">Sign in to sync your $350 budget with iOS</p>
          </div>

          {error && <div className="login-error-pill">{error}</div>}

          {/* Name Field */}
          <div className="login-field-group">
            <div className="login-input-wrap">
              <User size={16} color="#4A8FD8" className="login-icon" />
              <input
                type="text"
                className="login-input"
                placeholder="Your Name (e.g. Nita)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Passcode Field */}
          <div className="login-field-group">
            <div className="login-input-wrap">
              <Lock size={16} color="#4A8FD8" className="login-icon" />
              <input
                type="password"
                maxLength={4}
                className="login-input"
                placeholder="4-digit Passcode (1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-submit-btn" disabled={loading}>
            <span>{loading ? 'Entering...' : 'Enter Your Space'}</span>
            <ArrowRight size={18} />
          </button>

          <div className="login-quick-hint">
            <Sparkles size={13} color="#2563EB" />
            <span>Default passcode is <strong>1234</strong></span>
          </div>
        </form>
      </div>
    </div>
  );
};

