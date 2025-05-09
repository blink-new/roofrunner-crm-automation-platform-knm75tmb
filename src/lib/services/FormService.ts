import { supabase } from '../supabase';

export class FormService {
  static async getForms(pageId?: string): Promise<any[]> {
    let query = supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (pageId) {
      query = query.eq('page_id', pageId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getForm(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createForm(form: {
    page_id: string;
    name: string;
    fields: {
      id: string;
      name: string;
      label: string;
      type: string;
      required: boolean;
      options?: string[];
      placeholder?: string;
      default_value?: string;
    }[];
    submit_button_text: string;
    success_message: string;
    redirect_url?: string;
    notifications?: {
      email?: string;
      webhook_url?: string;
    };
    mapping?: {
      contact_field_mappings?: Record<string, string>;
      opportunity_field_mappings?: Record<string, string>;
    };
  }): Promise<any> {
    const { data, error } = await supabase
      .from('forms')
      .insert([form])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateForm(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('forms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteForm(id: string): Promise<void> {
    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getFormSubmissions(formId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('form_id', formId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async submitForm(formId: string, formData: Record<string, any>): Promise<{
    success: boolean;
    contact_id?: string;
    opportunity_id?: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('submit-form', {
        body: { form_id: formId, form_data: formData }
      });

    if (error) throw error;
    return data;
  }
}