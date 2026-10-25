const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../index');
const User = require('../models/User');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Branch = require('../models/Branch');

describe('REST API Endpoints Integration Suite (Supertest + Jest)', () => {
  let testBranch;
  let testCategory;
  let testMenuItem;
  let adminToken;
  let adminUser;

  beforeEach(async () => {
    await User.deleteMany({});
    await Table.deleteMany({});
    await MenuItem.deleteMany({});
    await Category.deleteMany({});
    await Branch.deleteMany({});

    testBranch = await Branch.create({
      name: 'Main Flagship Branch',
      location: 'Downtown Center',
      contactEmail: 'flagship@rms.com',
      contactPhone: '9876543210',
    });

    testCategory = await Category.create({
      name: 'Main Course',
      slug: 'main-course',
    });

    testMenuItem = await MenuItem.create({
      name: 'Butter Chicken',
      description: 'Rich tomato cashew gravy',
      price: 320,
      category: testCategory._id,
      isAvailable: true,
    });

    adminUser = await User.create({
      name: 'Master Admin',
      email: 'admin@rms.com',
      password: 'password123',
      role: 'admin',
      branch: testBranch._id,
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@rms.com', password: 'password123' });

    adminToken = loginRes.body.token;
  });

  describe('GET /api/health', () => {
    it('should return 200 OK and health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body.time).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should fail with 400 when missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@rms.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/required/i);
    });

    it('should fail with 401 when password incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@rms.com', password: 'wrongPassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });

    it('should authenticate successfully and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@rms.com', password: 'password123' });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('admin@rms.com');
      expect(res.body.user.password).toBeUndefined();
    });
  });

  describe('GET /api/public/menu', () => {
    it('should return public menu items without authentication', async () => {
      const res = await request(app).get('/api/public/menu');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0].name).toBe('Butter Chicken');
    });
  });

  describe('Protected Routes Access Control', () => {
    it('should reject unauthenticated request to /api/tables with 401', async () => {
      const res = await request(app).get('/api/tables');
      expect(res.statusCode).toBe(401);
    });

    it('should allow authenticated admin to create and fetch tables', async () => {
      const createRes = await request(app)
        .post('/api/tables')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          branch: testBranch._id,
          number: 1,
          label: 'T-01',
          capacity: 4,
          location: 'indoor',
        });

      expect(createRes.statusCode).toBe(201);
      expect(createRes.body.number).toBe(1);

      const listRes = await request(app)
        .get('/api/tables')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(listRes.statusCode).toBe(200);
      expect(listRes.body.length).toBe(1);
      expect(listRes.body[0].label).toBe('T-01');
    });
  });

  describe('POST /api/public/orders', () => {
    it('should allow customer to place a public order with order number generated', async () => {
      const res = await request(app)
        .post('/api/public/orders')
        .send({
          customerName: 'Customer Test',
          customerPhone: '9123456789',
          branch: testBranch._id,
          type: 'takeaway',
          items: [
            {
              menuItem: testMenuItem._id,
              name: 'Butter Chicken',
              price: 320,
              quantity: 2,
            },
          ],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.orderNumber).toMatch(/^ORD-\d+$/);
      expect(res.body.subtotal).toBe(640);
      expect(res.body.tax).toBe(32); // 5% of 640
      expect(res.body.total).toBe(672);
    });
  });
});
