import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { constants } from '../helpers/constant.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'email is required!'],
      unique: true,
    },
    password: {
      type: String,
      minLength: 8,
      select: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      enum: constants.userTypes,
      default: constants.userTypes.TALENT,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    fcmWebToken: {
      type: String,
      default: '',
    },
    fcmMobileToken: {
      type: String,
      default: '',
    },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true }
);

/* INDEXING */
userSchema.index({ email: 1 });
userSchema.index({ id: 1 });

/* HOOKS */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  } // condition that runs if password was modified
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  // GENERATE RESET TOKEN
  const resetToken = crypto.randomBytes(32).toString('hex');

  //ENCRYPT RESET TOKEN TO BE SAVED TO THE DB
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // ADD A RESET TOKEN EXPIRES
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const userModel = mongoose.model('user', userSchema);
export { userModel };
