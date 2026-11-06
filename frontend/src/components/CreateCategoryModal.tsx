import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { CategoryPayType } from '../types';
import { toBaseUSD, KHR_RATE } from '../utils/currency';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory: (cat: {
    name: string;
    monthlyTarget: number;
    emoji: string;
    tagline: string;
    payType: CategoryPayType;
  }) => void;
  currencySymbol: string;
}

const EMOJI_OPTIONS = ['💪', '🐱', '👗', '📚', '🎬', '🍔', '🎁', '✈️', '💊', '🌿', '🎮', '🚕', '💅', '🧘', '🍿'];

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onCreateCategory,
  currencySymbol,
}) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [tagline, setTagline] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [payType, setPayType] = useState<CategoryPayType>('flexible');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = parseFloat(target);
    if (!name.trim() || isNaN(parsedTarget) || parsedTarget <= 0) return;

    const baseTarget = toBaseUSD(parsedTarget, currencySymbol);

    onCreateCategory({
      name: name.trim(),
      monthlyTarget: baseTarget,
      emoji,
      tagline: tagline.trim() || 'Custom budget',
      payType,
    });

    setName('');
    setTarget('');
    setTagline('');
    onClose();
  };

  return (
    <div className="pin-modal-overlay">
      <div className="category-modal-card">
        <button type="button" className="pin-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} color="#64748B" />
        </button>

        <div className="category-modal-icon-bubble">
          <span className="selected-emoji-large">{emoji}</span>
        </div>

        <h3 className="category-modal-title">Create New Category</h3>
        <p className="category-modal-sub">Set category name & monthly target</p>

        <form onSubmit={handleSubmit} className="category-modal-form">
          {/* Name */}
          <div className="cat-form-group">
            <label className="cat-form-label">Category Name</label>
            <input
              type="text"
              className="cat-modal-input"
              placeholder="e.g. Gym, Snacks, Pet Care"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Monthly Target */}
          <div className="cat-form-group">
            <label className="cat-form-label">Monthly Target Limit</label>
            <div className="cat-target-input-wrap">
              <span className="cat-currency-prefix">{currencySymbol}</span>
              <input
                type="number"
                step={currencySymbol === '៛' ? '1000' : '1'}
                min={currencySymbol === '៛' ? '1000' : '0.5'}
                className="cat-modal-input cat-target-input"
                placeholder={currencySymbol === '៛' ? '80000' : '20.00'}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
              />
            </div>
            {target && !isNaN(parseFloat(target)) && parseFloat(target) > 0 && (
              <div className="live-exchange-pill" style={{ marginTop: 6 }}>
                💱 {currencySymbol === '៛'
                  ? `≈ $${(parseFloat(target) / KHR_RATE).toFixed(2)} USD`
                  : `≈ ${(Math.round(parseFloat(target) * KHR_RATE)).toLocaleString()} ៛ KHR`}
              </div>
            )}
          </div>

          {/* Tagline */}
          <div className="cat-form-group">
            <label className="cat-form-label">Short Tagline</label>
            <input
              type="text"
              className="cat-modal-input"
              placeholder="e.g. Weekly workouts & wellness"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          {/* Emoji Picker */}
          <div className="cat-form-group">
            <label className="cat-form-label">Choose Emoji Icon</label>
            <div className="emoji-picker-row">
              {EMOJI_OPTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  className={`emoji-btn ${emoji === em ? 'active' : ''}`}
                  onClick={() => setEmoji(em)}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Type */}
          <div className="cat-form-group">
            <label className="cat-form-label">Payment Behavior</label>
            <div className="pay-type-toggle-row">
              <button
                type="button"
                className={`pay-type-btn ${payType === 'flexible' ? 'active' : ''}`}
                onClick={() => setPayType('flexible')}
              >
                <span>Flexible (Input until target)</span>
              </button>
              <button
                type="button"
                className={`pay-type-btn ${payType === 'fixed-one-time' ? 'active' : ''}`}
                onClick={() => setPayType('fixed-one-time')}
              >
                <span>Fixed 1-Time Lump Sum</span>
              </button>
            </div>
          </div>

          <button type="submit" className="save-cat-submit-btn">
            <Plus size={16} />
            <span>Create Category</span>
          </button>
        </form>
      </div>
    </div>
  );
};
