const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Branch = require('../models/Branch');

describe('Reservation Lifecycle & Capacity Suite', () => {
  let branch;

  beforeEach(async () => {
    await Reservation.deleteMany({});
    await Branch.deleteMany({});

    branch = await Branch.create({
      name: 'South Bombay Outlet',
      location: 'Marine Drive',
    });
  });

  it('should create a valid reservation with default pending status', async () => {
    const reservation = await Reservation.create({
      branch: branch._id,
      customerName: 'Ananya Roy',
      customerPhone: '9876543210',
      customerEmail: 'ananya@example.com',
      guestCount: 4,
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: '19:30',
      notes: 'Anniversary celebration, window table preferred',
      occasion: 'anniversary',
    });

    expect(reservation._id).toBeDefined();
    expect(reservation.status).toBe('pending');
    expect(reservation.guestCount).toBe(4);
    expect(reservation.occasion).toBe('anniversary');
  });

  it('should support reservation status progression (pending -> confirmed -> seated -> completed)', async () => {
    const res = await Reservation.create({
      branch: branch._id,
      customerName: 'Karan Mehra',
      customerPhone: '9123456780',
      guestCount: 2,
      date: new Date(Date.now() + 86400000),
      time: '20:00',
    });

    expect(res.status).toBe('pending');

    res.status = 'confirmed';
    await res.save();
    expect(res.status).toBe('confirmed');

    res.status = 'seated';
    await res.save();
    expect(res.status).toBe('seated');

    res.status = 'completed';
    await res.save();
    expect(res.status).toBe('completed');
  });

  it('should allow customer cancellation with reason', async () => {
    const res = await Reservation.create({
      branch: branch._id,
      customerName: 'Suresh Raina',
      customerPhone: '9888877777',
      guestCount: 6,
      date: new Date(Date.now() + 86400000),
      time: '21:00',
    });

    res.status = 'cancelled';
    res.notes = 'Cancelled: Change of plans';
    await res.save();

    expect(res.status).toBe('cancelled');
    expect(res.notes).toContain('Change of plans');
  });
});
