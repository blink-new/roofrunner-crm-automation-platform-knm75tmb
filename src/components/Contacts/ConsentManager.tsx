import React from 'react';
import { Card } from '../ui/card';
import { Contact } from '../../types/contacts';

interface ConsentManagerProps {
  contact: Contact;
  onUpdate: (updates: Partial<Contact>) => void;
}

export default function ConsentManager({ contact, onUpdate }: ConsentManagerProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Communication Preferences</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Marketing Communications</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600"
              checked={contact.consent?.marketing}
              onChange={(e) => onUpdate({
                consent: {
                  ...contact.consent,
                  marketing: e.target.checked,
                  marketing_date: e.target.checked ? new Date().toISOString() : undefined
                }
              })}
            />
            <span className="ml-2 text-sm text-gray-700">
              I agree to receive marketing communications
            </span>
          </label>
          {contact.consent?.marketing_date && (
            <p className="mt-1 text-xs text-gray-500">
              Opted in on {new Date(contact.consent.marketing_date).toLocaleDateString()}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Communication Channels</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600"
                checked={!contact.unsubscribed?.email}
                onChange={(e) => onUpdate({
                  unsubscribed: {
                    ...contact.unsubscribed,
                    email: !e.target.checked
                  }
                })}
              />
              <span className="ml-2 text-sm text-gray-700">Email</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600"
                checked={!contact.unsubscribed?.sms}
                onChange={(e) => onUpdate({
                  unsubscribed: {
                    ...contact.unsubscribed,
                    sms: !e.target.checked
                  }
                })}
              />
              <span className="ml-2 text-sm text-gray-700">SMS</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Do Not Disturb</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600"
                checked={contact.dnd_settings.all}
                onChange={(e) => onUpdate({
                  dnd_settings: {
                    ...contact.dnd_settings,
                    all: e.target.checked
                  }
                })}
              />
              <span className="ml-2 text-sm text-gray-700">All Communications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600"
                checked={contact.dnd_settings.calls}
                onChange={(e) => onUpdate({
                  dnd_settings: {
                    ...contact.dnd_settings,
                    calls: e.target.checked
                  }
                })}
              />
              <span className="ml-2 text-sm text-gray-700">Calls</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600"
                checked={contact.dnd_settings.sms}
                onChange={(e) => onUpdate({
                  dnd_settings: {
                    ...contact.dnd_settings,
                    sms: e.target.checked
                  }
                })}
              />
              <span className="ml-2 text-sm text-gray-700">SMS</span>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}