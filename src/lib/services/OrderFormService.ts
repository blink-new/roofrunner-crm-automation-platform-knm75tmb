import { supabase } from '../supabase';

export class OrderFormService {
  static async getOrderForms(funnelId?: string): Promise<any[]> {
    let query = supabase
      .from('order_forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (funnelId) {
      query = query.eq('funnel_id', funnelId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getOrderForm(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('order_forms')
      .select(`
        *,
        products:order_form_products(*),
        upsells:order_form_upsells(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createOrderForm(form: {
    funnel_id: string;
    page_id: string;
    name: string;
    description?: string;
    payment_methods: string[];
    products: {
      name: string;
      description?: string;
      price: number;
      currency: string;
      image_url?: string;
      quantity: number;
    }[];
    success_message?: string;
    redirect_url?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('create-order-form', {
        body: form
      });

    if (error) throw error;
    return data;
  }

  static async updateOrderForm(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('update-order-form', {
        body: { id, ...updates }
      });

    if (error) throw error;
    return data;
  }

  static async deleteOrderForm(id: string): Promise<void> {
    const { error } = await supabase
      .from('order_forms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getUpsells(orderFormId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('order_form_upsells')
      .select('*')
      .eq('order_form_id', orderFormId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async createUpsell(upsell: {
    order_form_id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    image_url?: string;
    position: number;
    type: 'upsell' | 'downsell';
    trigger: 'purchase' | 'decline';
  }): Promise<any> {
    const { data, error } = await supabase
      .from('order_form_upsells')
      .insert([upsell])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUpsell(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('order_form_upsells')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteUpsell(id: string): Promise<void> {
    const { error } = await supabase
      .from('order_form_upsells')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}