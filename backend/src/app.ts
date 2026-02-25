import cors from 'cors';
import express, { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { z } from 'zod';
import { getDb, nextInteractionId, nextLeadId, nextPropertyId, resetDb } from './store';
import { LeadStatus, PropertyStatus } from './types';

const propertyStatusSchema = z.enum(['Available', 'Reserved', 'Rented', 'Inactive']);
const leadStatusSchema = z.enum(['New', 'Contacted', 'Closed', 'Lost']);
const channelSchema = z.enum(['Instagram', 'WhatsApp', 'Call', 'Web']);

const createPropertySchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1),
  price: z.number().min(0),
  status: propertyStatusSchema.default('Available'),
});

const updatePropertySchema = z.object({
  title: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  status: propertyStatusSchema.optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

const changePropertyStatusSchema = z.object({
  status: propertyStatusSchema,
  changedBy: z.string().min(1),
  reason: z.string().min(1).optional(),
});

const createLeadSchema = z.object({
  name: z.string().min(1),
  channel: channelSchema,
  criteria: z.string().min(1).optional(),
  budget: z.number().min(0),
});

const addInteractionSchema = z.object({
  type: z.literal('NOTE'),
  content: z.string().min(1),
});

const changeLeadStatusSchema = z.object({
  status: leadStatusSchema,
  changedBy: z.string().min(1),
  reason: z.string().min(1).optional(),
});

function errorResponse(res: Response, status: number, code: string, message: string, details?: unknown) {
  return res.status(status).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
}

function canMovePropertyToRented(currentStatus: PropertyStatus) {
  return currentStatus === 'Available' || currentStatus === 'Reserved';
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'frontend')));

const openApiPath = path.join(process.cwd(), 'backend', 'openapi.yaml');
if (fs.existsSync(openApiPath)) {
  const openApiDoc = YAML.parse(fs.readFileSync(openApiPath, 'utf8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
}

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/properties', (req, res) => {
  const parsed = createPropertySchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid property payload', parsed.error.flatten());
  }

  const now = new Date().toISOString();
  const property = {
    id: nextPropertyId(),
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
    statusHistory: [],
  };

  getDb().properties.push(property);
  return res.status(201).json(property);
});

app.put('/properties/:id', (req, res) => {
  const parsed = updatePropertySchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid property update payload', parsed.error.flatten());
  }

  const property = getDb().properties.find((item) => item.id === req.params.id);
  if (!property) {
    return errorResponse(res, 404, 'PROPERTY_NOT_FOUND', 'Property not found');
  }

  Object.assign(property, parsed.data);
  property.updatedAt = new Date().toISOString();
  return res.status(200).json(property);
});

app.patch('/properties/:id/status', (req, res) => {
  const parsed = changePropertyStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid status change payload', parsed.error.flatten());
  }

  const property = getDb().properties.find((item) => item.id === req.params.id);
  if (!property) {
    return errorResponse(res, 404, 'PROPERTY_NOT_FOUND', 'Property not found');
  }

  const { status, changedBy, reason } = parsed.data;

  if (status === 'Rented' && !canMovePropertyToRented(property.status)) {
    return errorResponse(
      res,
      409,
      'INVALID_STATUS_TRANSITION',
      'Property can only move to Rented from Available or Reserved'
    );
  }

  if (status === property.status) {
    return res.status(200).json(property);
  }

  property.statusHistory.push({
    from: property.status,
    to: status,
    changedBy,
    changedAt: new Date().toISOString(),
    ...(reason ? { reason } : {}),
  });
  property.status = status;
  property.updatedAt = new Date().toISOString();

  return res.status(200).json(property);
});

app.get('/properties', (req, res) => {
  const status = req.query.status as PropertyStatus | undefined;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const locationKeyword = (req.query.locationKeyword as string | undefined)?.toLowerCase();

  let filtered = [...getDb().properties];

  if (status) {
    if (!propertyStatusSchema.safeParse(status).success) {
      return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid status filter');
    }
    filtered = filtered.filter((item) => item.status === status);
  }

  if (Number.isFinite(minPrice)) {
    filtered = filtered.filter((item) => item.price >= (minPrice as number));
  }

  if (Number.isFinite(maxPrice)) {
    filtered = filtered.filter((item) => item.price <= (maxPrice as number));
  }

  if (locationKeyword) {
    filtered = filtered.filter((item) => item.location.toLowerCase().includes(locationKeyword));
  }

  return res.status(200).json(filtered);
});

app.post('/leads', (req, res) => {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid lead payload', parsed.error.flatten());
  }

  const now = new Date().toISOString();
  const lead = {
    id: nextLeadId(),
    name: parsed.data.name,
    channel: parsed.data.channel,
    criteria: parsed.data.criteria,
    budget: parsed.data.budget,
    status: 'New' as LeadStatus,
    createdAt: now,
    updatedAt: now,
    interactions: [],
    statusHistory: [],
  };

  getDb().leads.push(lead);
  return res.status(201).json(lead);
});

app.get('/leads', (req, res) => {
  const channel = req.query.channel as string | undefined;
  const status = req.query.status as string | undefined;

  let filtered = [...getDb().leads];

  if (channel) {
    if (!channelSchema.safeParse(channel).success) {
      return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid channel filter');
    }
    filtered = filtered.filter((item) => item.channel === channel);
  }

  if (status) {
    if (!leadStatusSchema.safeParse(status).success) {
      return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid status filter');
    }
    filtered = filtered.filter((item) => item.status === status);
  }

  return res.status(200).json(filtered);
});

app.post('/leads/:id/interactions', (req, res) => {
  const parsed = addInteractionSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid interaction payload', parsed.error.flatten());
  }

  const lead = getDb().leads.find((item) => item.id === req.params.id);
  if (!lead) {
    return errorResponse(res, 404, 'LEAD_NOT_FOUND', 'Lead not found');
  }

  const interaction = {
    id: nextInteractionId(),
    leadId: lead.id,
    type: parsed.data.type,
    content: parsed.data.content,
    createdAt: new Date().toISOString(),
  };

  lead.interactions.push(interaction);
  lead.updatedAt = new Date().toISOString();

  return res.status(201).json(interaction);
});

app.patch('/leads/:id/status', (req, res) => {
  const parsed = changeLeadStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid status change payload', parsed.error.flatten());
  }

  const lead = getDb().leads.find((item) => item.id === req.params.id);
  if (!lead) {
    return errorResponse(res, 404, 'LEAD_NOT_FOUND', 'Lead not found');
  }

  const { status, changedBy, reason } = parsed.data;

  if (status === 'Closed' && lead.interactions.length < 1) {
    return errorResponse(
      res,
      409,
      'LEAD_CANNOT_CLOSE',
      'Lead cannot be Closed without at least one interaction'
    );
  }

  if (status === lead.status) {
    return res.status(200).json(lead);
  }

  lead.statusHistory.push({
    from: lead.status,
    to: status,
    changedBy,
    changedAt: new Date().toISOString(),
    ...(reason ? { reason } : {}),
  });
  lead.status = status;
  lead.updatedAt = new Date().toISOString();

  return res.status(200).json(lead);
});

app.get('/leads/:id', (req, res) => {
  const lead = getDb().leads.find((item) => item.id === req.params.id);
  if (!lead) {
    return errorResponse(res, 404, 'LEAD_NOT_FOUND', 'Lead not found');
  }

  const orderedInteractions = [...lead.interactions].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return res.status(200).json({ ...lead, interactions: orderedInteractions });
});

app.use((req, res) => {
  return errorResponse(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`);
});

export { app, resetDb };
