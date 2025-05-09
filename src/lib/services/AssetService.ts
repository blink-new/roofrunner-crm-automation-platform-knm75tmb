import { supabase } from '../supabase';

export class AssetService {
  static async getAssets(siteId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getAsset(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async uploadAsset(
    siteId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    // Upload file to storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `sites/${siteId}/assets/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        onUploadProgress: (progress) => {
          if (onProgress) {
            onProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        }
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = await supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    // Create asset record
    const { data: assetData, error: assetError } = await supabase
      .from('assets')
      .insert([{
        site_id: siteId,
        name: file.name,
        type: file.type,
        size: file.size,
        storage_path: filePath,
        url: urlData.publicUrl
      }])
      .select()
      .single();

    if (assetError) throw assetError;
    return assetData;
  }

  static async deleteAsset(id: string): Promise<void> {
    // Get asset info
    const { data: asset, error: fetchError } = await supabase
      .from('assets')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('assets')
      .remove([asset.storage_path]);

    if (storageError) throw storageError;

    // Delete record
    const { error: deleteError } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
  }
}