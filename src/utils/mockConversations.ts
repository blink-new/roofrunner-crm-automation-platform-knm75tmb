import { faker } from '@faker-js/faker';
import { Thread, Message, Contact } from '../types/conversations';

export const generateContact = (): Contact => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  avatar: faker.image.avatar()
});

export const generateMessage = (sender: 'user' | 'contact'): Message => ({
  id: faker.string.uuid(),
  content: faker.lorem.sentence(),
  sender,
  timestamp: faker.date.recent(),
  attachment: Math.random() > 0.8 ? {
    id: faker.string.uuid(),
    filename: faker.system.fileName(),
    url: faker.internet.url(),
    type: 'document',
    size: faker.number.int({ min: 1024, max: 10240 })
  } : undefined
});

export const generateThread = (): Thread => {
  const contact = generateContact();
  const messages = Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () =>
    generateMessage(Math.random() > 0.5 ? 'user' : 'contact')
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return {
    id: faker.string.uuid(),
    contact,
    messages,
    lastMessage: messages[messages.length - 1],
    unreadCount: faker.number.int({ min: 0, max: 5 }),
    channel: faker.helpers.arrayElement(['sms', 'email', 'phone']),
    status: faker.helpers.arrayElement(['active', 'archived', 'spam'])
  };
};

export const generateThreads = (count: number): Thread[] =>
  Array.from({ length: count }, generateThread)
    .sort((a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime());