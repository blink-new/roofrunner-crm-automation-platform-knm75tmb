import { supabase } from '../supabase';
import type { Note } from '../../types/contacts';

export class NoteService {
  static async getNotes(contactId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('contact_notes')
      .select(`
        *,
        user:users(id, name, avatar_url)
      `)
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createNote(
    contactId: string,
    content: string,
    parentId?: string
  ): Promise<Note> {
    const { data, error } = await supabase
      .from('contact_notes')
      .insert({
        contact_id: contactId,
        content,
        parent_id: parentId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateNote(id: string, content: string): Promise<Note> {
    const { data, error } = await supabase
      .from('contact_notes')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}