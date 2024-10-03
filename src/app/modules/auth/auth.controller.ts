import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IRefreshTokenResponse } from './auth.interface';
import { authService } from './auth.service';
import config from '../../../config';


// const createUser: RequestHandler = catchAsync(async (req, res) => {
//   let user = req.body.data;
//   user = JSON.parse(req.body.data);

//   if (req.file) {
//     const imageUrl = `/uploads/profile/${req.file.filename}`;
//     user.profileImageUrl = imageUrl;
//   }
//   const result = await authService.insertIntoDB(user);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User created successfully!',
//     data: result,
//   });
// });

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const user = req.body;

  console.log(user, 'controller clicked-----------------------------------------------------------------');
  const result = await authService.insertIntoDB(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: result,
  });
});


const logInUser: RequestHandler = catchAsync(async (req, res) => {
  const user = req.body;

  const result = await authService.logInUser(user);
  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'user logged successfully',
    data: {
      accessToken: others.accessToken,
    },
  });
});

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await authService.refreshToken(refreshToken);
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);
  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Refresh token generate successfully !',
    data: result,
  });
});

const changePAssword: RequestHandler = catchAsync(async (req, res) => {
  const userPassword = req.body;
  const result = await authService.changePassword(userPassword);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password change successfully',
    data: result,
  });
});

export const authController = {
  createUser,
  logInUser,
  refreshToken,
  changePAssword,
};
