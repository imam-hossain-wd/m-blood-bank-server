/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from 'express';
// import { AuthRoutes } from '../modules/auth/auth.route';


const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: '',
    // route: AuthRoutes,
  },
];
//@ts-ignore
moduleRoutes.forEach(route => router.use(route.path, route.route));

export const routes = router;