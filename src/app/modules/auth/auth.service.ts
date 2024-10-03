/* eslint-disable @typescript-eslint/ban-ts-comment */
import httpStatus from 'http-status';
import {
  IChangePassword,
  ILogInUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
} from './auth.interface';

import ApiError from '../../../errors/ApiError';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './auth.model';
import { generateDonorId } from '../../../shared/generateDonorId';



const insertIntoDB = async (user: IUser): Promise<IUser | null> => {

  const existingUser = await User.findOne({ email:user?.email});
  if (existingUser) {
    throw new ApiError(httpStatus.FOUND,'User already exists');
  }

  if (user.role === 'donor') {
    const donorId = await generateDonorId();
    user.donor_id = donorId; 
  }

  const result = await User.create(user);
  return result;
};



const logInUser = async (userData: ILogInUser): Promise<ILoginUserResponse> => {
  //@ts-ignore
  const isUserExist = await User.isUserExist(userData.email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user does not exist');
  }

  if (
    isUserExist.password &&
    //@ts-ignore
    !(await User.isPasswordMatched(userData.password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { _id, role, email } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { _id, role, email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { _id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  const { _id } = verifiedToken;

  const isUserExist = await User.findOne({ _id });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist._id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

//change password

const changePassword = async (userInfo: IChangePassword) => {
  const { oldPassword, newPassword, email } = userInfo;

  //@ts-ignore
  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  //@ts-ignore
  const isMatchPassword = await User.isPasswordMatched(
    oldPassword,
    isUserExist.password
  );
  console.log(isMatchPassword, 'isMatchPassword');

  if (!isMatchPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is not matched');
  }

  // Hash the new password before updating
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds)
  );

  // Update the user with the hashed password
  const result = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );
  console.log(result, 'result');
  return result;
};

export const authService = {
  insertIntoDB,
  logInUser,
  refreshToken,
  changePassword,
};
