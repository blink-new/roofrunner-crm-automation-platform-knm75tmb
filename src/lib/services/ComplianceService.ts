import { supabase } from '../supabase';

export class ComplianceService {
  static async validateEmailTemplate(content: string): Promise<{
    valid: boolean;
    issues: {
      type: 'error' | 'warning';
      message: string;
    }[];
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('validate-email-compliance', {
        body: { content }
      });

    if (error) throw error;
    return data;
  }

  static async validateSMSTemplate(content: string): Promise<{
    valid: boolean;
    issues: {
      type: 'error' | 'warning';
      message: string;
    }[];
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('validate-sms-compliance', {
        body: { content }
      });

    if (error) throw error;
    return data;
  }

  static async getDomainStatus(): Promise<{
    domain: string;
    status: 'verified' | 'pending' | 'failed';
    issues?: string[];
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('check-domain-status', {});

    if (error) throw error;
    return data;
  }

  static async verifyDomain(domain: string): Promise<{
    success: boolean;
    verification_records: {
      type: string;
      name: string;
      value: string;
    }[];
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('verify-domain', {
        body: { domain }
      });

    if (error) throw error;
    return data;
  }

  static async getComplianceSettings(): Promise<{
    unsubscribe_footer: string;
    physical_address: string;
    company_name: string;
    privacy_policy_url: string;
    terms_url: string;
  }> {
    const { data, error } = await supabase
      .from('compliance_settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async updateComplianceSettings(settings: {
    unsubscribe_footer?: string;
    physical_address?: string;
    company_name?: string;
    privacy_policy_url?: string;
    terms_url?: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('compliance_settings')
      .update(settings);

    if (error) throw error;
  }
}