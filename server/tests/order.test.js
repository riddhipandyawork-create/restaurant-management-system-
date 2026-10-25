const mongoose = require('mongoose');
const Order = require('../models/Order');

describe('Order Model & Calculation Lifecycle Suite', () => {
  beforeEach(async () => {
    await Order.deleteMany({});
  });

  it('should auto-generate an orderNumber with prefix ORD- on save', async () => {
    const dummyItemId = new mongoose.Types.ObjectId();
    const order = new Order({
      customerName: 'Rohan Sharma',
      customerPhone: '9876543210',
      items: [
        {
          menuItem: dummyItemId,
          name: 'Paneer Butter Masala',
          price: 280,
          quantity: 2,
        },
      ],
    });

    await order.save();

    expect(order.orderNumber).toBeDefined();
    expect(order.orderNumber).toMatch(/^ORD-\d+$/);
  });

  it('should accurately calculate subtotal, 5% GST tax, and total', async () => {
    const item1Id = new mongoose.Types.ObjectId();
    const item2Id = new mongoose.Types.ObjectId();

    // 2 x 250 = 500, 3 x 60 = 180 => Subtotal = 680
    // Tax 5% = 34.00
    // Discount = 50 => Total = 680 + 34 - 50 = 664.00
    const order = new Order({
      customerName: 'Priya Patel',
      items: [
        { menuItem: item1Id, name: 'Biryani Special', price: 250, quantity: 2 },
        { menuItem: item2Id, name: 'Garlic Naan', price: 60, quantity: 3 },
      ],
      discount: 50,
    });

    await order.save();

    expect(order.subtotal).toBe(680);
    expect(order.tax).toBe(34.0);
    expect(order.total).toBe(664.0);
  });

  it('should handle zero discount properly', async () => {
    const itemId = new mongoose.Types.ObjectId();
    const order = new Order({
      customerName: 'Amit Verma',
      items: [
        { menuItem: itemId, name: 'Cold Coffee', price: 120, quantity: 1 },
      ],
    });

    await order.save();

    expect(order.subtotal).toBe(120);
    expect(order.tax).toBe(6.0); // 5% of 120
    expect(order.total).toBe(126.0);
  });

  it('should support full order status lifecycle transitions', async () => {
    const itemId = new mongoose.Types.ObjectId();
    const order = await Order.create({
      items: [{ menuItem: itemId, name: 'Masala Dosa', price: 100, quantity: 1 }],
    });

    expect(order.status).toBe('pending');

    const statuses = ['confirmed', 'preparing', 'ready', 'served', 'billed'];
    for (const st of statuses) {
      order.status = st;
      await order.save();
      expect(order.status).toBe(st);
    }
  });

  it('should reject invalid order status values', async () => {
    const itemId = new mongoose.Types.ObjectId();
    const order = new Order({
      items: [{ menuItem: itemId, name: 'Burger', price: 150, quantity: 1 }],
      status: 'invalid_status_xyz',
    });

    await expect(order.save()).rejects.toThrow();
  });

  it('should default to unpaid payment status and allow payment completion', async () => {
    const itemId = new mongoose.Types.ObjectId();
    const order = await Order.create({
      items: [{ menuItem: itemId, name: 'Pizza', price: 350, quantity: 1 }],
    });

    expect(order.paymentStatus).toBe('unpaid');

    order.paymentStatus = 'paid';
    await order.save();
    expect(order.paymentStatus).toBe('paid');

    order.paymentStatus = 'refunded';
    await order.save();
    expect(order.paymentStatus).toBe('refunded');
  });
});
