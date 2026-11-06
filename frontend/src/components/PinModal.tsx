import React, { useState } from 'react';
import { Lock, X, Delete } from 'lucide-react';

interface PinModalProps {
  correctPin: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  correctPin,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (enteredPin.length >= 4) return;
    const newPin = enteredPin + num;
    setEnteredPin(newPin);
    setIsError(false);

    if (newPin.length === 4) {
      if (newPin === correctPin) {
        setTimeout(() => {
          onSuccess();
          setEnteredPin('');
        }, 150);
      } else {
        setTimeout(() => {
          setIsError(true);
          setEnteredPin('');
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  return (
    <div className="pin-modal-overlay">
      <div className={`pin-modal-card ${isError ? 'shake' : ''}`}>
        <button type="button" className="pin-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} color="#64748B" />
        </button>

        <div className="pin-icon-wrapper">
          <Lock size={24} color="#0D9488" />
        </div>

        <h3 className="pin-title">Savings Vault Lock</h3>
        <p className="pin-subtitle">
          {isError ? (
            <span className="pin-error-text">Incorrect code! Default is 1234</span>
          ) : (
            'Enter 4-digit code to view savings details'
          )}
        </p>

        {/* 4 PIN Dots */}
        <div className="pin-dots-row">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = idx < enteredPin.length;
            return (
              <span
                key={idx}
                className={`pin-dot ${isFilled ? 'filled' : ''} ${isError ? 'error' : ''}`}
              />
            );
          })}
        </div>

        {/* Numeric Keypad */}
        <div className="pin-keypad-grid">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              className="keypad-digit-btn"
              onClick={() => handleKeyPress(digit)}
            >
              {digit}
            </button>
          ))}
          <div className="keypad-empty" />
          <button
            type="button"
            className="keypad-digit-btn"
            onClick={() => handleKeyPress('0')}
          >
            0
          </button>
          <button
            type="button"
            className="keypad-digit-btn delete-key"
            onClick={handleDelete}
            aria-label="Delete"
          >
            <Delete size={18} />
          </button>
        </div>

        <div className="pin-hint-box">
          <span>Hint: Default passcode is <strong>1234</strong></span>
        </div>
      </div>
    </div>
  );
};

