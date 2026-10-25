const express = require('express');
const router = express.Router();
const { getReviews, createReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getReviews).post(createReview);

module.exports = router;
