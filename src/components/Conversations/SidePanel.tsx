import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <div
      className={cn(
        'fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">{title}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-4 h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default SidePanel;