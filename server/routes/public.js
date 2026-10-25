const express = require('express');
const router = express.Router();
const { getCategories, getMenuItems } = require('../controllers/menuController');
const { createOrder, getOrderByNumber } = require('../controllers/orderController');
const { createReservation, getReservations } = require('../controllers/reservationController');
const { createReview } = require('../controllers/reviewController');

// Public Menu Routes
router.get('/menu/categories', getCategories);
router.get('/menu', getMenuItems);

// Public Ordering Route
router.post('/orders', createOrder);
router.get('/orders/:orderNumber', getOrderByNumber);

// Public Reservation Route
router.get('/reservations', getReservations);
router.post('/reservations', createReservation);

// Public Reviews Route
router.post('/reviews', createReview);

module.exports = router;
