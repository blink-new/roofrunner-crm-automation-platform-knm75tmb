import { supabase } from '../supabase';

export class RoomService {
  static async getRooms() {
    const { data, error } = await supabase
      .from('calendar_rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createRoom(room: {
    name: string;
    type: 'room' | 'equipment';
    capacity?: number;
    location?: string;
    description?: string;
    availability: {
      days: number[];
      start_time: string;
      end_time: string;
    };
    features: string[];
  }) {
    const { data, error } = await supabase
      .from('calendar_rooms')
      .insert([room])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateRoom(
    id: string,
    updates: Partial<{
      name: string;
      capacity: number;
      location: string;
      description: string;
      availability: {
        days: number[];
        start_time: string;
        end_time: string;
      };
      features: string[];
      status: 'available' | 'maintenance' | 'inactive';
    }>
  ) {
    const { data, error } = await supabase
      .from('calendar_rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteRoom(id: string) {
    const { error } = await supabase
      .from('calendar_rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async checkAvailability(
    roomId: string,
    start: string,
    end: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('check_room_availability', {
        room_id: roomId,
        start_time: start,
        end_time: end
      });

    if (error) throw error;
    return data;
  }
}