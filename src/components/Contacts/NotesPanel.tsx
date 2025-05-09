import React, { useState } from 'react';
import { format } from 'date-fns';
import { Reply, Edit2, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';

interface Note {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  parent_id?: string;
  replies?: Note[];
}

interface NotesPanelProps {
  notes: Note[];
  onAddNote: (content: string, parentId?: string) => Promise<void>;
  onEditNote: (id: string, content: string) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
}

export default function NotesPanel({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote
}: NotesPanelProps) {
  const [newNote, setNewNote] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    await onAddNote(newNote, replyTo || undefined);
    setNewNote('');
    setReplyTo(null);
  };

  const handleEdit = async (id: string) => {
    if (!editContent.trim()) return;
    await onEditNote(id, editContent);
    setEditingNote(null);
    setEditContent('');
  };

  const renderNote = (note: Note, level = 0) => (
    <div key={note.id} className="space-y-4" style={{ marginLeft: `${level * 24}px` }}>
      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-shrink-0">
          {note.user.avatar ? (
            <img
              src={note.user.avatar}
              alt={note.user.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
              {note.user.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-medium">{note.user.name}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingNote(note.id);
                  setEditContent(note.content);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {editingNote === note.id ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full rounded-md border-gray-300"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingNote(null)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEdit(note.id)}
                  className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
              <button
                onClick={() => setReplyTo(note.id)}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
              >
                <Reply size={14} />
                <span>Reply</span>
              </button>
            </>
          )}
        </div>
      </div>

      {note.replies?.map((reply) => renderNote(reply, level + 1))}

      {replyTo === note.id && (
        <div className="space-y-2" style={{ marginLeft: '24px' }}>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a reply..."
            className="w-full rounded-md border-gray-300"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setReplyTo(null)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600"
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Notes</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note..."
            className="w-full rounded-md border-gray-300"
            rows={4}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!newNote.trim()}
            >
              Add Note
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {notes.filter(n => !n.parent_id).map(note => renderNote(note))}
        </div>
      </div>
    </Card>
  );
}