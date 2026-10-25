const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const Branch = require('../models/Branch');

describe('Inventory & Stock Management Suite', () => {
  let branch;

  beforeEach(async () => {
    await Inventory.deleteMany({});
    await Branch.deleteMany({});

    branch = await Branch.create({
      name: 'North Branch',
      location: 'Andheri West',
    });
  });

  it('should track stock levels and identify items below threshold', async () => {
    const basmatiRice = await Inventory.create({
      branch: branch._id,
      itemName: 'Basmati Rice',
      quantity: 50,
      unit: 'kg',
      lowStockThreshold: 15,
    });

    const cookingOil = await Inventory.create({
      branch: branch._id,
      itemName: 'Refined Oil',
      quantity: 8,
      unit: 'liters',
      lowStockThreshold: 10,
    });

    expect(basmatiRice.quantity).toBeGreaterThan(basmatiRice.lowStockThreshold);
    expect(cookingOil.quantity).toBeLessThanOrEqual(cookingOil.lowStockThreshold);
  });

  it('should accurately decrement inventory after stock consumption', async () => {
    const cheese = await Inventory.create({
      branch: branch._id,
      itemName: 'Mozzarella Cheese',
      quantity: 20,
      unit: 'kg',
    });

    // Simulate deduction for order
    cheese.quantity -= 3.5;
    await cheese.save();

    const updated = await Inventory.findById(cheese._id);
    expect(updated.quantity).toBe(16.5);
  });
});
