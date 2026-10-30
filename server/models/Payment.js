const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'online'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
    },
    invoiceNumber: { type: String, unique: true },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

paymentSchema.pre('save', function () {
  if (!this.invoiceNumber && this.status === 'completed') {
    this.invoiceNumber = 'INV-' + Date.now().toString().slice(-6) + Math.floor(10 + Math.random() * 90);
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
