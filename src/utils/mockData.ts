// Mock data for dashboard components
// In a production app, this would be replaced with API calls

export const opportunityStatusData = {
  total: 140,
  segments: [
    { label: 'Open', value: 80, color: '#60A5FA' }, // primary-400
    { label: 'Lost', value: 30, color: '#EF4444' }, // error-500
    { label: 'Won', value: 30, color: '#22C55E' },  // success-500
  ],
};

export const opportunityValueData = {
  total: 87950, // $87.95K
  segments: [
    { label: 'Open', value: 45000, color: '#60A5FA' }, // primary-400
    { label: 'Lost', value: 15000, color: '#EF4444' }, // error-500
    { label: 'Won', value: 27950, color: '#22C55E' },  // success-500
  ],
};

export const stageDistributionData = [
  { stage: 'Lead', count: 95, color: '#93C5FD' },     // primary-300
  { stage: 'Qualified', count: 65, color: '#60A5FA' }, // primary-400
  { stage: 'Proposal', count: 45, color: '#3B82F6' },  // primary-500
  { stage: 'Negotiation', count: 30, color: '#2563EB' }, // primary-600
  { stage: 'Closed', count: 20, color: '#1D4ED8' },    // primary-700
];

export const revenueTrendData = [
  { month: 'Jan', value: 15000 }, // $15K
  { month: 'Feb', value: 25000 }, // $25K
  { month: 'Mar', value: 18000 }, // $18K
  { month: 'Apr', value: 30000 }, // $30K
  { month: 'May', value: 22000 }, // $22K
  { month: 'Jun', value: 38000 }, // $38K
];

export const leadSourcesData = [
  { source: 'Website', value: 35, color: '#3B82F6' },  // primary-500
  { source: 'Referral', value: 25, color: '#14B8A6' }, // secondary-500
  { source: 'Google', value: 20, color: '#22C55E' },   // success-500
  { source: 'Facebook', value: 15, color: '#F97316' }, // accent-500
  { source: 'Other', value: 5, color: '#9CA3AF' },     // gray-400
];

export const recentTasksData = [
  {
    id: 1,
    title: 'Follow up with John Doe about roof inspection',
    status: 'pending',
    dueDate: 'Today',
  },
  {
    id: 2,
    title: 'Schedule installation for 123 Main St',
    status: 'completed',
    dueDate: 'Yesterday',
  },
  {
    id: 3,
    title: 'Send estimate to Smith family',
    status: 'pending',
    dueDate: 'Tomorrow',
  },
  {
    id: 4,
    title: 'Order materials for Johnson project',
    status: 'pending',
    dueDate: 'Aug 15',
  },
  {
    id: 5,
    title: 'Review marketing campaign results',
    status: 'completed',
    dueDate: 'Aug 10',
  },
];

export const quickLinksData = [
  {
    id: 1,
    title: 'New Lead',
    icon: 'UserPlus',
    color: 'bg-primary-100 text-primary-700',
    path: '/contacts',
  },
  {
    id: 2,
    title: 'New Job',
    icon: 'HardHat',
    color: 'bg-secondary-100 text-secondary-700',
    path: '/jobs',
  },
  {
    id: 3,
    title: 'Calendar',
    icon: 'Calendar',
    color: 'bg-accent-100 text-accent-700',
    path: '/calendars',
  },
];