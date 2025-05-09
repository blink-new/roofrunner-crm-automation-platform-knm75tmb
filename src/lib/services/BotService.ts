import { supabase } from '../supabase';

export class BotService {
  static async getBots() {
    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateBot(id: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('bots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteBot(id: string) {
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async runBot(botId: string, input: string) {
    const { data, error } = await supabase
      .functions
      .invoke('run-bot', {
        body: { bot_id: botId, input }
      });

    if (error) throw error;
    return data;
  }

  static streamResponses(botId: string, onMessage: (response: string) => void) {
    const subscription = supabase
      .channel(`bot-${botId}`)
      .on('bot_response', (response) => {
        onMessage(response.payload.content);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}