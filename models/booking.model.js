import mongoose from 'mongoose';
// const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    advance: {
      type: String,
      required: true,
    },
    arrival: {
      type: String,
      required: true,
    },
    departure: {
      type: String,
      required: true,
    },
    no_of_adults: {
      type: Number,
      required: true,
    },
    no_of_children: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    guest_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guest',
    },
    note: {
      type: String
    },
    booking_date: {
      type: Date,
      default: new Date(),
    },
    email: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    booking_no: {
      type: Number
    },
    address: {
      type: String,
      required: true,
    },
    balance: {
      type: String,
      required: true,
    },
    wp_booking: {
      type: Number,
      default: 0,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true,
    collection: 'Booking',
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }  
});

BookingSchema.virtual('addons', {
  ref: 'BookingAddOn',
  localField: '_id',
  foreignField: 'booking_id',
});

export default mongoose.model('Booking', BookingSchema, 'Booking');
