import React, { useState } from 'react';
import { Calendar, X, Check, Sparkles } from 'lucide-react';
import { getCurrentBudgetCycle } from '../utils/cycle';

interface CycleDayModalProps {
  currentDay: number;
  isOpen: boolean;
  onClose: () => void;
  onSaveDay: (newDay: number) => void;
}

export const CycleDayModal: React.FC<CycleDayModalProps> = ({
  currentDay,
  isOpen,
  onClose,
  onSaveDay,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(currentDay || 5);
  const presets = [1, 5, 10, 15, 20, 25];

  if (!isOpen) return null;

  const previewCycle = getCurrentBudgetCycle(selectedDay);

  const handleSave = () => {
    if (selectedDay >= 1 && selectedDay <= 28) {
      onSaveDay(selectedDay);
      onClose();
    } else {
      alert('Please select a day between 1 and 28');
    }
  };

  return (
    <div className="pin-modal-overlay">
      <div className="cycle-modal-card">
        <button type="button" className="pin-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} color="#64748B" />
        </button>

        <div className="cycle-modal-icon-wrap">
          <Calendar size={24} color="#2563EB" />
        </div>

        <h3 className="cycle-modal-title">Set Month Start Date</h3>
        <p className="cycle-modal-subtitle">
          Choose which day of each month your salary and budget reset.
        </p>

        {/* Quick Presets */}
        <div className="cycle-presets-label">Popular Start Days:</div>
        <div className="cycle-presets-grid">
          {presets.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                type="button"
                className={`cycle-preset-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                <span className="preset-day-number">{day}</span>
                <span className="preset-day-sub">
                  {day === 1 ? '1st (Month)' : day === 5 ? '5th (Salary)' : `${day}th`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Input */}
        <div className="cycle-custom-row">
          <span className="cycle-custom-label">Custom day (1–28):</span>
          <div className="cycle-input-wrapper">
            <span className="cycle-prefix">Day</span>
            <input
              type="number"
              min="1"
              max="28"
              value={selectedDay}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) setSelectedDay(Math.min(28, Math.max(1, val)));
              }}
              className="cycle-day-input"
            />
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="cycle-preview-box">
          <div className="preview-pill">
            <Sparkles size={13} color="#2563EB" />
            <span>Cycle Preview</span>
          </div>
          <div className="preview-cycle-label">{previewCycle.label}</div>
          <div className="preview-cycle-days">
            Runs from day {selectedDay} to day {selectedDay} of next month • {previewCycle.daysRemaining} days remaining in current cycle
          </div>
        </div>

        {/* Save Button */}
        <button type="button" className="cycle-save-btn" onClick={handleSave}>
          <Check size={16} strokeWidth={2.5} />
          <span>Set Start Date to Day {selectedDay}</span>
        </button>
      </div>
    </div>
  );
};

