import React from 'react';
import KPICard from './KPICard';
import OpportunityStatus from './OpportunityStatus';
import OpportunityValue from './OpportunityValue';
import ConversionRate from './ConversionRate';
import Funnel from './Funnel';

const KPIRow: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
      <KPICard title="Opportunity Status">
        <OpportunityStatus />
      </KPICard>
      
      <KPICard title="Opportunity Value">
        <OpportunityValue />
      </KPICard>
      
      <KPICard title="Conversion Rate">
        <ConversionRate />
      </KPICard>
      
      <KPICard title="Funnel">
        <Funnel />
      </KPICard>
    </div>
  );
};

export default KPIRow;