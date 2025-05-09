import React from 'react';
import { Globe } from 'lucide-react';

interface SourcePickerProps {
  value: string;
  onChange: (source: string) => void;
  sources?: string[];
}

export default function SourcePicker({
  value,
  onChange,
  sources = [
    'Website',
    'Referral',
    'Google Ads',
    'Facebook',
    'Cold Call',
    'Trade Show',
    'Partner',
    'Other'
  ]
}: SourcePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border-gray-300"
      >
        <option value="">Select source...</option>
        {sources.map((source) => (
          <option key={source} value={source}>{source}</option>
        ))}
      </select>
    </div>
  );
}