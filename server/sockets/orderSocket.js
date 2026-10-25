module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on('join:kitchen', () => {
      socket.join('kitchen');
      console.log(`🍳 Kitchen joined: ${socket.id}`);
    });

    socket.on('join:waiter', (waiterId) => {
      socket.join(`waiter:${waiterId}`);
    });

    socket.on('order:statusChange', (data) => {
      io.emit('order:updated', data);
    });

    socket.on('kitchen:itemReady', (data) => {
      io.emit('order:itemUpdated', data);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};
