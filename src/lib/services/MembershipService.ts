import { supabase } from '../supabase';

export class MembershipService {
  static async getMembershipPlans(siteId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('membership_plans')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getMembershipPlan(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('membership_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createMembershipPlan(plan: {
    site_id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    billing_period: 'monthly' | 'yearly' | 'one_time';
    features: string[];
    access_rules: {
      content_types: string[];
      tag_requirements?: string[];
    };
  }): Promise<any> {
    const { data, error } = await supabase
      .from('membership_plans')
      .insert([plan])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateMembershipPlan(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('membership_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteMembershipPlan(id: string): Promise<void> {
    const { error } = await supabase
      .from('membership_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getMembers(siteId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('site_members')
      .select(`
        *,
        user:users(id, email),
        plan:membership_plans(id, name)
      `)
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async addMember(member: {
    site_id: string;
    user_id: string;
    plan_id: string;
    status: 'active' | 'inactive' | 'pending';
    expires_at?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('site_members')
      .insert([member])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateMember(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('site_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('site_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}