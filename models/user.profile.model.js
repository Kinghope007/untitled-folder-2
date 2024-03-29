import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    displayName: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    contact: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

profileSchema.pre('save', async function (next) {
  try {
    await this.populate('user');
    next();
  } catch (error) {
    next(error);
  }
});
const profileModel = mongoose.model('profile', profileSchema);
export { profileModel };
