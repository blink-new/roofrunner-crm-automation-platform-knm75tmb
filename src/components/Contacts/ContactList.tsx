import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, MoreVertical, Mail, Phone,
  Tag, Star, Clock, UserPlus, Trash, Edit, Building
} from 'lucide-react';
import { format } from 'date-fns';
import { Contact, ContactFilters } from '../../types/contacts';
import { getContacts, deleteContact } from '../../lib/api/contacts';

interface ContactListProps {
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  selectedContacts: string[];
  onSelectContacts: (ids: string[]) => void;
  searchQuery: string;
}

export default function ContactList({ 
  onEdit, 
  onDelete,
  selectedContacts,
  onSelectContacts,
  searchQuery
}: ContactListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ContactFilters>({});

  useEffect(() => {
    loadContacts();
  }, [filters, searchQuery]);

  async function loadContacts() {
    try {
      setLoading(true);
      const data = await getContacts({ ...filters, search: searchQuery });
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        setContacts(contacts.filter(c => c.id !== id));
        onDelete(id);
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const toggleSelect = (id: string) => {
    onSelectContacts(
      selectedContacts.includes(id)
        ? selectedContacts.filter(cid => cid !== id)
        : [...selectedContacts, id]
    );
  };

  const selectAll = () => {
    onSelectContacts(
      selectedContacts.length === contacts.length
        ? []
        : contacts.map(c => c.id)
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                checked={selectedContacts.length === contacts.length}
                onChange={selectAll}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tags
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Activity
            </th>
            <th className="w-20 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-4 py-3">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-8 bg-gray-200 rounded"></div>
                </td>
              </tr>
            ))
          ) : (
            contacts.map(contact => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => toggleSelect(contact.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                      {contact.first_name[0]}{contact.last_name[0]}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {contact.first_name} {contact.last_name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        {contact.email && (
                          <span className="flex items-center">
                            <Mail size={14} className="mr-1" />
                            {contact.email}
                          </span>
                        )}
                        {contact.phone && (
                          <span className="flex items-center">
                            <Phone size={14} className="mr-1" />
                            {contact.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {contact.custom_fields?.company && (
                    <div className="flex items-center text-gray-600">
                      <Building size={16} className="mr-2" />
                      <span>{contact.custom_fields.company}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-primary-100 text-primary-800">
                    {contact.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {contact.tags?.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {format(new Date(contact.updated_at), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(contact)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}