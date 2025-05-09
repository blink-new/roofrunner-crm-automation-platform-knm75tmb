import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';

interface InlineEditProps {
  value: string | number;
  type?: 'text' | 'number' | 'date' | 'select';
  options?: { value: string; label: string }[];
  onSave: (value: string | number) => Promise<void>;
  className?: string;
  formatter?: (value: any) => string;
}

export default function InlineEdit({
  value,
  type = 'text',
  options,
  onSave,
  className = '',
  formatter
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <div
        className={`cursor-pointer hover:bg-gray-50 p-1 rounded ${className}`}
        onClick={() => setIsEditing(true)}
      >
        {formatter ? formatter(value) : value}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {type === 'select' && options ? (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-md border-gray-300 text-sm py-1"
          disabled={isSaving}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-md border-gray-300 text-sm py-1"
          disabled={isSaving}
        />
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="p-1 text-green-600 hover:bg-green-50 rounded"
        >
          <Check size={16} />
        </button>
        <button
          onClick={() => {
            setEditValue(value);
            setIsEditing(false);
          }}
          disabled={isSaving}
          className="p-1 text-gray-400 hover:bg-gray-100 rounded"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}