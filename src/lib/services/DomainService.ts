import { supabase } from '../supabase';

export class DomainService {
  static async getDomains(siteId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async addDomain(domain: {
    site_id: string;
    domain: string;
    primary: boolean;
  }): Promise<any> {
    // If this is the primary domain, unset any existing primary domains
    if (domain.primary) {
      await supabase
        .from('domains')
        .update({ primary: false })
        .eq('site_id', domain.site_id)
        .eq('primary', true);
    }

    const { data, error } = await supabase
      .from('domains')
      .insert([domain])
      .select()
      .single();

    if (error) throw error;

    // Provision SSL certificate
    await this.provisionSSL(data.id);

    return data;
  }

  static async updateDomain(id: string, updates: {
    primary?: boolean;
  }): Promise<any> {
    // If setting as primary, unset any existing primary domains
    if (updates.primary) {
      const { data: domain } = await supabase
        .from('domains')
        .select('site_id')
        .eq('id', id)
        .single();

      await supabase
        .from('domains')
        .update({ primary: false })
        .eq('site_id', domain.site_id)
        .eq('primary', true);
    }

    const { data, error } = await supabase
      .from('domains')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeDomain(id: string): Promise<void> {
    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getDomainStatus(id: string): Promise<{
    domain: string;
    status: 'pending' | 'active' | 'failed';
    dns_records?: {
      type: string;
      name: string;
      value: string;
      status: 'pending' | 'valid' | 'invalid';
    }[];
    ssl_status: 'pending' | 'active' | 'failed';
    error?: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('check-domain-status', {
        body: { domain_id: id }
      });

    if (error) throw error;
    return data;
  }

  static async provisionSSL(domainId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('provision-ssl', {
        body: { domain_id: domainId }
      });

    if (error) throw error;
    return data;
  }
}