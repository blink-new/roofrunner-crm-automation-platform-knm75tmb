export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  attachment?: Attachment;
}

export interface Thread {
  id: string;
  contact: Contact;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
  channel: 'sms' | 'email' | 'phone';
  status: 'active' | 'archived' | 'spam';
}