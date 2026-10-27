const Order = require('../models/Order');
const Table = require('../models/Table');

exports.getOrders = async (req, res) => {
  try {
    const { status, type, date } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (date) {
      const d = new Date(date);
      filter.createdAt = {
        $gte: new Date(d.setHours(0, 0, 0, 0)),
        $lte: new Date(d.setHours(23, 59, 59, 999)),
      };
    }
    const orders = await Order.find(filter)
      .populate('table', 'number label')
      .populate('waiter', 'name')
      .populate('chef', 'name')
      .populate('items.menuItem', 'name image')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table')
      .populate('waiter', 'name')
      .populate('items.menuItem');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('table')
      .populate('items.menuItem');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createOrder = async (req, res) => {
  try {
    const body = { ...req.body, waiter: req.user?.id };

    // If customer sends tableNumber (string), resolve to Table ObjectId
    if (!body.table && body.tableNumber) {
      const tableDoc = await Table.findOne({ number: parseInt(body.tableNumber) });
      if (tableDoc) body.table = tableDoc._id;
      delete body.tableNumber;
    }

    const order = await Order.create(body);
    
    // Auto Inventory Deduction
    if (order.items && order.items.length > 0) {
      const MenuItem = require('../models/MenuItem');
      const Inventory = require('../models/Inventory');
      
      for (const item of order.items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (menuItem && menuItem.ingredients && menuItem.ingredients.length > 0) {
          for (const ing of menuItem.ingredients) {
            await Inventory.findByIdAndUpdate(ing.item, {
              $inc: { quantity: -(ing.quantity * item.quantity) }
            });
          }
        }
      }
    }

    // Update table status
    if (order.table) {
      await Table.findByIdAndUpdate(order.table, {
        status: 'occupied',
        currentOrder: order._id,
      });
    }
    const populated = await order.populate(['table', 'items.menuItem']);
    req.io?.emit('order:new', populated);
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const updateData = { status };
    if (status === 'preparing' && req.user?.role === 'kitchen') {
      updateData.chef = req.user.id;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('table').populate('items.menuItem').populate('chef', 'name');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // If order is billed or cancelled, free the table
    if (['billed', 'cancelled'].includes(status) && order.table) {
      await Table.findByIdAndUpdate(order.table._id, {
        status: 'cleaning',
        currentOrder: null,
      });
    }

    req.io?.emit('order:updated', order);
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateItemStatus = async (req, res) => {
  try {
    const { itemId, status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.status = status;
    await order.save();

    req.io?.emit('order:itemUpdated', { orderId: order._id, itemId, status });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── Dashboard stats ────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOf24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const rawTodayCount = await Order.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
    const effectiveStart = rawTodayCount >= 5 ? startOfDay : startOf24h;

    const [todayOrders, totalOrders, revenue, topItems, pendingKitchen, occupiedTables, totalTables, recentOrders] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: effectiveStart } }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: 'billed', createdAt: { $gte: effectiveStart } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        { 
          $group: { 
            _id: '$items.menuItem', 
            count: { $sum: '$items.quantity' }, 
            name: { $first: '$items.name' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          } 
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Order.countDocuments({ status: { $in: ['confirmed', 'preparing'] } }),
      Table.countDocuments({ status: 'occupied' }),
      Table.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(6).populate('table', 'number capacity status'),
    ]);

    const last7Days = await Order.aggregate([
      {
        $match: {
          status: 'billed',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      todayOrders,
      totalOrders,
      todayRevenue: revenue[0]?.total || 0,
      topItems,
      last7Days,
      pendingKitchen,
      occupiedTables,
      totalTables,
      recentOrders,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
