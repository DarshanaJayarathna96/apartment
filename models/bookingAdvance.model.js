import  mongoose from 'mongoose';
// const mongoose = require("mongoose");

const BookingAdvanceSchema = new mongoose.Schema(
  {
    advance_amount: {
      type: Number,
      required: true,
    },
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    date: {
      type: String,
      default: new Date()
    },
  },
  { timestamps: true },
);

export default mongoose.model('BookingAdvance', BookingAdvanceSchema, 'BookingAdvance');
