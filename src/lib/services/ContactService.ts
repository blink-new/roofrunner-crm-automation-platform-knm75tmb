import { supabase } from '../supabase';
import type { Contact, ContactFormData, ContactFilters } from '../../types/contacts';

export class ContactService {
  static async getContacts(filters?: ContactFilters): Promise<Contact[]> {
    let query = supabase
      .from('contacts')
      .select(`
        *,
        phone_numbers:contact_phone_numbers(*),
        followers:contact_followers(user_id),
        documents:contact_documents(*),
        notes:contact_notes(*),
        custom_objects:contact_custom_object_values(*)
      `);

    if (filters?.search) {
      query = query.or(`
        first_name.ilike.%${filters.search}%,
        last_name.ilike.%${filters.search}%,
        email.ilike.%${filters.search}%
      `);
    }

    if (filters?.type?.length) {
      query = query.in('type', filters.type);
    }

    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters?.tags?.length) {
      query = query.contains('tags', filters.tags);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async createContact(contact: ContactFormData): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateContact(id: string, updates: Partial<ContactFormData>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async bulkDelete(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .in('id', ids);

    if (error) throw error;
  }

  static async bulkTag(ids: string[], tags: string[], remove = false): Promise<void> {
    const { data: contacts, error: fetchError } = await supabase
      .from('contacts')
      .select('id, tags')
      .in('id', ids);

    if (fetchError) throw fetchError;

    const updates = contacts.map(contact => ({
      id: contact.id,
      tags: remove
        ? (contact.tags || []).filter(t => !tags.includes(t))
        : [...new Set([...(contact.tags || []), ...tags])]
    }));

    const { error } = await supabase
      .from('contacts')
      .upsert(updates);

    if (error) throw error;
  }
}