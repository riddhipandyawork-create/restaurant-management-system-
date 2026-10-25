const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/dish-chef', analyticsController.getDishChefAnalysis);
router.get('/star-chef', analyticsController.getStarChef);
router.get('/forecast', analyticsController.getForecasting);

module.exports = router;
