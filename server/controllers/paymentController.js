const Payment = require('../models/Payment');
const Order = require('../models/Order');

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
      await Order.findByIdAndUpdate(payment.order, { status: 'billed', paymentStatus: 'paid' });
    }
    res.status(201).json(payment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
