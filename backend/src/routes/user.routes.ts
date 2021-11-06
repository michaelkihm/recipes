import { Router } from 'express';
import { login, signup, updateBooksmarks } from '../controllers/user-cotroller/user.controller';
import { checkAuth } from './../middleware/check-auth';
import { multerMiddleware } from './../middleware/multer-image-save';

export const userRouter = Router();

userRouter.post('/signup',multerMiddleware,signup);

userRouter.post('/login', login);

userRouter.put('/update/bookmarks', checkAuth, updateBooksmarks);