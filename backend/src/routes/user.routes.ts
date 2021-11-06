import { Router } from 'express';
import { login, signup, updateBooksmarks } from '../controllers/user-cotroller/user.controller';
import { checkAuth } from './../middleware/check-auth';

export const userRouter = Router();

userRouter.post('/signup',signup);

userRouter.post('/login', login);

userRouter.put('/update/bookmarks', checkAuth, updateBooksmarks);