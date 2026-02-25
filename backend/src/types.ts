export type PropertyStatus = 'Available' | 'Reserved' | 'Rented' | 'Inactive';
export type LeadStatus = 'New' | 'Contacted' | 'Closed' | 'Lost';
export type LeadChannel = 'Instagram' | 'WhatsApp' | 'Call' | 'Web';

export interface StateChangeAudit<T> {
  from: T;
  to: T;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
  statusHistory: StateChangeAudit<PropertyStatus>[];
}

export interface LeadInteraction {
  id: string;
  leadId: string;
  type: 'NOTE';
  content: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  channel: LeadChannel;
  criteria?: string;
  budget: number;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  interactions: LeadInteraction[];
  statusHistory: StateChangeAudit<LeadStatus>[];
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
