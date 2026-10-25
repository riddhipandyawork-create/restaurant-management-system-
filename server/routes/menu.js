const express = require('express');
const router = express.Router();
const {
  getCategories, createCategory, updateCategory, deleteCategory,
  getMenuItems, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability,
} = require('../controllers/menuController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/categories', getCategories);
router.post('/categories', protect, restrictTo('admin', 'manager'), createCategory);
router.put('/categories/:id', protect, restrictTo('admin', 'manager'), updateCategory);
router.delete('/categories/:id', protect, restrictTo('admin'), deleteCategory);

router.get('/', getMenuItems);
router.get('/:id', getMenuItem);
router.post('/', protect, restrictTo('admin', 'manager'), createMenuItem);
router.put('/:id', protect, restrictTo('admin', 'manager'), updateMenuItem);
router.delete('/:id', protect, restrictTo('admin'), deleteMenuItem);
router.patch('/:id/toggle', protect, restrictTo('admin', 'manager'), toggleAvailability);

module.exports = router;
