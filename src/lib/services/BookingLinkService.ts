import { supabase } from '../supabase';

export class BookingLinkService {
  static async getBookingLinks() {
    const { data, error } = await supabase
      .from('calendar_booking_links')
      .select(`
        *,
        service:calendar_services(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createBookingLink(link: {
    name: string;
    service_id?: string;
    type: 'permanent' | 'one-time';
    expires_at?: string;
  }) {
    const { data, error } = await supabase
      .from('calendar_booking_links')
      .insert([{
        ...link,
        slug: await this.generateSlug(link.name)
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteBookingLink(id: string) {
    const { error } = await supabase
      .from('calendar_booking_links')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private static async generateSlug(name: string) {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { data } = await supabase
      .from('calendar_booking_links')
      .select('slug')
      .like('slug', `${baseSlug}%`);

    if (!data?.length) return baseSlug;

    const slugNumber = data.length + 1;
    return `${baseSlug}-${slugNumber}`;
  }
}