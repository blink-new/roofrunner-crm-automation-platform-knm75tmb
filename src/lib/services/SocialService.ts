import { supabase } from '../supabase';

export class SocialService {
  static async getSocialPosts(filters?: {
    platform?: string[];
    status?: string;
  }): Promise<any[]> {
    let query = supabase
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.platform?.length) {
      query = query.in('platform', filters.platform);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async createSocialPost(post: {
    content: string;
    platform: string | string[];
    media_urls?: string[];
    scheduled_at?: string;
  }): Promise<any> {
    // If multiple platforms, create multiple posts
    if (Array.isArray(post.platform)) {
      const posts = post.platform.map(platform => ({
        ...post,
        platform
      }));

      const { data, error } = await supabase
        .from('social_posts')
        .insert(posts)
        .select();

      if (error) throw error;
      return data;
    }

    // Single platform post
    const { data, error } = await supabase
      .from('social_posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSocialPost(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('social_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSocialPost(id: string): Promise<void> {
    const { error } = await supabase
      .from('social_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async publishNow(id: string): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('publish-social-post', {
        body: { post_id: id }
      });

    if (error) throw error;
  }

  static async getConnectedAccounts(): Promise<any[]> {
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}