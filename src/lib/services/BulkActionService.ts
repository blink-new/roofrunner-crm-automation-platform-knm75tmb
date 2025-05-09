import { supabase } from '../supabase';

export class BulkActionService {
  static async bulkSendInvites(recipientIds: string[], templateId: string): Promise<{
    success: boolean;
    count: number;
    message?: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('bulk-send-review-invites', {
        body: { recipient_ids: recipientIds, template_id: templateId }
      });

    if (error) throw error;
    return data;
  }

  static async bulkResendInvites(inviteIds: string[]): Promise<{
    success: boolean;
    count: number;
    message?: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('bulk-resend-review-invites', {
        body: { invite_ids: inviteIds }
      });

    if (error) throw error;
    return data;
  }

  static async bulkExportReviews(reviewIds: string[], format: 'csv' | 'pdf'): Promise<{
    download_url: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('bulk-export-reviews', {
        body: { review_ids: reviewIds, format }
      });

    if (error) throw error;
    return data;
  }

  static async bulkUpdateReviewStatus(reviewIds: string[], status: string): Promise<{
    success: boolean;
    count: number;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('bulk-update-review-status', {
        body: { review_ids: reviewIds, status }
      });

    if (error) throw error;
    return data;
  }

  static async bulkDeleteReviews(reviewIds: string[]): Promise<{
    success: boolean;
    count: number;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('bulk-delete-reviews', {
        body: { review_ids: reviewIds }
      });

    if (error) throw error;
    return data;
  }
}