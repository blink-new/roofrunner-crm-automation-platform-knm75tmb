import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Download, Upload, Search } from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import KanbanBoard from './KanbanBoard';
import ListView from './ListView';
import QuickAddDealModal from './QuickAddDealModal';
import { DealFormData } from '../../types/deals';

type ViewMode = 'kanban' | 'list';

export default function OpportunitiesList() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickAdd = async (deal: DealFormData, createAnother: boolean) => {
    try {
      // Implement deal creation logic
      console.log('Creating deal:', deal);
      
      if (!createAnother) {
        setShowQuickAdd(false);
      }
    } catch (error) {
      console.error('Error creating deal:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Opportunities', path: '/opportunities', active: true }
            ]}
          />
          <h1 className="mt-2">Opportunities</h1>
        </div>

        <div className="flex gap-2">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'kanban'
                  ? 'bg-primary-50 text-primary-700 border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b -ml-px ${
                viewMode === 'list'
                  ? 'bg-primary-50 text-primary-700 border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>

          <button 
            onClick={() => setShowQuickAdd(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-secondary inline-flex items-center gap-2">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <KanbanBoard
            searchQuery={searchQuery}
            selectedOpportunities={selectedOpportunities}
            onSelectOpportunities={setSelectedOpportunities}
          />
        ) : (
          <ListView
            searchQuery={searchQuery}
            selectedOpportunities={selectedOpportunities}
            onSelectOpportunities={setSelectedOpportunities}
          />
        )}
      </Card>

      {showQuickAdd && (
        <QuickAddDealModal
          onClose={() => setShowQuickAdd(false)}
          onSave={handleQuickAdd}
        />
      )}
    </div>
  );
}