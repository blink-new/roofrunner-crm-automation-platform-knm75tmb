import React from 'react';
import Breadcrumbs from '../components/Navigation/Breadcrumbs';

interface BlankPageProps {
  title: string;
}

const BlankPage: React.FC<BlankPageProps> = ({ title }) => {
  const pathSegments = title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs 
          items={[
            { label: 'Home', path: '/' }, 
            { label: title, path: `/${pathSegments}`, active: true }
          ]} 
        />
        <h1 className="mt-2">{title}</h1>
      </div>
      
      <div className="card p-6 flex flex-col items-center justify-center min-h-[300px]">
        <h2 className="text-2xl font-medium text-gray-500">This is a blank {title} page</h2>
        <p className="mt-2 text-gray-400">Content for this section is under development</p>
      </div>
    </div>
  );
};

export default BlankPage;