import express from 'express';

import { authRouter } from './auth.route.js';
import userRoutes from './user.route.js';
const globalRouter = express.Router();

globalRouter.use('/auth', authRouter);
globalRouter.use('/users', userRoutes);

export default globalRouter;