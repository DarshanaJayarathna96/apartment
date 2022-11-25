import  mongoose from 'mongoose';

const BookingAddOnSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    addon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AddOns'
    },
    qty: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true },
);

export default mongoose.model('BookingAddOn', BookingAddOnSchema, 'BookingAddOn');
