import  mongoose from 'mongoose';

const RoomAvailabilitySchema = new mongoose.Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    room_name: {
      type: String,
    },
    room_address: {
      type: String,
    },
    avail_date: []
  },
  { timestamps: true },
);

export default mongoose.model('RoomAvailability', RoomAvailabilitySchema, 'RoomAvailability');
