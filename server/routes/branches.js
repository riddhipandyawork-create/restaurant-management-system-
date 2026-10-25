const express = require('express');
const router = express.Router();
const { getBranches, createBranch, updateBranch } = require('../controllers/branchController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(authorize('admin', 'manager'), getBranches).post(authorize('admin'), createBranch);
router.route('/:id').put(authorize('admin'), updateBranch);

module.exports = router;
