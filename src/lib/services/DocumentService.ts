import { supabase } from '../supabase';

export class DocumentService {
  static async uploadDocument(
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

    const { error: dbError } = await supabase
      .from('contact_documents')
      .insert({
        contact_id: contactId,
        name: file.name,
        storage_path: path,
        size: file.size,
        content_type: file.type
      });

    if (dbError) throw dbError;
  }

  static async deleteDocument(id: string): Promise<void> {
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