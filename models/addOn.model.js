import  mongoose from 'mongoose';

const AddOnSchema = new mongoose.Schema(
  {
    room_id: {
      type: String,
      required: true,
    },
    avail_date: {
      type: String,
      required: true,
    }
  },
  { timestamps: true },
);

export default mongoose.model('AddOn', AddOnSchema, 'AddOn');
