import { supabase } from '../supabase';

export class ABTestService {
  static async getABTests(campaignId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('ab_tests')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getABTest(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('ab_tests')
      .select(`
        *,
        variants:ab_test_variants(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createABTest(test: {
    campaign_id: string;
    name: string;
    variants: {
      name: string;
      content: any;
      traffic_split: number;
    }[];
  }): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('create-ab-test', {
        body: test
      });

    if (error) throw error;
    return data;
  }

  static async updateABTest(
    id: string,
    updates: {
      name?: string;
      variants?: {
        id: string;
        name?: string;
        content?: any;
        traffic_split?: number;
      }[];
    }
  ): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('update-ab-test', {
        body: { id, ...updates }
      });

    if (error) throw error;
    return data;
  }

  static async deleteABTest(id: string): Promise<void> {
    const { error } = await supabase
      .from('ab_tests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async declareWinner(id: string, variantId: string): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('declare-ab-test-winner', {
        body: { test_id: id, variant_id: variantId }
      });

    if (error) throw error;
  }

  static async getABTestStats(id: string): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('ab-test-stats', {
        body: { test_id: id }
      });

    if (error) throw error;
    return data;
  }
}