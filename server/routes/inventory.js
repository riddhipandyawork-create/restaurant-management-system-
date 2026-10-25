const express = require('express');
const router = express.Router();
const { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(authorize('admin', 'manager', 'chef'), getInventory).post(authorize('admin', 'manager'), createInventoryItem);
router.route('/:id').put(authorize('admin', 'manager'), updateInventoryItem).delete(authorize('admin', 'manager'), deleteInventoryItem);

module.exports = router;
