import React from 'react';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';

interface ComplianceBannerProps {
  issues: {
    type: 'error' | 'warning';
    message: string;
  }[];
}

export default function ComplianceBanner({ issues }: ComplianceBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible || issues.length === 0) {
    return null;
  }

  const hasErrors = issues.some(issue => issue.type === 'error');

  return (
    <div className={`rounded-lg p-4 ${hasErrors ? 'bg-red-50' : 'bg-yellow-50'}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle 
            className={`h-5 w-5 ${hasErrors ? 'text-red-400' : 'text-yellow-400'}`} 
            aria-hidden="true" 
          />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${hasErrors ? 'text-red-800' : 'text-yellow-800'}`}>
            {hasErrors ? 'Compliance Issues Detected' : 'Compliance Warnings'}
          </h3>
          <div className={`mt-2 text-sm ${hasErrors ? 'text-red-700' : 'text-yellow-700'}`}>
            <ul className="list-disc pl-5 space-y-1">
              {issues.map((issue, index) => (
                <li key={index}>{issue.message}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <button
                type="button"
                className={`rounded-md px-2 py-1.5 text-sm font-medium ${
                  hasErrors 
                    ? 'bg-red-50 text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50' 
                    : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50'
                }`}
              >
                <span className="flex items-center gap-1">
                  <span>Learn more</span>
                  <ExternalLink size={12} />
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className={`ml-3 rounded-md px-2 py-1.5 text-sm font-medium ${
                  hasErrors 
                    ? 'bg-red-50 text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50' 
                    : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50'
                }`}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}