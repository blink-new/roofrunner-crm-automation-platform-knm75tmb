import { z } from 'zod';

export type FileType = 'image' | 'video' | 'document' | 'audio' | 'other';
export type ViewMode = 'grid' | 'list';
export type FileAccess = 'public' | 'private' | 'team';

export interface FileMetadata {
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  pages?: number;
}

export interface File {
  id: string;
  name: string;
  type: FileType;
  size: number;
  url: string;
  thumbnail_url?: string;
  folder_id?: string;
  tags: string[];
  access: FileAccess;
  metadata: FileMetadata;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  name: string;
  parent_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface ShareLink {
  id: string;
  file_id: string;
  url: string;
  expires_at?: string;
  created_at: string;
}

export interface UploadProgress {
  file: globalThis.File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export const fileSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['image', 'video', 'document', 'audio', 'other']),
  size: z.number().min(0),
  url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  folder_id: z.string().optional(),
  tags: z.array(z.string()),
  access: z.enum(['public', 'private', 'team']),
  metadata: z.object({
    dimensions: z.object({
      width: z.number(),
      height: z.number()
    }).optional(),
    duration: z.number().optional(),
    pages: z.number().optional()
  })
});

export const folderSchema = z.object({
  name: z.string().min(1),
  parent_id: z.string().optional()
});

export const shareLinkSchema = z.object({
  file_id: z.string(),
  expires_at: z.string().datetime().optional()
});