import { supabase } from '../supabase';
import type { Dashboard, WidgetType } from '../../types/dashboard';

export class DashboardService {
  static async getDashboards(): Promise<Dashboard[]> {
    const { data, error } = await supabase
      .from('dashboards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getDashboard(id: string): Promise<Dashboard> {
    const { data, error } = await supabase
      .from('dashboards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createDashboard(dashboard: Omit<Dashboard, 'id' | 'created_at'>): Promise<Dashboard> {
    const { data, error } = await supabase
      .from('dashboards')
      .insert([dashboard])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateDashboard(id: string, updates: Partial<Dashboard>): Promise<Dashboard> {
    const { data, error } = await supabase
      .from('dashboards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteDashboard(id: string): Promise<void> {
    const { error } = await supabase
      .from('dashboards')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async cloneDashboard(id: string): Promise<Dashboard> {
    const { data: original, error: fetchError } = await supabase
      .from('dashboards')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { data: clone, error: cloneError } = await supabase
      .from('dashboards')
      .insert([{
        ...original,
        id: undefined,
        name: `${original.name} (Copy)`,
        created_at: undefined,
        updated_at: undefined
      }])
      .select()
      .single();

    if (cloneError) throw cloneError;
    return clone;
  }

  static async updateWidgetConfig(
    dashboardId: string,
    widgetId: string,
    config: Partial<WidgetType>
  ): Promise<void> {
    const { data: dashboard, error: fetchError } = await supabase
      .from('dashboards')
      .select('widgets')
      .eq('id', dashboardId)
      .single();

    if (fetchError) throw fetchError;

    const updatedWidgets = dashboard.widgets.map((widget: WidgetType) =>
      widget.id === widgetId ? { ...widget, ...config } : widget
    );

    const { error: updateError } = await supabase
      .from('dashboards')
      .update({ widgets: updatedWidgets })
      .eq('id', dashboardId);

    if (updateError) throw updateError;
  }

  static async updateLayout(
    dashboardId: string,
    layout: { id: string; x: number; y: number; w: number; h: number }[]
  ): Promise<void> {
    const { error } = await supabase
      .from('dashboards')
      .update({ layout })
      .eq('id', dashboardId);

    if (error) throw error;
  }
}