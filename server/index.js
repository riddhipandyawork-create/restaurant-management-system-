require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const tableRoutes = require('./routes/tables');
const reservationRoutes = require('./routes/reservations');
const staffRoutes = require('./routes/staff');
const inventoryRoutes = require('./routes/inventory');
const branchRoutes = require('./routes/branches');
const paymentRoutes = require('./routes/payments');
const reviewRoutes = require('./routes/reviews');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Socket handlers
const registerOrderSocket = require('./sockets/orderSocket');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach io to requests so controllers can emit
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/public', require('./routes/public'));
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'OK', time: new Date() }));

// Socket.io
registerOrderSocket(io);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 RMS Server running on http://localhost:${PORT}`);
      console.log(`🔌 Socket.io ready`);
    });
  });
}

module.exports = { app, httpServer };

