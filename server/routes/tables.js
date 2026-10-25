const express = require('express');
const router = express.Router();
const { getTables, createTable, updateTable, updateTableStatus, deleteTable } = require('../controllers/tableController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', protect, getTables);
router.post('/', protect, restrictTo('admin', 'manager'), createTable);
router.put('/:id', protect, restrictTo('admin', 'manager'), updateTable);
router.patch('/:id/status', protect, updateTableStatus);
router.delete('/:id', protect, restrictTo('admin'), deleteTable);

module.exports = router;
