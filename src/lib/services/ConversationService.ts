import { supabase } from '../supabase';
import type { Thread, Message } from '../../types/conversations';

export class ConversationService {
  static async getThreads(filters?: {
    channel?: string[];
    status?: string;
    assignedTo?: string;
  }): Promise<Thread[]> {
    let query = supabase
      .from('conversations')
      .select(`
        *,
        contact:contacts (*),
        messages:messages (*)
      `)
      .order('last_message_at', { ascending: false });

    if (filters?.channel?.length) {
      query = query.in('channel', filters.channel);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async updateThread(
    id: string,
    updates: { status?: string; assignee?: string }
  ): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  static async sendMessage(
    threadId: string,
    content: string,
    attachments?: File[]
  ): Promise<Message> {
    // Upload attachments if any
    const uploadedFiles = [];
    if (attachments?.length) {
      for (const file of attachments) {
        const { data, error } = await supabase.storage
          .from('conversation-attachments')
          .upload(`${threadId}/${file.name}`, file);

        if (error) throw error;
        uploadedFiles.push(data);
      }
    }

    // Create message
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: threadId,
        content,
        attachments: uploadedFiles
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async markAsRead(threadId: string): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .update({ unread_count: 0 })
      .eq('id', threadId);

    if (error) throw error;
  }

  static async bulkUpdate(
    ids: string[],
    updates: { status?: string; assignee?: string }
  ): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .update(updates)
      .in('id', ids);

    if (error) throw error;
  }
}