import { supabase } from '../supabase';
import type { Deal, DealFormData } from '../../types/deals';

export class OpportunityService {
  static async getDeals(filters?: Record<string, any>): Promise<Deal[]> {
    let query = supabase
      .from('deals')
      .select(`
        *,
        contact:contacts (
          id,
          first_name,
          last_name,
          email,
          phone,
          custom_fields
        ),
        custom_fields:deal_custom_fields(*)
      `);

    if (filters?.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async updateDeal(id: string, updates: Partial<DealFormData>): Promise<Deal> {
    const { data, error } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async markLost(id: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('deals')
      .update({
        status: 'lost',
        loss_reason: reason,
        lost_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }

  static async bulkUpdate(
    ids: string[],
    updates: Partial<DealFormData>
  ): Promise<void> {
    const { error } = await supabase
      .from('deals')
      .update(updates)
      .in('id', ids);

    if (error) throw error;
  }

  static async updateTags(id: string, tags: string[]): Promise<void> {
    const { error } = await supabase
      .from('deals')
      .update({ tags })
      .eq('id', id);

    if (error) throw error;
  }

  static async bulkTag(ids: string[], tags: string[], remove = false): Promise<void> {
    const { data: deals, error: fetchError } = await supabase
      .from('deals')
      .select('id, tags')
      .in('id', ids);

    if (fetchError) throw fetchError;

    const updates = deals.map(deal => ({
      id: deal.id,
      tags: remove
        ? (deal.tags || []).filter(t => !tags.includes(t))
        : [...new Set([...(deal.tags || []), ...tags])]
    }));

    const { error } = await supabase
      .from('deals')
      .upsert(updates);

    if (error) throw error;
  }
}