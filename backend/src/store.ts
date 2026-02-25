import { Lead, Property } from './types';

interface Db {
  properties: Property[];
  leads: Lead[];
}

const initialProperty: Property = {
  id: 'prop-1',
  title: 'Apto 2 hab en Naco',
  location: 'Naco, Santo Domingo',
  price: 185000,
  status: 'Available',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  statusHistory: [],
};

const initialLead: Lead = {
  id: 'lead-1',
  name: 'Ana Pérez',
  channel: 'Instagram',
  criteria: 'Busca 2 hab',
  budget: 200000,
  status: 'New',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  interactions: [],
  statusHistory: [],
};

const db: Db = {
  properties: [structuredClone(initialProperty)],
  leads: [structuredClone(initialLead)],
};

let propertyCounter = 2;
let leadCounter = 2;
let interactionCounter = 1;

export function nextPropertyId() {
  return `prop-${propertyCounter++}`;
}

export function nextLeadId() {
  return `lead-${leadCounter++}`;
}

export function nextInteractionId() {
  return `int-${interactionCounter++}`;
}

export function getDb() {
  return db;
}

export function resetDb() {
  db.properties = [structuredClone(initialProperty)];
  db.leads = [structuredClone(initialLead)];
  propertyCounter = 2;
  leadCounter = 2;
  interactionCounter = 1;
}
