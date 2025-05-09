import { supabase } from '../supabase';
import type { Dashboard, WidgetType } from '../../types/dashboard';

export class LayoutService {
  static async getLayouts(): Promise<Dashboard[]> {
    const { data, error } = await supabase
      .from('dashboard_layouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getLayout(id: string): Promise<Dashboard> {
    const { data, error } = await supabase
      .from('dashboard_layouts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createLayout(layout: Omit<Dashboard, 'id' | 'created_at'>): Promise<Dashboard> {
    const { data, error } = await supabase
      .from('dashboard_layouts')
      .insert([layout])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateLayout(
    id: string,
    updates: Partial<Dashboard>
  ): Promise<Dashboard> {
    const { data, error } = await supabase
      .from('dashboard_layouts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteLayout(id: string): Promise<void> {
    const { error } = await supabase
      .from('dashboard_layouts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async cloneLayout(id: string): Promise<Dashboard> {
    const { data: original, error: fetchError } = await supabase
      .from('dashboard_layouts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { data: clone, error: cloneError } = await supabase
      .from('dashboard_layouts')
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
    layoutId: string,
    widgetId: string,
    config: Partial<WidgetType>
  ): Promise<void> {
    const { data: layout, error: fetchError } = await supabase
      .from('dashboard_layouts')
      .select('widgets')
      .eq('id', layoutId)
      .single();

    if (fetchError) throw fetchError;

    const updatedWidgets = layout.widgets.map((widget: WidgetType) =>
      widget.id === widgetId ? { ...widget, ...config } : widget
    );

    const { error: updateError } = await supabase
      .from('dashboard_layouts')
      .update({ widgets: updatedWidgets })
      .eq('id', layoutId);

    if (updateError) throw updateError;
  }

  static async updatePositions(
    layoutId: string,
    positions: Array<{ id: string; x: number; y: number; w: number; h: number }>
  ): Promise<void> {
    const { error } = await supabase
      .from('dashboard_layouts')
      .update({ layout: positions })
      .eq('id', layoutId);

    if (error) throw error;
  }
}