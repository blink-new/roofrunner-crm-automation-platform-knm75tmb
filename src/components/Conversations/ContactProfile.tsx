import React, { useState } from 'react';
import { Phone, Mail, Plus, ExternalLink, Bot } from 'lucide-react';
import { Contact } from '../../types/conversations';
import { cn } from '../../utils/cn';

interface ContactProfileProps {
  contact: Contact | null;
}

const ContactProfile: React.FC<ContactProfileProps> = ({ contact }) => {
  const [expandedPanels, setExpandedPanels] = useState<string[]>(['contact']);

  const togglePanel = (panelId: string) => {
    setExpandedPanels(prev =>
      prev.includes(panelId)
        ? prev.filter(id => id !== panelId)
        : [...prev, panelId]
    );
  };

  if (!contact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 text-center">Select a conversation to view contact details</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl font-medium mb-3">
            {contact.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{contact.name}</h2>
            <ExternalLink size={16} className="text-gray-400" />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Phone size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Mail size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-4">
          <div className={cn(
            "border border-gray-200 rounded-lg overflow-hidden",
            expandedPanels.includes('contact') ? 'pb-4' : ''
          )}>
            <button
              onClick={() => togglePanel('contact')}
              className="flex items-center justify-between w-full p-4 text-left bg-gray-50"
            >
              <span className="font-medium">Contact</span>
              <span className={cn(
                "transform transition-transform",
                expandedPanels.includes('contact') ? 'rotate-180' : ''
              )}>▼</span>
            </button>
            {expandedPanels.includes('contact') && (
              <div className="px-4 space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm">{contact.email}</span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm">{contact.phone}</span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Owner</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 text-sm">
                    <option>Unassigned</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Followers</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 text-sm">
                    <option>Search followers...</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className={cn(
            "border border-gray-200 rounded-lg overflow-hidden",
            expandedPanels.includes('tags') ? 'pb-4' : ''
          )}>
            <button
              onClick={() => togglePanel('tags')}
              className="flex items-center justify-between w-full p-4 text-left bg-gray-50"
            >
              <span className="font-medium">Tags</span>
              <span className={cn(
                "transform transition-transform",
                expandedPanels.includes('tags') ? 'rotate-180' : ''
              )}>▼</span>
            </button>
            {expandedPanels.includes('tags') && (
              <div className="px-4">
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                  + Add tag
                </button>
              </div>
            )}
          </div>

          <div className={cn(
            "border border-gray-200 rounded-lg overflow-hidden",
            expandedPanels.includes('automations') ? 'pb-4' : ''
          )}>
            <button
              onClick={() => togglePanel('automations')}
              className="flex items-center justify-between w-full p-4 text-left bg-gray-50"
            >
              <span className="font-medium">Active Automations</span>
              <span className={cn(
                "transform transition-transform",
                expandedPanels.includes('automations') ? 'rotate-180' : ''
              )}>▼</span>
            </button>
            {expandedPanels.includes('automations') && (
              <div className="px-4">
                {contact.automations.map(automation => (
                  <div key={automation.id} className="flex items-center justify-between py-2">
                    <span className="text-sm">{automation.name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={automation.active}
                        onChange={() => {}}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={cn(
            "border border-gray-200 rounded-lg overflow-hidden",
            expandedPanels.includes('dnd') ? 'pb-4' : ''
          )}>
            <button
              onClick={() => togglePanel('dnd')}
              className="flex items-center justify-between w-full p-4 text-left bg-gray-50"
            >
              <span className="font-medium">DND</span>
              <span className={cn(
                "transform transition-transform",
                expandedPanels.includes('dnd') ? 'rotate-180' : ''
              )}>▼</span>
            </button>
            {expandedPanels.includes('dnd') && (
              <div className="px-4 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">DND All</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={contact.dnd.all}
                      onChange={() => {}}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">DND Calls & Voicemails</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={contact.dnd.calls}
                      onChange={() => {}}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">DND SMS</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={contact.dnd.sms}
                      onChange={() => {}}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6">
        <button className="p-3 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors">
          <Bot size={24} />
        </button>
      </div>
    </div>
  );
};

export default ContactProfile;