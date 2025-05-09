import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, Calendar, CreditCard, FileText, HardHat, Home, 
  MessageSquare, Users, Briefcase, DollarSign, Bot, Megaphone, 
  Zap, Globe, FolderOpen, Star, BarChart2, Ruler, FileCheck, 
  Package, Clipboard, LifeBuoy, Settings, ChevronLeft, ChevronRight,
  Camera
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const navItems = {
  manage: [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Conversations', icon: MessageSquare, path: '/conversations' },
    { name: 'Calendars', icon: Calendar, path: '/calendars' },
    { name: 'Contacts', icon: Users, path: '/contacts' },
    { name: 'Jobs', icon: HardHat, path: '/jobs' },
    { name: 'Payments', icon: CreditCard, path: '/payments' },
  ],
  tools: [
    { name: 'AI Agents', icon: Bot, path: '/ai-agents' },
    { name: 'Job Cam', icon: Camera, path: '/job-cam' },
    { name: 'Instant Estimator', icon: DollarSign, path: '/instant-estimator' },
    { name: 'Measurements', icon: Ruler, path: '/measurements' },
    { name: 'Proposals', icon: FileCheck, path: '/proposals' },
    { name: 'Material Orders', icon: Package, path: '/material-orders' },
    { name: 'Work Orders', icon: Clipboard, path: '/work-orders' },
  ],
  marketing: [
    { name: 'Automation', icon: Zap, path: '/automation' },
    { name: 'Opportunities', icon: BarChart, path: '/opportunities' },
    { name: 'Marketing', icon: Megaphone, path: '/marketing' },
    { name: 'File Manager', icon: FolderOpen, path: '/file-manager' },
    { name: 'Reputation', icon: Star, path: '/reputation' },
    { name: 'Reporting', icon: BarChart2, path: '/reporting' },
    { name: 'Sites', icon: Globe, path: '/sites' },
  ],
  system: [
    { name: 'Support', icon: LifeBuoy, path: '/support' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ]
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  
  const renderNavSection = (items: typeof navItems.manage, label?: string) => (
    <div className="mb-6">
      {!collapsed && label && (
        <h3 className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </h3>
      )}
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''} ${
                  collapsed ? 'justify-center px-2' : ''
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon size={collapsed ? 22 : 20} className={collapsed ? '' : 'nav-link-icon'} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
  
  return (
    <aside 
      className={`bg-sidebar h-screen transition-all duration-300 ease-in-out ${
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-white bg-primary-500 h-8 w-8 flex items-center justify-center rounded-md mr-3">
              <HardHat size={20} />
            </div>
            {!collapsed && (
              <h1 className="font-bold text-lg text-white">RoofRunner</h1>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <nav>
            {renderNavSection(navItems.manage, 'Manage')}
            {renderNavSection(navItems.tools, 'Tools')}
            {renderNavSection(navItems.marketing, 'Marketing')}
            <div className="border-t border-sidebar-hover my-4"></div>
            {renderNavSection(navItems.system)}
          </nav>
        </div>
        
        <div className="p-4 border-t border-sidebar-hover flex justify-center">
          <button 
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;