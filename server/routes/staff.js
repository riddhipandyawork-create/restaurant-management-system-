const express = require('express');
const router = express.Router();
const { getStaff, createStaff, updateStaff, deleteStaff } = require('../controllers/staffController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', protect, restrictTo('admin', 'manager'), getStaff);
router.post('/', protect, restrictTo('admin'), createStaff);
router.put('/:id', protect, restrictTo('admin', 'manager'), updateStaff);
router.delete('/:id', protect, restrictTo('admin'), deleteStaff);

module.exports = router;
