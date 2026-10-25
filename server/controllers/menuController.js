const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

// ── Categories ────────────────────────────────────────────────
exports.getCategories = async (req, res) => {
  try {
    const cats = await Category.find({ isActive: true }).sort('sortOrder');
    res.json(cats);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createCategory = async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── Menu Items ────────────────────────────────────────────────
exports.getMenuItems = async (req, res) => {
  try {
    const { category, available, special, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (available !== undefined) filter.isAvailable = available === 'true';
    if (special !== undefined) filter.isSpecial = special === 'true';
    if (search) filter.name = { $regex: search, $options: 'i' };

    const items = await MenuItem.find(filter).populate('category').sort('sortOrder name');
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).populate('category');
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
