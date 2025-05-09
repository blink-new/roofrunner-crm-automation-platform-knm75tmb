import React, { useState } from 'react';
import { Card } from '../ui/card';
import { X, Users, Mail, Link, Copy, Check } from 'lucide-react';

interface ShareDashboardModalProps {
  dashboardId: string;
  dashboardName: string;
  permissions: {
    view: string[];
    edit: string[];
  };
  onClose: () => void;
  onSave: (permissions: { view: string[]; edit: string[] }) => Promise<void>;
}

export default function ShareDashboardModal({
  dashboardId,
  dashboardName,
  permissions,
  onClose,
  onSave
}: ShareDashboardModalProps) {
  const [updatedPermissions, setUpdatedPermissions] = useState(permissions);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [users] = useState([
    { id: 'user1', name: 'John Doe', email: 'john@example.com' },
    { id: 'user2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com' }
  ]);

  const shareUrl = `https://app.example.com/dashboard/${dashboardId}`;

  const handleAddUser = () => {
    if (!email) return;

    const user = users.find(u => u.email === email);
    if (!user) return;

    if (permission === 'view') {
      if (!updatedPermissions.view.includes(user.id)) {
        setUpdatedPermissions({
          ...updatedPermissions,
          view: [...updatedPermissions.view, user.id]
        });
      }
    } else {
      if (!updatedPermissions.edit.includes(user.id)) {
        setUpdatedPermissions({
          ...updatedPermissions,
          edit: [...updatedPermissions.edit, user.id]
        });
      }
    }

    setEmail('');
  };

  const handleRemoveUser = (userId: string, type: 'view' | 'edit') => {
    if (type === 'view') {
      setUpdatedPermissions({
        ...updatedPermissions,
        view: updatedPermissions.view.filter(id => id !== userId)
      });
    } else {
      setUpdatedPermissions({
        ...updatedPermissions,
        edit: updatedPermissions.edit.filter(id => id !== userId)
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(updatedPermissions);
      onClose();
    } catch (error) {
      console.error('Error saving permissions:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Share Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Share "{dashboardName}" with others
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-md border-gray-300"
              />
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                className="rounded-md border-gray-300"
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
              </select>
              <button
                onClick={handleAddUser}
                className="btn btn-primary"
                disabled={!email}
              >
                Share
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Users size={16} />
              <span>People with access</span>
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500">Editors</h4>
                {updatedPermissions.edit.length > 0 ? (
                  updatedPermissions.edit.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return (
                      <div key={userId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                            {user?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveUser(userId, 'edit')}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No editors</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500">Viewers</h4>
                {updatedPermissions.view.length > 0 ? (
                  updatedPermissions.view.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return (
                      <div key={userId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                            {user?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveUser(userId, 'view')}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No viewers</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Link size={16} />
              <span>Share link</span>
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 rounded-md border-gray-300 bg-gray-50"
              />
              <button
                onClick={copyLink}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            disabled={isSaving}
          >
            Save
          </button>
        </div>
      </Card>
    </div>
  );
}