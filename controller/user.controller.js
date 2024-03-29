import { StatusCodes } from 'http-status-codes';

import CatchAsync from '../helpers/errors/CatchAsync.js';
import { userService } from '../services/user.service.js';
import catchAsync from '../helpers/errors/CatchAsync.js';

const newProfile = CatchAsync(async (req, res) => {
  const profile = await userService.createUserProfile(req.user, req.body);
  res.status(StatusCodes.CREATED).json({
    status: true,
    msg: 'profile created successfully',
    profile,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const profileObject = req.body;

  const data = await userService.updateProfile(userId, profileObject);
  res.status(StatusCodes.OK).json({
    status: true,
    msg: 'profile updated succesfully!',
    data,
  });
});

const profiles = catchAsync(async (req, res) => {
  const data = await userService.getAllUserProfiles(req.user, req.query);
  res.status(StatusCodes.OK).json({
    status: true,
    msg: 'profiles fetched successfully!',
    nbhits: data.length,
    data,
  });
});

const similarInterests = catchAsync(async (req, res) => {
  const data = await userService.getUserswithSimilarInterest(req.user);
  res.status(StatusCodes.OK).json({
    status: true,
    msg: 'users fetched successfully!',
    nbhits: data.length,
    data,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteAUser(req.params.id);
  res.status(StatusCodes.NO_CONTENT).json({
    status: true,
    msg: 'user deleted successfully!',
  });
});

const uploadProfilePicture = catchAsync(async (req, res) => {
  const data = await userService.uploadProfilePicture(req.file, req.user._id);
  res.status(StatusCodes.OK).json({
    status: true,
    msg: 'profile uploaded successfully',
    data,
  });
});

const followAUser = catchAsync(async (req, res) => {
  await userService.followUser(req.params.id, req.user);
  res.status(StatusCodes.OK).json({
    status: true,
    msg: 'user followed successfully!',
  });
});

const myProfile = catchAsync(async (req, res) => {
  const data = await userService.myProfile(req.user._id);
  res.status(StatusCodes.OK).json({
    status: true,
    msg: 'profile fetched successfully!',
    data,
  });
});

const myFollowers = catchAsync(async (req, res) => {
  const data = await userService.myFollowers(req.user._id, req.query);
  res.status(StatusCodes.OK).json({
    status: true,
    msg: 'followers fetched successfully!',
    data,
  });
});

const getAProfile = catchAsync(async(req, res) => {
  const data = await userService.getUserProfile(req.params.id, req.user._id);
  res.status(StatusCodes.OK).json({
    status: true,
    msg: 'profile fetched succesfully!',
    data
  })
})

export const userController = {
  newProfile,
  updateProfile,
  profiles,
  similarInterests,
  deleteUser,
  uploadProfilePicture,
  followAUser,
  myProfile,
  myFollowers,
  getAProfile
};
