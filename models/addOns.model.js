import  mongoose from 'mongoose';

const AddOnsSchema = new mongoose.Schema(
  {
    addon_value: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    }
  },
  { timestamps: true },
);

export default mongoose.model('AddOns', AddOnsSchema, 'AddOns');
