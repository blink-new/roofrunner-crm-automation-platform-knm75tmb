import { supabase } from '../supabase';

export class TrackingService {
  static async getTrackingScripts(pageId: string): Promise<{
    header: string[];
    footer: string[];
  }> {
    const { data, error } = await supabase
      .from('tracking_scripts')
      .select('*')
      .eq('page_id', pageId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No record found
        return { header: [], footer: [] };
      }
      throw error;
    }
    
    return data;
  }

  static async updateTrackingScripts(
    pageId: string,
    scripts: {
      header: string[];
      footer: string[];
    }
  ): Promise<void> {
    const { error: deleteError } = await supabase
      .from('tracking_scripts')
      .delete()
      .eq('page_id', pageId);

    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase
      .from('tracking_scripts')
      .insert([{
        page_id: pageId,
        header: scripts.header,
        footer: scripts.footer
      }]);

    if (insertError) throw insertError;
  }

  static async validateTrackingScript(script: string): Promise<{
    valid: boolean;
    issues: {
      type: 'error' | 'warning';
      message: string;
    }[];
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('validate-tracking-script', {
        body: { script }
      });

    if (error) throw error;
    return data;
  }
}