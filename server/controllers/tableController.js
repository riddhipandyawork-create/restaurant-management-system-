const Table = require('../models/Table');

exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true })
      .populate('currentOrder', 'orderNumber status total')
      .sort('number');
    res.json(tables);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json(table);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate('currentOrder');
    res.json(table);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateTableStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    req.io?.emit('table:updated', table);
    res.json(table);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: 'Table deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
