const Reservation = require('../models/Reservation');

exports.getReservations = async (req, res) => {
  try {
    const { date, status, phone } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (phone) filter.customerPhone = phone;
    if (date) {
      const d = new Date(date);
      filter.date = {
        $gte: new Date(d.setHours(0, 0, 0, 0)),
        $lte: new Date(d.setHours(23, 59, 59, 999)),
      };
    }
    const reservations = await Reservation.find(filter)
      .populate('table', 'number label')
      .populate('handledBy', 'name')
      .sort('date time');
    res.json(reservations);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create({
      ...req.body,
      handledBy: req.user?.id,
    });
    res.status(201).json(reservation);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('table');
    res.json(reservation);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteReservation = async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reservation deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
