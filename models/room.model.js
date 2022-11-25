import  mongoose from 'mongoose';
// const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    availability: [],
    booking_status: {
      type: String,
      required: true,
    },
    roomAvailability_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoomAvailability'
    },
    // bookingDetails: [],
    // arrival: {
    //   type: String,
    // },
    // departure: {
    //   type: String,
    // },
    status: {
      type: String,
      required: true,
      default: "inactive"
    },
    addons: [],
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
    room_type: {
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
    email: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    room_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true,
    collection: 'Room',
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    } 
  });

RoomSchema.virtual('bookingInfo', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'room_id',
});

export default mongoose.model('Room', RoomSchema, 'Room');
