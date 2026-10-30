const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Table = require('../models/Table');

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('order').populate('branch', 'name').sort('-createdAt');
    res.json(payments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({ ...req.body, processedBy: req.user?.id });
    if (payment.status === 'completed') {
      const order = await Order.findByIdAndUpdate(
        payment.order, 
        { status: 'billed', paymentStatus: 'paid' }, 
        { returnDocument: 'after' }
      ).populate('table');

      if (order?.table) {
        const tableId = order.table._id || order.table;
        await Table.findByIdAndUpdate(tableId, {
          status: 'cleaning',
          currentOrder: null,
        });
      }

      req.io?.emit('order:updated', order);
      req.io?.emit('payment:created', payment);
    }
    res.status(201).json(payment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
