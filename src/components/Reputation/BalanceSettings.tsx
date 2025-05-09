import React, { useState } from 'react';
import { Card } from '../ui/card';

interface BalanceSettingsProps {
  balance: Record<string, number>;
  onChange: (balance: Record<string, number>) => void;
}

export default function BalanceSettings({ balance, onChange }: BalanceSettingsProps) {
  const [localBalance, setLocalBalance] = useState<Record<string, number>>(balance);
  
  const platforms = [
    { id: 'google', name: 'Google', logo: '/icons/google.svg' },
    { id: 'facebook', name: 'Facebook', logo: '/icons/facebook.svg' },
    { id: 'yelp', name: 'Yelp', logo: '/icons/yelp.svg' }
  ];
  
  const handleSliderChange = (platform: string, value: number) => {
    // Calculate remaining percentage
    const total = 100;
    const currentTotal = Object.entries(localBalance)
      .filter(([key]) => key !== platform)
      .reduce((sum, [_, val]) => sum + val, 0);
    
    const remaining = total - value;
    
    // Distribute remaining percentage proportionally among other platforms
    const newBalance = { ...localBalance };
    newBalance[platform] = value;
    
    const otherPlatforms = Object.keys(localBalance).filter(key => key !== platform);
    
    if (otherPlatforms.length > 0) {
      const otherTotal = currentTotal;
      
      otherPlatforms.forEach(key => {
        if (otherTotal > 0) {
          const ratio = localBalance[key] / otherTotal;
          newBalance[key] = Math.round(remaining * ratio);
        } else {
          // If other total is 0, distribute evenly
          newBalance[key] = Math.round(remaining / otherPlatforms.length);
        }
      });
      
      // Adjust for rounding errors
      const newTotal = Object.values(newBalance).reduce((sum, val) => sum + val, 0);
      if (newTotal !== 100) {
        const diff = 100 - newTotal;
        newBalance[otherPlatforms[0]] += diff;
      }
    }
    
    setLocalBalance(newBalance);
    onChange(newBalance);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Platform Balance</h3>
        <p className="text-sm text-gray-600 mb-6">
          Distribute review invitations across different platforms. This helps build a balanced online presence and prevents over-reliance on a single platform.
        </p>
        
        <div className="space-y-6">
          {platforms.map(platform => (
            <div key={platform.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={platform.logo} 
                    alt={platform.name} 
                    className="w-5 h-5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/icons/default-platform.svg';
                    }}
                  />
                  <span className="font-medium">{platform.name}</span>
                </div>
                <span className="text-sm font-medium">{localBalance[platform.id] || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localBalance[platform.id] || 0}
                onChange={(e) => handleSliderChange(platform.id, parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Distribution Preview</h4>
          <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
            {platforms.map(platform => (
              <div
                key={platform.id}
                className={`h-full ${
                  platform.id === 'google' ? 'bg-blue-500' :
                  platform.id === 'facebook' ? 'bg-indigo-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${localBalance[platform.id] || 0}%` }}
                title={`${platform.name}: ${localBalance[platform.id] || 0}%`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {platforms.map(platform => (
              <div key={platform.id} className="text-xs flex items-center">
                <div 
                  className={`w-3 h-3 rounded-full mr-1 ${
                    platform.id === 'google' ? 'bg-blue-500' :
                    platform.id === 'facebook' ? 'bg-indigo-500' :
                    'bg-red-500'
                  }`}
                ></div>
                <span>{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}