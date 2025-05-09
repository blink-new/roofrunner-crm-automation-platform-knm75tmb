import React, { useState } from 'react';
import { Plus, Upload, Download, Search } from 'lucide-react';
import Breadcrumbs from '../components/Navigation/Breadcrumbs';
import ContactList from '../components/Contacts/ContactList';
import ContactImport from '../components/Contacts/ContactImport';
import ContactDetail from '../components/Contacts/ContactDetail';
import ContactModal from '../components/Contacts/ContactModal';
import type { Contact } from '../types/contacts';

export default function Contacts() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewContact, setShowNewContact] = useState(false);

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleDelete = (id: string) => {
    setSelectedContacts(prev => prev.filter(cid => cid !== id));
  };

  const handleExport = async () => {
    // Implement CSV export
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Contacts', path: '/contacts', active: true }
            ]}
          />
          <h1 className="mt-2">Contacts</h1>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowImport(true)}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Upload size={16} />
            <span>Import</span>
          </button>
          
          {selectedContacts.length > 0 && (
            <button 
              onClick={handleExport}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <Download size={16} />
              <span>Export Selected</span>
            </button>
          )}

          <button 
            onClick={() => setShowNewContact(true)} 
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Contact</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ContactList
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectedContacts={selectedContacts}
              onSelectContacts={setSelectedContacts}
              searchQuery={searchQuery}
            />
          </div>
        </div>

        {selectedContact && (
          <div className="w-96">
            <ContactDetail
              contact={selectedContact}
              onClose={() => setSelectedContact(null)}
            />
          </div>
        )}
      </div>

      {showImport && (
        <ContactImport
          onClose={() => setShowImport(false)}
          onImportComplete={() => {
            setShowImport(false);
            // Refresh contact list
          }}
        />
      )}

      {showNewContact && (
        <ContactModal
          onClose={() => setShowNewContact(false)}
          onSave={async (contact, createAnother) => {
            // Implement save contact logic
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setShowNewContact(!createAnother);
          }}
        />
      )}
    </div>
  );
}