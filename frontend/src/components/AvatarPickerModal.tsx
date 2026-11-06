import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Image as ImageIcon, Camera } from 'lucide-react';

interface AvatarPickerModalProps {
  isOpen: boolean;
  currentAvatar: string;
  onClose: () => void;
  onSelectAvatar: (avatarUrl: string) => void;
}

const PRESET_AVATARS = [
  {
    id: 'avatar-1',
    label: 'Soft Girl',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-2',
    label: 'Smiling Cloud',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3',
    label: 'Cute Vibe',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-4',
    label: 'Minimalist',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-5',
    label: 'Peaceful',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-6',
    label: 'Creative',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  },
];

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  currentAvatar,
  onClose,
  onSelectAvatar,
}) => {
  const [selectedUrl, setSelectedUrl] = useState(currentAvatar);
  const [customUrl, setCustomUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with current avatar whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentAvatar);
      setCustomUrl('');
    }
  }, [isOpen, currentAvatar]);

  if (!isOpen) return null;

  // Handle Photo Upload from iPhone / PC
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress & resize to 300x300 square for fast loading
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        const maxDim = 320;
        canvas.width = maxDim;
        canvas.height = maxDim;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, startX, startY, size, size, 0, 0, maxDim, maxDim);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setSelectedUrl(compressedDataUrl);
          setCustomUrl('');
        }
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const finalUrl = customUrl.trim() || selectedUrl;
    if (finalUrl) {
      onSelectAvatar(finalUrl);
    }
    onClose();
  };

  return (
    <div className="pin-modal-overlay">
      <div className="avatar-modal-card">
        <button type="button" className="pin-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} color="#64748B" />
        </button>

        {/* Current / Selected Image Preview */}
        <div className="avatar-preview-top">
          <div className="avatar-preview-ring">
            <img
              src={customUrl.trim() || selectedUrl}
              alt="Preview"
              className="avatar-modal-preview"
              onError={(e) => {
                // Fallback if image link fails
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
              }}
            />
            {isProcessing && <div className="avatar-processing-spinner">⏳</div>}
          </div>
          <span className="avatar-preview-label">Active Preview</span>
        </div>

        <h3 className="avatar-modal-title">Update Profile Photo</h3>
        <p className="avatar-modal-sub">Upload from your iPhone or pick a preset</p>

        {/* Upload Button (Opens Camera or Photos) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

        <button
          type="button"
          className="upload-phone-photo-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          <Camera size={18} />
          <span>{isProcessing ? 'Processing photo...' : 'Choose from Photo Library / Camera'}</span>
        </button>

        <div className="avatar-divider-row">
          <span>or pick a preset</span>
        </div>

        {/* Preset Avatars Grid */}
        <div className="preset-avatars-grid">
          {PRESET_AVATARS.map((av) => {
            const isPicked = selectedUrl === av.url && !customUrl;
            return (
              <button
                key={av.id}
                type="button"
                className={`preset-avatar-btn ${isPicked ? 'picked' : ''}`}
                onClick={() => {
                  setSelectedUrl(av.url);
                  setCustomUrl('');
                }}
              >
                <img src={av.url} alt={av.label} className="preset-avatar-img" />
                {isPicked && (
                  <span className="picked-check">
                    <Check size={12} color="#FFF" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Image URL input */}
        <div className="custom-url-group">
          <div className="custom-url-input-wrap">
            <ImageIcon size={15} color="#64748B" />
            <input
              type="url"
              className="custom-url-input"
              placeholder="Or paste photo link (https://...)"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
            />
          </div>
        </div>

        <button type="button" className="save-avatar-action-btn" onClick={handleSave}>
          Save Profile Photo
        </button>
      </div>
    </div>
  );
};
