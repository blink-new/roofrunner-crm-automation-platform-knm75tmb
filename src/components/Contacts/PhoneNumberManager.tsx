import React, { useState } from 'react';
import { Plus, X, Phone, Star } from 'lucide-react';
import { Card } from '../ui/card';

interface PhoneNumber {
  id?: string;
  number: string;
  label: string;
  is_primary: boolean;
  verified?: boolean;
}

interface PhoneNumberManagerProps {
  numbers: PhoneNumber[];
  onChange: (numbers: PhoneNumber[]) => void;
}

export default function PhoneNumberManager({ numbers, onChange }: PhoneNumberManagerProps) {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>(numbers);

  const addPhoneNumber = () => {
    setPhoneNumbers([
      ...phoneNumbers,
      { number: '', label: 'mobile', is_primary: phoneNumbers.length === 0 }
    ]);
  };

  const removePhoneNumber = (index: number) => {
    const newNumbers = phoneNumbers.filter((_, i) => i !== index);
    if (newNumbers.length > 0 && !newNumbers.some(n => n.is_primary)) {
      newNumbers[0].is_primary = true;
    }
    setPhoneNumbers(newNumbers);
    onChange(newNumbers);
  };

  const updatePhoneNumber = (index: number, updates: Partial<PhoneNumber>) => {
    const newNumbers = [...phoneNumbers];
    newNumbers[index] = { ...newNumbers[index], ...updates };
    
    if (updates.is_primary) {
      newNumbers.forEach((num, i) => {
        if (i !== index) num.is_primary = false;
      });
    }
    
    setPhoneNumbers(newNumbers);
    onChange(newNumbers);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Phone Numbers</h3>
          {phoneNumbers.length < 11 && (
            <button
              onClick={addPhoneNumber}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Number</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {phoneNumbers.map((phone, index) => (
            <div key={index} className="flex items-center gap-3">
              <select
                value={phone.label}
                onChange={(e) => updatePhoneNumber(index, { label: e.target.value })}
                className="w-32 rounded-md border-gray-300"
              >
                <option value="mobile">Mobile</option>
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>

              <div className="flex-1 relative">
                <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone.number}
                  onChange={(e) => updatePhoneNumber(index, { number: e.target.value })}
                  className="w-full pl-10 rounded-md border-gray-300"
                  placeholder="Enter phone number"
                />
              </div>

              <button
                onClick={() => updatePhoneNumber(index, { is_primary: true })}
                className={`p-2 rounded-full ${
                  phone.is_primary
                    ? 'text-yellow-500 bg-yellow-50'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                title={phone.is_primary ? 'Primary number' : 'Make primary'}
              >
                <Star size={16} />
              </button>

              <button
                onClick={() => removePhoneNumber(index)}
                className="p-2 text-gray-400 hover:text-gray-600"
                disabled={phoneNumbers.length === 1}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}