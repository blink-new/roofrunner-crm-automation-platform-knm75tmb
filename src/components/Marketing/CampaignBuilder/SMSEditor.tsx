import React, { useState, useEffect } from 'react';
import { SMSService } from '../../../lib/services/SMSService';

interface SMSEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SMSEditor({ value, onChange }: SMSEditorProps) {
  const [charCount, setCharCount] = useState(0);
  const [segmentCount, setSegmentCount] = useState(1);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setCharCount(value.length);
    
    // Simple segment calculation (actual calculation is more complex with Unicode)
    const segments = Math.ceil(value.length / 160);
    setSegmentCount(segments);
    
    // Validate after a delay
    const timer = setTimeout(() => {
      validateSMS();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [value]);

  const validateSMS = async () => {
    if (!value.trim()) return;
    
    try {
      setIsValidating(true);
      const result = await SMSService.validateTemplate(value);
      setSegmentCount(result.segment_count);
    } catch (error) {
      console.error('Error validating SMS:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary-500"
        placeholder="Type your SMS message here..."
      />
      <div className="bg-gray-50 border-t border-gray-300 p-2 flex justify-between items-center text-sm text-gray-500">
        <div>
          {isValidating ? (
            <span>Validating...</span>
          ) : (
            <span>
              {charCount} characters • {segmentCount} {segmentCount === 1 ? 'segment' : 'segments'}
            </span>
          )}
        </div>
        <div>
          <button
            onClick={() => {
              // Insert placeholder
              onChange(value + ' {{contact.first_name}}');
            }}
            className="text-primary-600 hover:text-primary-700"
          >
            Insert Placeholder
          </button>
        </div>
      </div>
    </div>
  );
}