import { Router } from 'express';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';



const router = Router();

router.post(
  '/signup',
  authController.createUser
);

// router.patch(
//   '/change-password',
//   auth(
//     ENUM_USER_ROLE.ADMIN,
//     ENUM_USER_ROLE.SUPER_ADMIN,
//     ENUM_USER_ROLE.DONOR
//   ),
//   authController.changePAssword
// );

// router.post(
//   '/login',
//   authController.logInUser
// );

// router.post(
//   '/refresh-token',
//   authController.refreshToken
// );

// export const AuthRoutes = router;
