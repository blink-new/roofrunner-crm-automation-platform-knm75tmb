import { supabase } from '../supabase';

export class TaxService {
  static async list(): Promise<any[]> {
    const { data, error } = await supabase
      .from('tax_rates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async create(taxRate: {
    name: string;
    rate: number;
    country: string;
    state?: string;
    city?: string;
    zip?: string;
    active: boolean;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('tax_rates')
      .insert([taxRate])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<{
    name: string;
    rate: number;
    country: string;
    state: string;
    city: string;
    zip: string;
    active: boolean;
  }>): Promise<any> {
    const { data, error } = await supabase
      .from('tax_rates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tax_rates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async calculate(
    amount: number,
    address: {
      country: string;
      state?: string;
      city?: string;
      zip?: string;
    }
  ): Promise<{
    tax_amount: number;
    tax_rate: number;
    tax_details: {
      name: string;
      rate: number;
      amount: number;
    }[];
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('calculate-tax', {
        body: { amount, address }
      });

    if (error) throw error;
    return data;
  }

  static async getJurisdictions(): Promise<{
    countries: string[];
    states: Record<string, string[]>;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('get-tax-jurisdictions', {});

    if (error) throw error;
    return data;
  }
}