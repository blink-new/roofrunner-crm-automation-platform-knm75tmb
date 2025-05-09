import { supabase } from '../supabase';

export class BlogService {
  static async getBlogPosts(siteId?: string): Promise<any[]> {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (siteId) {
      query = query.eq('site_id', siteId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getBlogPost(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createBlogPost(post: {
    site_id: string;
    title: string;
    slug: string;
    content: any;
    excerpt?: string;
    featured_image?: string;
    author_id?: string;
    categories?: string[];
    tags?: string[];
    status: 'draft' | 'published';
    meta?: {
      title?: string;
      description?: string;
      canonical_url?: string;
    };
  }): Promise<any> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBlogPost(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteBlogPost(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getBlogCategories(siteId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('site_id', siteId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async createBlogCategory(category: {
    site_id: string;
    name: string;
    slug: string;
    description?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('blog_categories')
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}