import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { CONFIG } from '../config/env.js';
import CatchAsync from '../helpers/errors/CatchAsync.js';
import { authService } from '../services/auth.service.js';

const signToken = (user) => {
  const { _id } = user;
  return jwt.sign({ sub: _id }, CONFIG.SECRET_KEY, {
    expiresIn: CONFIG.EXPIRES,
  });
};

const signUp = CatchAsync(async (req, res) => {
  const user = await authService.registration(req.body);
  const token = signToken(user);
  res.status(StatusCodes.CREATED).json({
    status: true,
    msg: 'signup successful!',
    token,
  });
});

const signIn = CatchAsync(async (req, res) => {
  const { email, password, fcmWebToken, fcmMobileToken } = req.body;
  const user = await authService.login(email, password);
  const token = signToken(user);
  user.fcmWebToken = !!fcmWebToken ? fcmWebToken : user.fcmWebToken;
  user.fcmMobileToken = !!fcmMobileToken ? fcmMobileToken : user.fcmMobileToken;
  await user.save({ runValidators: false });
  user.password = undefined;
  res.status(StatusCodes.OK).json({
    status: true,
    msg: 'Login successful!',
    token,
    user,
  });
});

const GoogleSignIn = CatchAsync(async (req, res) => {
  const data = await authService.googleOauthSignIn(req.body);
  const token = signToken(data);
  res.status(StatusCodes.OK).json({
    status: true,
    data,
    token,
  });
});

const forgotPassword = CatchAsync(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.status(StatusCodes.OK).json({
    status: 'true',
    msg: 'Reset token sent to email!',
  });
});

const resetPassword = CatchAsync(async (req, res) => {
  await authService.resetPassword(req.body);
  res.status(StatusCodes.OK).json({
    status: true,
    msg: 'Password reset succussfully, You can log in!',
  });
});

const supervisorSignup = CatchAsync(async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  await authService.supervisorRegistration(req.body, baseUrl);
  res.status(StatusCodes.OK).json({
    status: true,
    msg: 'Supervisor created Successfully!',
  });
});

export const authController = {
  signUp,
  signIn,
  GoogleSignIn,
  forgotPassword,
  resetPassword,
  supervisorSignup,
};
