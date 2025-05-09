import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, Share2, Pencil, Trash2, Globe, Lock,
  Users, Calendar, User, Tag, Link, Copy, X
} from 'lucide-react';
import { Card } from '../ui/card';
import { File, FileAccess } from '../../types/files';
import { FileService } from '../../lib/services/FileService';

export default function FileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareExpiry, setShareExpiry] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<{
    name: string;
    tags: string[];
    access: FileAccess;
  }>({
    name: '',
    tags: [],
    access: 'private'
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (id) {
      loadFile();
    }
  }, [id]);

  const loadFile = async () => {
    try {
      setLoading(true);
      const data = await FileService.getFile(id!);
      setFile(data);
      setEditData({
        name: data.name,
        tags: data.tags,
        access: data.access
      });
    } catch (error) {
      console.error('Error loading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!file) return;
    
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await FileService.deleteFile(file.id);
        navigate('/file-manager');
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const handleCreateShareLink = async () => {
    if (!file) return;
    
    try {
      const expiryDate = shareExpiry ? new Date(shareExpiry).toISOString() : undefined;
      const { url } = await FileService.createShareLink(file.id, expiryDate);
      setShareUrl(url);
    } catch (error) {
      console.error('Error creating share link:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (!file) return;
    
    try {
      await FileService.updateFile(file.id, editData);
      setEditMode(false);
      loadFile(); // Refresh file data
    } catch (error) {
      console.error('Error updating file:', error);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim() || editData.tags.includes(newTag.trim())) return;
    
    setEditData({
      ...editData,
      tags: [...editData.tags, newTag.trim()]
    });
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setEditData({
      ...editData,
      tags: editData.tags.filter(t => t !== tag)
    });
  };

  const accessIcons = {
    public: Globe,
    private: Lock,
    team: Users
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl bg-white flex h-[80vh] animate-pulse">
          <div className="flex-1 border-r border-gray-200">
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div className="w-80 flex flex-col">
            <div className="p-4 border-b">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex-1 p-4 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl bg-white p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">File Not Found</h2>
          <p className="text-gray-600 mb-4">The file you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/file-manager')}
            className="btn btn-primary"
          >
            Back to File Manager
          </button>
        </Card>
      </div>
    );
  }

  const AccessIcon = accessIcons[file.access];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white flex h-[80vh]">
        <div className="flex-1 border-r border-gray-200">
          <div className="h-full flex items-center justify-center bg-gray-100">
            {file.type === 'image' ? (
              <img
                src={file.url}
                alt={file.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : file.type === 'video' ? (
              <video
                src={file.url}
                controls
                className="max-w-full max-h-full"
              />
            ) : (
              <div className="text-center">
                <FileIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Preview not available</p>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-primary-600 hover:text-primary-700"
                >
                  Open file
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="w-80 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">File Details</h2>
            <button
              onClick={() => navigate('/file-manager')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {editMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full rounded-md border-gray-300"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-2">{file.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <AccessIcon size={16} />
                    <span className="capitalize">{file.access}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <a
                  href={file.url}
                  download={file.name}
                  className="btn btn-secondary flex-1 inline-flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setShowShare(true)}
                  className="btn btn-secondary flex-1 inline-flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Size</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {file.metadata.dimensions && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Dimensions</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {file.metadata.dimensions.width} × {file.metadata.dimensions.height}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">Uploaded By</label>
                  <p className="mt-1 text-sm text-gray-900">{file.uploaded_by}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Upload Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  {editMode ? (
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          className="flex-1 rounded-md border-gray-300 text-sm"
                          placeholder="Add tag"
                        />
                        <button
                          onClick={handleAddTag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {file.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {file.tags.length === 0 && (
                        <span className="text-sm text-gray-500">No tags</span>
                      )}
                    </div>
                  )}
                </div>

                {editMode && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Access</label>
                    <select
                      value={editData.access}
                      onChange={(e) => setEditData({ 
                        ...editData, 
                        access: e.target.value as FileAccess 
                      })}
                      className="mt-1 w-full rounded-md border-gray-300"
                    >
                      <option value="private">Private</option>
                      <option value="team">Team</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                )}
              </div>

              {showShare && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Share File</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration
                      </label>
                      <select
                        value={shareExpiry}
                        onChange={(e) => setShareExpiry(e.target.value)}
                        className="w-full rounded-md border-gray-300 text-sm"
                      >
                        <option value="">Never expires</option>
                        <option value={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()}>24 hours</option>
                        <option value={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}>7 days</option>
                        <option value={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}>30 days</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={handleCreateShareLink}
                      className="w-full btn btn-primary text-sm"
                    >
                      Generate Link
                    </button>
                    
                    {shareUrl && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between bg-white p-2 rounded border text-sm">
                          <span className="truncate">{shareUrl}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(shareUrl)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="btn btn-secondary flex-1 inline-flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="btn btn-primary flex-1 inline-flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="btn btn-secondary flex-1 inline-flex items-center justify-center gap-2"
                  >
                    <Pencil size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn btn-secondary flex-1 inline-flex items-center justify-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}