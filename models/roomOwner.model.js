import  mongoose from 'mongoose';

const RoomOwnerSchema = new mongoose.Schema(
  {
    room_id: {
      type: String
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
    }
  },
  { timestamps: true },
);

export default mongoose.model('RoomOwner', RoomOwnerSchema, 'RoomOwner');
