const User = require('../models/User');

exports.getStaff = async (req, res) => {
  try {
    const staff = await User.find().sort('-createdAt');
    res.json(staff);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createStaff = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateStaff = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteStaff = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
