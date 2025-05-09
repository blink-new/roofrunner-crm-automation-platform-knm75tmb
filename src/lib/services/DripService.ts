import { supabase } from '../supabase';

export class DripService {
  static async getDripSequences(): Promise<any[]> {
    const { data, error } = await supabase
      .from('drip_sequences')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getDripSequence(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('drip_sequences')
      .select(`
        *,
        steps:drip_sequence_steps(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createDripSequence(sequence: any): Promise<any> {
    const { data, error } = await supabase
      .from('drip_sequences')
      .insert([sequence])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateDripSequence(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('drip_sequences')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async configureBatch(
    id: string,
    batchSize: number,
    interval: number
  ): Promise<void> {
    const { error } = await supabase
      .from('drip_sequences')
      .update({
        batch_settings: {
          batch_size: batchSize,
          interval_minutes: interval
        }
      })
      .eq('id', id);

    if (error) throw error;
  }

  static async addRecipients(
    id: string,
    recipientIds: string[]
  ): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('add-drip-recipients', {
        body: { sequence_id: id, recipient_ids: recipientIds }
      });

    if (error) throw error;
  }

  static async removeRecipients(
    id: string,
    recipientIds: string[]
  ): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('remove-drip-recipients', {
        body: { sequence_id: id, recipient_ids: recipientIds }
      });

    if (error) throw error;
  }

  static async getSequenceStats(id: string): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('drip-sequence-stats', {
        body: { sequence_id: id }
      });

    if (error) throw error;
    return data;
  }
}