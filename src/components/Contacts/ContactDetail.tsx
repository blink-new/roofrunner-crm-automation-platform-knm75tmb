import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  X, Phone, Mail, Building, Tag, Clock, Edit,
  MessageSquare, Calendar, FileText, Activity,
  DollarSign, Download, Upload, Settings
} from 'lucide-react';
import type { Contact } from '../../types/contacts';
import PhoneNumberManager from './PhoneNumberManager';
import DocumentUploader from './DocumentUploader';
import NotesPanel from './NotesPanel';
import SubscriptionHistory from './SubscriptionHistory';
import InvoiceHistory from './InvoiceHistory';
import ConsentManager from './ConsentManager';

interface ContactDetailProps {
  contact: Contact;
  onClose: () => void;
  onUpdate: (updates: Partial<Contact>) => Promise<void>;
}

export default function ContactDetail({ contact, onClose, onUpdate }: ContactDetailProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'billing' | 'documents' | 'notes'>('timeline');

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Activity },
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: Upload },
    { id: 'notes', label: 'Notes', icon: MessageSquare }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'timeline':
        return (
          <div className="space-y-4">
            {/* Timeline items */}
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <PhoneNumberManager
              numbers={contact.phone_numbers || []}
              onChange={async (numbers) => {
                await onUpdate({ phone_numbers: numbers });
              }}
            />

            <ConsentManager
              contact={contact}
              onUpdate={onUpdate}
            />
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <SubscriptionHistory subscriptions={contact.subscriptions || []} />
            <InvoiceHistory invoices={contact.invoices || []} />
          </div>
        );

      case 'documents':
        return (
          <DocumentUploader
            documents={contact.documents || []}
            onUpload={async (files) => {
              // Handle document upload
            }}
            onDelete={async (id) => {
              // Handle document deletion
            }}
          />
        );

      case 'notes':
        return (
          <NotesPanel
            notes={contact.notes || []}
            onAddNote={async (content, parentId) => {
              // Handle note creation
            }}
            onEditNote={async (id, content) => {
              // Handle note update
            }}
            onDeleteNote={async (id) => {
              // Handle note deletion
            }}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
            {contact.first_name[0]}{contact.last_name[0]}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {contact.first_name} {contact.last_name}
            </h2>
            <p className="text-sm text-gray-500">{contact.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <Edit size={16} />
          </button>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-500">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}