import  mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    user_password: {
      type: String,
      required: true,
    },
    logging_Status: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema, 'User');
