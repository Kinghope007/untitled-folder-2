import { StatusCodes } from 'http-status-codes';

import { profileRepository } from '../repositories/profile.repository.js';
import AppError from '../helpers/errors/AppError.js';
import { userRepository } from '../repositories/users.repository.js';
import { profileUpload } from './cloudinaryUpload.js';
import { pushNotification } from '../helpers/notification.js';
import { deleteFiles } from '../helpers/utils/deleteFiles.js';
import { profileModel } from '../models/user.profile.model.js';

const buildQuery = async (user, queryObject) => {
  let query = { user: { $ne: user._id } };
  const sortBy = queryObject.sort
    ? queryObject.sort.split(',').join(' ')
    : { createdAt: -1 };
  const page = +queryObject.page || 1;
  const limit = +queryObject.limit || 10;
  const skip = (page - 1) * limit;

  if (queryObject.q) {
    query.$or = [
      { firstName: { $regex: queryObject.q, $options: 'i' } },
      { lastName: { $regex: queryObject.q, $options: 'i' } },
      { displayName: { $regex: queryObject.q, $options: 'i' } },
    ];
  }

  return { query, sortBy, limit, skip };
};

const createUserProfile = async (user, profileObject) => {
  const { displayName } = profileObject;
  const displayNameExists = await profileModel.findOne({
    displayName: visitorDisplayname,
    user: { $ne: user },
  });
  await user.save({ runValidators: false });
  const profile = await profileModel
      .findOneAndUpdate({ user: userId }, profileObject, { new: true })
      .populate('tools skill user');
    return profile;
};

const updateProfile = async (userId, profileObject) => {
  return await profileModel
    .findOneAndUpdate({ user: userId }, profileObject, { new: true })
    .populate('user');
};

const getAllUserProfiles = async (user, queryObject) => {
    const { query, sortBy, limit, skip } = await userService.buildQuery(
        user,
        objectQuery
      );
      console.log(query, 'sortBy => ', sortBy);
      return await profileModel.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $match: {
            'user.isOnboarded': true,
          },
        },
        {
          $lookup: {
            from: 'skills',
            localField: 'skill',
            foreignField: '_id',
            as: 'skill',
          },
        },
        {
          $unwind: '$skill',
        },
        {
          $lookup: {
            from: 'Stacks',
            localField: 'tools',
            foreignField: '_id',
            as: 'tools',
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $sort: sortBy,
        },
      ]);
};

const deleteAUser = async (userId) => {
  const userExists = await userRepository.deleteAUser(userId);
  if (!userExists) {
    throw new AppError('User not found!', StatusCodes.NOT_FOUND);
  }
  await profileRepository.deleteAProfile(userId);
  return;
};

const uploadProfilePicture = async (file, userId) => {
  const ImageUrl = (await profileUpload(file, 'profile')).secure_url;
  user.image = ImageUrl;
  await user.save({ runValidators: false });
  await deleteFiles(file)
  return user;
};

const myProfile = async (userId) => {
  return await profileModel.findOne({ user: userId }).populate('user');
};

export const userService = {
  createUserProfile,
  getAllUserProfiles,
  updateProfile,
  buildQuery,
  deleteAUser,
  uploadProfilePicture,
  myProfile,
};
