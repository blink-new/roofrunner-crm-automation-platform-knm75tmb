import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, UserPlus, X } from 'lucide-react';
import { ContactService } from '../../../lib/services/ContactService';

interface RecipientSelectorProps {
  selectedRecipients: string[];
  onChange: (recipients: string[]) => void;
}

export default function RecipientSelector({ 
  selectedRecipients, 
  onChange 
}: RecipientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectionType, setSelectionType] = useState<'individual' | 'segment'>('individual');

  useEffect(() => {
    loadContacts();
    loadSegments();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await ContactService.getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSegments = async () => {
    try {
      // In a real app, this would fetch segments from an API
      setSegments([
        { id: 'segment1', name: 'Active Customers', count: 120 },
        { id: 'segment2', name: 'Recent Leads', count: 45 },
        { id: 'segment3', name: 'Newsletter Subscribers', count: 350 }
      ]);
    } catch (error) {
      console.error('Error loading segments:', error);
    }
  };

  const handleSelectContact = (contactId: string) => {
    if (selectedRecipients.includes(contactId)) {
      onChange(selectedRecipients.filter(id => id !== contactId));
    } else {
      onChange([...selectedRecipients, contactId]);
    }
  };

  const handleSelectSegment = (segmentId: string) => {
    // In a real app, this would select all contacts in the segment
    onChange([segmentId]);
    setSelectionType('segment');
  };

  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery) return true;
    
    const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredSegments = segments.filter(segment => {
    if (!searchQuery) return true;
    return segment.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search contacts or segments..."
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

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setSelectionType('individual')}
          className={`px-4 py-2 text-sm font-medium ${
            selectionType === 'individual'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Individual Contacts
        </button>
        <button
          onClick={() => setSelectionType('segment')}
          className={`px-4 py-2 text-sm font-medium ${
            selectionType === 'segment'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Segments
        </button>
      </div>

      {selectionType === 'individual' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              Selected Contacts ({selectedRecipients.length})
            </h3>
            {selectedRecipients.length > 0 && (
              <button
                onClick={() => onChange([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedRecipients.map(id => {
              const contact = contacts.find(c => c.id === id);
              return contact ? (
                <div
                  key={id}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  <span>{contact.first_name} {contact.last_name}</span>
                  <button
                    onClick={() => handleSelectContact(id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : null;
            })}
          </div>

          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedRecipients.length === contacts.length}
                      onChange={() => {
                        if (selectedRecipients.length === contacts.length) {
                          onChange([]);
                        } else {
                          onChange(contacts.map(c => c.id));
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Loading contacts...
                    </td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map(contact => (
                    <tr
                      key={contact.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelectContact(contact.id)}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedRecipients.includes(contact.id)}
                          onChange={() => handleSelectContact(contact.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contact.first_name} {contact.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {contact.type}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSegments.map(segment => (
              <div
                key={segment.id}
                className={`border rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-colors ${
                  selectedRecipients.includes(segment.id) ? 'border-primary-500 bg-primary-50' : ''
                }`}
                onClick={() => handleSelectSegment(segment.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-primary-500" />
                    <div>
                      <h4 className="font-medium">{segment.name}</h4>
                      <p className="text-sm text-gray-500">{segment.count} contacts</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={selectedRecipients.includes(segment.id)}
                    onChange={() => handleSelectSegment(segment.id)}
                    className="rounded-full border-gray-300"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ))}

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400"
              onClick={() => {
                // Create new segment
              }}
            >
              <UserPlus size={24} className="text-gray-400 mb-2" />
              <h4 className="font-medium text-gray-700">Create New Segment</h4>
              <p className="text-sm text-gray-500 mt-1">
                Define a custom audience
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}