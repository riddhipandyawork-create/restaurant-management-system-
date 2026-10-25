const express = require('express');
const router = express.Router();
const {
  getOrders, getOrder, createOrder, updateOrderStatus,
  updateItemStatus, deleteOrder, getDashboardStats,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, createOrder);
router.patch('/:id/status', protect, updateOrderStatus);
router.patch('/:id/item-status', protect, updateItemStatus);
router.delete('/:id', protect, deleteOrder);

module.exports = router;
