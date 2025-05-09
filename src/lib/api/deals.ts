import { supabase } from '../supabase';
import type { Deal, DealFormData, DealFilters, Pipeline, PipelineStage } from '../../types/deals';

export async function getPipelines(): Promise<Pipeline[]> {
  const { data, error } = await supabase
    .from('pipelines')
    .select('*')
    .order('created_at');

  if (error) throw error;
  return data;
}

export async function getPipelineStages(pipelineId: string): Promise<PipelineStage[]> {
  const { data, error } = await supabase
    .from('pipeline_stages')
    .select('*')
    .eq('pipeline_id', pipelineId)
    .order('position');

  if (error) throw error;
  return data;
}

export async function getDeals(filters?: DealFilters): Promise<Deal[]> {
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
      )
    `)
    .order('created_at', { ascending: false });

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%`);
  }

  if (filters?.pipeline_id) {
    query = query.eq('pipeline_id', filters.pipeline_id);
  }

  if (filters?.stage_id?.length) {
    query = query.in('stage_id', filters.stage_id);
  }

  if (filters?.status?.length) {
    query = query.in('status', filters.status);
  }

  if (filters?.tags?.length) {
    query = query.contains('tags', filters.tags);
  }

  if (filters?.amount) {
    if (filters.amount.min !== undefined) {
      query = query.gte('amount', filters.amount.min);
    }
    if (filters.amount.max !== undefined) {
      query = query.lte('amount', filters.amount.max);
    }
  }

  if (filters?.expected_close_date) {
    query = query
      .gte('expected_close_date', filters.expected_close_date.start.toISOString())
      .lte('expected_close_date', filters.expected_close_date.end.toISOString());
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function createDeal(deal: DealFormData): Promise<Deal> {
  const { data, error } = await supabase
    .from('deals')
    .insert([deal])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDeal(id: string, updates: Partial<DealFormData>): Promise<Deal> {
  const { data, error } = await supabase
    .from('deals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDeal(id: string): Promise<void> {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateStageOrder(
  pipelineId: string,
  stageOrder: { id: string; position: number }[]
): Promise<void> {
  const { error } = await supabase.rpc('update_stage_positions', {
    stage_positions: stageOrder
  });

  if (error) throw error;
}

export async function moveDeal(
  dealId: string,
  stageId: string,
  position: number
): Promise<void> {
  const { error } = await supabase
    .from('deals')
    .update({
      stage_id: stageId,
      metadata: { position }
    })
    .eq('id', dealId);

  if (error) throw error;
}