import { faker } from '@faker-js/faker';
import type { Contact } from '../types/contacts';

export const generateContact = (): Contact => ({
  id: faker.string.uuid(),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  user_id: faker.string.uuid(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  type: faker.helpers.arrayElement(['lead', 'customer', 'prospect']),
  status: faker.helpers.arrayElement(['active', 'inactive']),
  tags: Array.from({ length: faker.number.int({ min: 0, max: 4 }) }, () => 
    faker.helpers.arrayElement(['VIP', 'Lead', 'Customer', 'Prospect', 'Support', 'Partner'])
  ),
  custom_fields: {
    company: faker.company.name(),
    website: faker.internet.url(),
    industry: faker.company.buzzPhrase(),
    source: faker.helpers.arrayElement(['Website', 'Referral', 'Google', 'Facebook']),
    notes: faker.lorem.paragraph()
  },
  dnd_settings: {
    all: false,
    sms: faker.datatype.boolean(),
    calls: faker.datatype.boolean()
  }
});

export const generateContacts = (count: number): Contact[] =>
  Array.from({ length: count }, generateContact)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());