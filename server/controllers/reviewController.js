const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('order')
      .populate('menuItem', 'name')
      .populate('chef', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
