import React, { useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import Breadcrumbs from '../components/Navigation/Breadcrumbs';
import ThreadList from '../components/Conversations/ThreadList';
import MessageDetail from '../components/Conversations/MessageDetail';
import ContactProfile from '../components/Conversations/ContactProfile';
import { Thread } from '../types/conversations';
import { generateThreads } from '../utils/mockConversations';

const Conversations: React.FC = () => {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [threads] = useState(() => generateThreads(20));
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreads, setSelectedThreads] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs 
            items={[
              { label: 'Home', path: '/' },
              { label: 'Conversations', path: '/conversations', active: true }
            ]}
          />
          <h1 className="mt-2">Conversations</h1>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setShowFilterPanel(true)}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Filter size={16} />
            <span>Filter</span>
          </button>
          
          <button className="btn btn-primary inline-flex items-center gap-2">
            <Plus size={16} />
            <span>New Conversation</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter h-[calc(100vh-240px)] lg:h-[calc(100vh-200px)]">
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <ThreadList 
            threads={threads}
            selectedThread={selectedThread}
            onThreadSelect={setSelectedThread}
            showFilterPanel={showFilterPanel}
            onCloseFilterPanel={() => setShowFilterPanel(false)}
            searchQuery={searchQuery}
            selectedThreads={selectedThreads}
            onSelectThreads={setSelectedThreads}
          />
        </div>
        
        <div className="col-span-12 lg:col-span-5 flex flex-col mt-gutter lg:mt-0">
          <MessageDetail 
            thread={selectedThread}
            showProfile={showProfile}
            onToggleProfile={() => setShowProfile(!showProfile)} 
          />
        </div>
        
        {showProfile && (
          <div className="col-span-12 lg:col-span-3 flex flex-col mt-gutter lg:mt-0">
            <ContactProfile contact={selectedThread?.contact ?? null} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;