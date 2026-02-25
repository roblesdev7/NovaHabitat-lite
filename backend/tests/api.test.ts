import request from 'supertest';
import { app, resetDb } from '../src/app';

describe('NovaHabitat Lite API', () => {
  beforeEach(() => {
    resetDb();
  });

  test('WI-01 create property returns 201', async () => {
    const res = await request(app).post('/properties').send({
      title: 'Casa en Arroyo Hondo',
      location: 'Arroyo Hondo, Santo Domingo',
      price: 250000,
      status: 'Available',
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.price).toBe(250000);
  });

  test('WI-02 edit property returns 200 and 404 when missing', async () => {
    const ok = await request(app).put('/properties/prop-1').send({
      title: 'Apto 2 hab en Naco - actualizado',
      price: 190000,
    });

    expect(ok.status).toBe(200);
    expect(ok.body.title).toContain('actualizado');

    const missing = await request(app).put('/properties/prop-999').send({ title: 'No existe' });
    expect(missing.status).toBe(404);
  });

  test('WI-03 property status change stores audit', async () => {
    const res = await request(app).patch('/properties/prop-1/status').send({
      status: 'Reserved',
      changedBy: 'agent-1',
      reason: 'Cliente separó',
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Reserved');
    expect(res.body.statusHistory.length).toBe(1);
    expect(res.body.statusHistory[0].changedBy).toBe('agent-1');
  });

  test('RB-05 invalid transition to Rented returns 409', async () => {
    await request(app).patch('/properties/prop-1/status').send({
      status: 'Inactive',
      changedBy: 'agent-1',
    });

    const res = await request(app).patch('/properties/prop-1/status').send({
      status: 'Rented',
      changedBy: 'agent-2',
    });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('INVALID_STATUS_TRANSITION');
  });

  test('WI-04 list properties with filters returns 200', async () => {
    const res = await request(app).get('/properties?status=Available&minPrice=100000&maxPrice=200000');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('WI-05 create lead returns 201 and RB-04 returns 400 for negative budget', async () => {
    const ok = await request(app).post('/leads').send({
      name: 'Luis Gómez',
      channel: 'Instagram',
      criteria: '2 habitaciones',
      budget: 210000,
    });

    expect(ok.status).toBe(201);
    expect(ok.body.status).toBe('New');

    const bad = await request(app).post('/leads').send({
      name: 'Lead inválido',
      channel: 'Web',
      budget: -10,
    });

    expect(bad.status).toBe(400);
    expect(bad.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('WI-06 add interaction returns 201 and 404 if lead missing', async () => {
    const ok = await request(app).post('/leads/lead-1/interactions').send({
      type: 'NOTE',
      content: 'Cliente solicita visita el sábado.',
    });

    expect(ok.status).toBe(201);
    expect(ok.body.type).toBe('NOTE');

    const missing = await request(app).post('/leads/lead-999/interactions').send({
      type: 'NOTE',
      content: 'No existe',
    });

    expect(missing.status).toBe(404);
  });

  test('WI-07 lead status change to Contacted returns 200', async () => {
    const res = await request(app).patch('/leads/lead-1/status').send({
      status: 'Contacted',
      changedBy: 'agent-1',
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Contacted');
    expect(res.body.statusHistory[0].changedBy).toBe('agent-1');
  });

  test('RB-06 changing lead to Closed without interaction returns 409', async () => {
    const res = await request(app).patch('/leads/lead-1/status').send({
      status: 'Closed',
      changedBy: 'agent-1',
    });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('LEAD_CANNOT_CLOSE');
  });

  test('WI-08 get lead returns interactions timeline', async () => {
    await request(app).post('/leads/lead-1/interactions').send({
      type: 'NOTE',
      content: 'Primera llamada',
    });

    const res = await request(app).get('/leads/lead-1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.interactions)).toBe(true);
    expect(res.body.interactions.length).toBeGreaterThan(0);
  });

  test('WI-09 search leads by channel and status returns 200', async () => {
    await request(app).patch('/leads/lead-1/status').send({
      status: 'Contacted',
      changedBy: 'agent-1',
    });

    const res = await request(app).get('/leads?channel=Instagram&status=Contacted');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('RB-08 invalid payload returns clear error structure', async () => {
    const res = await request(app).post('/properties').send({
      title: '',
      location: '',
      price: -1,
      status: 'BadState',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toBeDefined();
  });
});
