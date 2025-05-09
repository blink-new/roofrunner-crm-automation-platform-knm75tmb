import { supabase } from '../supabase';

export class PlanService {
  static async getPaymentPlans(invoiceId?: string): Promise<any[]> {
    let query = supabase
      .from('payment_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (invoiceId) {
      query = query.eq('invoice_id', invoiceId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async createPaymentPlan(plan: {
    invoice_id: string;
    name: string;
    description?: string;
    installments: {
      amount: number;
      due_date: string;
    }[];
    auto_charge: boolean;
    payment_method_id?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('create-payment-plan', {
        body: plan
      });

    if (error) throw error;
    return data;
  }

  static async updatePaymentPlan(id: string, updates: {
    name?: string;
    description?: string;
    installments?: {
      amount: number;
      due_date: string;
    }[];
    auto_charge?: boolean;
    payment_method_id?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('update-payment-plan', {
        body: { plan_id: id, ...updates }
      });

    if (error) throw error;
    return data;
  }

  static async deletePaymentPlan(id: string): Promise<void> {
    const { error } = await supabase
      .from('payment_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getInstallments(planId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('payment_plan_installments')
      .select('*')
      .eq('plan_id', planId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async processInstallment(installmentId: string): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('process-installment', {
        body: { installment_id: installmentId }
      });

    if (error) throw error;
  }
}