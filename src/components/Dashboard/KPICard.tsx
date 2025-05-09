import React, { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  children: ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({ title, children }) => {
  return (
    <div className="card h-full overflow-hidden hover:cursor-pointer">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-medium text-gray-700">{title}</h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default KPICard;