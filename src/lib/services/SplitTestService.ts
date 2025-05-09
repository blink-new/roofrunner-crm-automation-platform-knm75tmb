import { supabase } from '../supabase';

export class SplitTestService {
  static async getSplitTests(pageId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('ab_tests')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getSplitTest(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('ab_tests')
      .select(`
        *,
        variants:ab_variants(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createSplitTest(test: {
    page_id: string;
    name: string;
    variants: {
      name: string;
      content: any;
      traffic_split: number;
    }[];
  }): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('create-split-test', {
        body: test
      });

    if (error) throw error;
    return data;
  }

  static async updateSplitTest(
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
      .invoke('update-split-test', {
        body: { id, ...updates }
      });

    if (error) throw error;
    return data;
  }

  static async deleteSplitTest(id: string): Promise<void> {
    const { error } = await supabase
      .from('ab_tests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async declareWinner(id: string, variantId: string): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('declare-split-test-winner', {
        body: { test_id: id, variant_id: variantId }
      });

    if (error) throw error;
  }

  static async getSplitTestStats(id: string): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('split-test-stats', {
        body: { test_id: id }
      });

    if (error) throw error;
    return data;
  }
}