import { supabase } from '../supabase';

export class VersionService {
  static async getPageVersions(pageId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('page_versions')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getPageVersion(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('page_versions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createPageVersion(
    pageId: string,
    content: any,
    meta: any,
    comment?: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from('page_versions')
      .insert([{
        page_id: pageId,
        content,
        meta,
        comment
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async restorePageVersion(pageId: string, versionId: string): Promise<void> {
    const { data: version, error: versionError } = await supabase
      .from('page_versions')
      .select('content, meta')
      .eq('id', versionId)
      .single();

    if (versionError) throw versionError;

    const { error: updateError } = await supabase
      .from('funnel_pages')
      .update({
        content: version.content,
        meta: version.meta
      })
      .eq('id', pageId);

    if (updateError) throw updateError;

    // Create a new version that records this restoration
    await this.createPageVersion(
      pageId,
      version.content,
      version.meta,
      `Restored from version ${versionId}`
    );
  }
}