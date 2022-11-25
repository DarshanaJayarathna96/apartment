import  mongoose from 'mongoose';

const RoomAvailableRefSchema = new mongoose.Schema(
  {
    room_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    }, 
    ref_status: {
      type: String,
    }
  },
  { timestamps: true },
);

export default mongoose.model('RoomAvailableRef', RoomAvailableRefSchema, 'RoomAvailableRef');
