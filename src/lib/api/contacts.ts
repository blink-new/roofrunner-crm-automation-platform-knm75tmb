import { supabase } from '../supabase';
import { generateContacts } from '../../utils/mockContacts';
import type { Contact, ContactFormData, ContactFilters } from '../../types/contacts';

// Mock data
const mockContacts = generateContacts(25);

export async function getContacts(filters?: ContactFilters): Promise<Contact[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  let filteredContacts = [...mockContacts];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredContacts = filteredContacts.filter(contact => 
      contact.first_name.toLowerCase().includes(search) ||
      contact.last_name.toLowerCase().includes(search) ||
      contact.email?.toLowerCase().includes(search) ||
      contact.phone?.toLowerCase().includes(search) ||
      contact.custom_fields?.company?.toLowerCase().includes(search)
    );
  }

  if (filters?.type?.length) {
    filteredContacts = filteredContacts.filter(contact =>
      filters.type.includes(contact.type)
    );
  }

  if (filters?.status?.length) {
    filteredContacts = filteredContacts.filter(contact =>
      filters.status.includes(contact.status)
    );
  }

  if (filters?.tags?.length) {
    filteredContacts = filteredContacts.filter(contact =>
      filters.tags.some(tag => contact.tags.includes(tag))
    );
  }

  if (filters?.dateRange) {
    filteredContacts = filteredContacts.filter(contact => {
      const createdAt = new Date(contact.created_at);
      return createdAt >= filters.dateRange.start && createdAt <= filters.dateRange.end;
    });
  }

  return filteredContacts;
}

export async function getContact(id: string): Promise<Contact | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockContacts.find(c => c.id === id) || null;
}

export async function createContact(contact: ContactFormData): Promise<Contact> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newContact: Contact = {
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'current-user',
    ...contact
  };
  mockContacts.unshift(newContact);
  return newContact;
}

export async function updateContact(id: string, updates: Partial<ContactFormData>): Promise<Contact> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockContacts.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Contact not found');
  
  const updatedContact = {
    ...mockContacts[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  mockContacts[index] = updatedContact;
  return updatedContact;
}

export async function deleteContact(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockContacts.findIndex(c => c.id === id);
  if (index !== -1) {
    mockContacts.splice(index, 1);
  }
}

export async function findDuplicates(): Promise<Contact[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const duplicates = mockContacts.filter((contact, index) => {
    const duplicate = mockContacts.find((c, i) => 
      i !== index && (
        c.email === contact.email ||
        c.phone === contact.phone ||
        (c.first_name === contact.first_name && c.last_name === contact.last_name)
      )
    );
    return duplicate !== undefined;
  });
  return duplicates;
}

export async function mergeContacts(
  targetId: string,
  sourceId: string,
  fieldSelections: Record<string, string>
): Promise<Contact> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const target = mockContacts.find(c => c.id === targetId);
  const source = mockContacts.find(c => c.id === sourceId);
  
  if (!target || !source) throw new Error('Contact not found');
  
  const mergedContact = { ...target };
  
  for (const [field, selection] of Object.entries(fieldSelections)) {
    mergedContact[field] = selection === 'source' ? source[field] : target[field];
  }
  
  mergedContact.updated_at = new Date().toISOString();
  
  const targetIndex = mockContacts.findIndex(c => c.id === targetId);
  mockContacts[targetIndex] = mergedContact;
  
  const sourceIndex = mockContacts.findIndex(c => c.id === sourceId);
  mockContacts.splice(sourceIndex, 1);
  
  return mergedContact;
}