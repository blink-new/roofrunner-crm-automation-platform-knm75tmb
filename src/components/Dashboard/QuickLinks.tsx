import React from 'react';
import { UserPlus, HardHat, Calendar } from 'lucide-react';

const QuickLinks: React.FC = () => {
  const links = [
    {
      id: 1,
      title: 'New Lead',
      icon: UserPlus,
      color: 'bg-primary-100 text-primary-700',
      path: '/contacts',
    },
    {
      id: 2,
      title: 'New Job',
      icon: HardHat,
      color: 'bg-secondary-100 text-secondary-700',
      path: '/jobs',
    },
    {
      id: 3,
      title: 'Calendar',
      icon: Calendar,
      color: 'bg-accent-100 text-accent-700',
      path: '/calendars',
    },
  ];
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {links.map(link => (
        <a 
          key={link.id}
          href={link.path}
          className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className={`p-3 rounded-full ${link.color} mb-3`}>
            <link.icon size={24} />
          </div>
          <span className="text-sm font-medium text-gray-700">{link.title}</span>
        </a>
      ))}
    </div>
  );
};

export default QuickLinks;