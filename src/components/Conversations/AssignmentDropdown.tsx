import React, { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface AssignmentDropdownProps {
  assignee?: User;
  onAssign: (userId: string) => void;
}

export default function AssignmentDropdown({ assignee, onAssign }: AssignmentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [users] = useState<User[]>([
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' }
  ]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-md"
      >
        <User size={16} />
        <span className="text-sm">{assignee?.name || 'Unassigned'}</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
          <button
            onClick={() => {
              onAssign('');
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
          >
            Unassigned
          </button>
          
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => {
                onAssign(user.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
            >
              {user.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}