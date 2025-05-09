import { supabase } from '../supabase';
import { File, Folder } from '../../types/files';

export class FileService {
  static async getFiles(folderId?: string): Promise<File[]> {
    let query = supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (folderId) {
      query = query.eq('folder_id', folderId);
    } else {
      query = query.is('folder_id', null);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getFile(id: string): Promise<File> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async upload(
    file: File,
    folderId?: string,
    onProgress?: (progress: number) => void
  ): Promise<File> {
    // Upload file to storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = folderId 
      ? `folders/${folderId}/${fileName}`
      : `files/${fileName}`;
    
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

    // Determine file type
    let fileType: 'image' | 'video' | 'document' | 'audio' | 'other' = 'other';
    if (file.type.startsWith('image/')) fileType = 'image';
    else if (file.type.startsWith('video/')) fileType = 'video';
    else if (file.type.startsWith('audio/')) fileType = 'audio';
    else if (
      file.type === 'application/pdf' ||
      file.type.includes('document') ||
      file.type.includes('text/')
    ) fileType = 'document';

    // Create asset record
    const { data: assetData, error: assetError } = await supabase
      .from('assets')
      .insert([{
        name: file.name,
        type: fileType,
        size: file.size,
        url: urlData.publicUrl,
        folder_id: folderId,
        tags: [],
        access: 'private',
        metadata: {}
      }])
      .select()
      .single();

    if (assetError) throw assetError;
    return assetData;
  }

  static async deleteFile(id: string): Promise<void> {
    // Get file info
    const { data: file, error: fetchError } = await supabase
      .from('assets')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    if (file.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('assets')
        .remove([file.storage_path]);

      if (storageError) throw storageError;
    }

    // Delete record
    const { error: deleteError } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
  }

  static async updateFile(id: string, updates: {
    name?: string;
    tags?: string[];
    access?: 'public' | 'private' | 'team';
  }): Promise<File> {
    const { data, error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createShareLink(fileId: string, expiresAt?: string): Promise<{ url: string }> {
    const { data, error } = await supabase
      .functions
      .invoke('create-share-link', {
        body: { file_id: fileId, expires_at: expiresAt }
      });

    if (error) throw error;
    return data;
  }

  static async generateThumbnail(fileId: string): Promise<{ url: string }> {
    const { data, error } = await supabase
      .functions
      .invoke('generate-thumbnail', {
        body: { file_id: fileId }
      });

    if (error) throw error;
    return data;
  }

  static async getSupportedFormats(): Promise<string[]> {
    // Return supported formats directly instead of calling Edge Function
    return [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'application/json',
      'application/zip',
      'application/x-rar-compressed'
    ];
  }
}

export class FolderService {
  static async getFolders(parentId?: string): Promise<Folder[]> {
    let query = supabase
      .from('folders')
      .select('*')
      .order('name', { ascending: true });

    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else {
      query = query.is('parent_id', null);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getAllFolders(): Promise<Folder[]> {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async createFolder(folder: {
    name: string;
    parent_id?: string;
  }): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .insert([folder])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateFolder(id: string, updates: {
    name?: string;
    parent_id?: string;
  }): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteFolder(id: string): Promise<void> {
    // Move files to parent folder
    const { data: folder, error: folderError } = await supabase
      .from('folders')
      .select('parent_id')
      .eq('id', id)
      .single();

    if (folderError) throw folderError;

    const { error: updateError } = await supabase
      .from('assets')
      .update({ folder_id: folder.parent_id })
      .eq('folder_id', id);

    if (updateError) throw updateError;

    // Move child folders to parent folder
    const { error: updateFoldersError } = await supabase
      .from('folders')
      .update({ parent_id: folder.parent_id })
      .eq('parent_id', id);

    if (updateFoldersError) throw updateFoldersError;

    // Delete folder
    const { error: deleteError } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
  }

  static async getFolderPath(folderId: string): Promise<{ id: string; name: string }[]> {
    const { data, error } = await supabase
      .functions
      .invoke('get-folder-path', {
        body: { folder_id: folderId }
      });

    if (error) throw error;
    return data.path;
  }
}

export class BulkActionService {
  static async move(fileIds: string[], targetFolderId: string): Promise<void> {
    const { error } = await supabase
      .from('assets')
      .update({ folder_id: targetFolderId })
      .in('id', fileIds);

    if (error) throw error;
  }

  static async download(fileIds: string[]): Promise<{ url: string }> {
    const { data, error } = await supabase
      .functions
      .invoke('bulk-download-files', {
        body: { file_ids: fileIds }
      });

    if (error) throw error;
    return data;
  }

  static async delete(fileIds: string[]): Promise<void> {
    // Get file storage paths
    const { data: files, error: fetchError } = await supabase
      .from('assets')
      .select('id, storage_path')
      .in('id', fileIds);

    if (fetchError) throw fetchError;

    // Delete from storage
    const storagePaths = files
      .filter(file => file.storage_path)
      .map(file => file.storage_path);
    
    if (storagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('assets')
        .remove(storagePaths);

      if (storageError) throw storageError;
    }

    // Delete records
    const { error: deleteError } = await supabase
      .from('assets')
      .delete()
      .in('id', fileIds);

    if (deleteError) throw deleteError;
  }
}

export class GoogleDriveService {
  static async isConnected(): Promise<boolean> {
    const { data, error } = await supabase
      .functions
      .invoke('google-drive-check-connection', {});

    if (error) throw error;
    return data.connected;
  }

  static async connect(): Promise<void> {
    const { data, error } = await supabase
      .functions
      .invoke('google-drive-connect', {});

    if (error) throw error;
    
    // Open OAuth popup
    window.open(data.auth_url, 'Google Drive Auth', 'width=600,height=700');
  }

  static async listFiles(folderId?: string): Promise<any[]> {
    const { data, error } = await supabase
      .functions
      .invoke('google-drive-list-files', {
        body: { folder_id: folderId }
      });

    if (error) throw error;
    return data.files;
  }

  static async getFolderInfo(folderId: string): Promise<{ id: string; name: string }> {
    const { data, error } = await supabase
      .functions
      .invoke('google-drive-folder-info', {
        body: { folder_id: folderId }
      });

    if (error) throw error;
    return data;
  }

  static async importFiles(fileIds: string[], targetFolderId?: string): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('google-drive-import', {
        body: { file_ids: fileIds, folder_id: targetFolderId }
      });

    if (error) throw error;
  }
}

export class ContactFileService {
  static async list(contactId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('contact_documents')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async upload(
    contactId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    const path = `documents/${contactId}/${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('contacts')
      .upload(path, file, {
        onUploadProgress: (progress) => {
          onProgress?.(Math.round((progress.loaded / progress.total) * 100));
        }
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = await supabase.storage
      .from('contacts')
      .getPublicUrl(path);

    const { error: dbError } = await supabase
      .from('contact_documents')
      .insert({
        contact_id: contactId,
        name: file.name,
        storage_path: path,
        size: file.size,
        content_type: file.type,
        url: urlData.publicUrl
      });

    if (dbError) throw dbError;
  }

  static async delete(id: string): Promise<void> {
    const { data: doc, error: fetchError } = await supabase
      .from('contact_documents')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { error: storageError } = await supabase.storage
      .from('contacts')
      .remove([doc.storage_path]);

    if (storageError) throw storageError;

    const { error: dbError } = await supabase
      .from('contact_documents')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;
  }
}

export class CampaignMediaService {
  static async list(campaignId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('campaign_media')
      .select(`
        *,
        file:assets(*)
      `)
      .eq('campaign_id', campaignId);

    if (error) throw error;
    
    // Flatten the structure
    return data.map((item: any) => item.file);
  }

  static async add(campaignId: string, fileId: string): Promise<void> {
    const { error } = await supabase
      .from('campaign_media')
      .insert({
        campaign_id: campaignId,
        file_id: fileId
      });

    if (error) throw error;
  }

  static async remove(campaignId: string, fileId: string): Promise<void> {
    const { error } = await supabase
      .from('campaign_media')
      .delete()
      .eq('campaign_id', campaignId)
      .eq('file_id', fileId);

    if (error) throw error;
  }
}