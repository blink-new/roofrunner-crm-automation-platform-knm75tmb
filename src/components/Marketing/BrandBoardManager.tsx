import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Check, Image, Palette } from 'lucide-react';
import { Card } from '../ui/card';
import { BrandBoardService } from '../../lib/services/BrandBoardService';

interface BrandBoardManagerProps {
  onClose?: () => void;
  onSelect?: (boardId: string) => void;
  standalone?: boolean;
}

export default function BrandBoardManager({
  onClose,
  onSelect,
  standalone = false
}: BrandBoardManagerProps) {
  const [brandBoards, setBrandBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [editingBoard, setEditingBoard] = useState<string | null>(null);

  useEffect(() => {
    loadBrandBoards();
  }, []);

  const loadBrandBoards = async () => {
    try {
      setLoading(true);
      const data = await BrandBoardService.getBrandBoards();
      setBrandBoards(data);
    } catch (error) {
      console.error('Error loading brand boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await BrandBoardService.setDefaultBrandBoard(id);
      loadBrandBoards();
    } catch (error) {
      console.error('Error setting default brand board:', error);
    }
  };

  const handleDeleteBoard = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this brand board?')) {
      try {
        await BrandBoardService.deleteBrandBoard(id);
        loadBrandBoards();
      } catch (error) {
        console.error('Error deleting brand board:', error);
      }
    }
  };

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Brand Boards</h3>
        <button
          onClick={() => setShowNewBoard(true)}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Brand Board</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </Card>
          ))
        ) : brandBoards.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No brand boards found. Create your first brand board to get started.
          </div>
        ) : (
          brandBoards.map(board => (
            <Card
              key={board.id}
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                board.is_default ? 'border-primary-500' : ''
              }`}
              onClick={() => onSelect && onSelect(board.id)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{board.name}</h3>
                  <div className="flex items-center gap-1">
                    {board.is_default ? (
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleSetDefault(board.id, e)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Set as default"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBoard(board.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteBoard(board.id, e)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {board.description || 'No description'}
                </p>
                <div className="flex items-center gap-2">
                  {/* Color swatches */}
                  {board.colors && (
                    <>
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: board.colors.primary }}
                        title="Primary color"
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: board.colors.secondary }}
                        title="Secondary color"
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: board.colors.accent }}
                        title="Accent color"
                      />
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div className="space-y-6">
        <h1>Brand Boards</h1>
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Brand Boards</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </Card>
    </div>
  );
}