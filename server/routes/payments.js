const express = require('express');
const router = express.Router();
const { getPayments, createPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(authorize('admin', 'manager', 'cashier', 'waiter'), getPayments).post(authorize('admin', 'manager', 'cashier', 'waiter'), createPayment);

module.exports = router;
