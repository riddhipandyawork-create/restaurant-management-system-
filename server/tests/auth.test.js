const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

describe('User Model & Authentication Suite', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('User Model Methods & Hooks', () => {
    it('should securely hash password with bcrypt on save', async () => {
      const rawPassword = 'secretPassword123';
      const user = await User.create({
        name: 'John Admin',
        email: 'john@rms.com',
        password: rawPassword,
        role: 'admin',
      });

      expect(user.password).not.toBe(rawPassword);
      expect(user.password).toMatch(/^\$2[aby]\$\d+\$/);
    });

    it('should correctly compare valid and invalid passwords', async () => {
      const user = await User.create({
        name: 'Manager Bob',
        email: 'bob@rms.com',
        password: 'correctPassword',
        role: 'manager',
      });

      const isMatch = await user.comparePassword('correctPassword');
      const isMismatch = await user.comparePassword('wrongPassword');

      expect(isMatch).toBe(true);
      expect(isMismatch).toBe(false);
    });

    it('should strip password from JSON serialization', async () => {
      const user = await User.create({
        name: 'Cashier Alice',
        email: 'alice@rms.com',
        password: 'password123',
        role: 'cashier',
      });

      const jsonUser = user.toJSON();
      expect(jsonUser.password).toBeUndefined();
      expect(jsonUser.email).toBe('alice@rms.com');
      expect(jsonUser.role).toBe('cashier');
    });

    it('should reject duplicate email registrations', async () => {
      await User.create({
        name: 'User One',
        email: 'duplicate@rms.com',
        password: 'password123',
      });

      await expect(
        User.create({
          name: 'User Two',
          email: 'duplicate@rms.com',
          password: 'password456',
        })
      ).rejects.toThrow();
    });

    it('should only permit defined staff roles', async () => {
      const validRoles = ['admin', 'manager', 'cashier', 'waiter', 'kitchen'];
      for (const role of validRoles) {
        const u = new User({
          name: `${role} user`,
          email: `${role}@rms.com`,
          password: 'password123',
          role,
        });
        await expect(u.validate()).resolves.toBeUndefined();
      }

      const invalidUser = new User({
        name: 'Invalid Role',
        email: 'invalid@rms.com',
        password: 'password123',
        role: 'superhero',
      });
      await expect(invalidUser.validate()).rejects.toThrow();
    });
  });

  describe('Auth Middleware (protect & restrictTo)', () => {
    it('protect: should reject requests with no Authorization header', async () => {
      const req = { headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Not authenticated' })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('protect: should reject invalid or expired tokens', async () => {
      const req = {
        headers: { authorization: 'Bearer invalid.token.value' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid token' })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('protect: should attach user to req when valid token provided', async () => {
      const user = await User.create({
        name: 'Waiter Mike',
        email: 'mike@rms.com',
        password: 'password123',
        role: 'waiter',
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const req = {
        headers: { authorization: `Bearer ${token}` },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.email).toBe('mike@rms.com');
    });

    it('restrictTo: should block unauthorized roles with 403', () => {
      const req = { user: { role: 'waiter' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const middleware = restrictTo('admin', 'manager');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('restrictTo: should grant access to authorized roles', () => {
      const req = { user: { role: 'manager' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const middleware = restrictTo('admin', 'manager');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
