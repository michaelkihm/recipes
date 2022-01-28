import express, { Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError, multerMiddleware } from '@mickenhosrecipes/common';
import { UserDoc, UserModel } from '../models/user';
import { UserAddRequest } from './shared/types';
import { processImageDataAndFormData } from './shared/image-handling';


const router = express.Router();

const userSignUp = async (req: UserAddRequest, res: Response<UserDoc>) => {

  //const { email, password } = req.body;
  const newUser = processImageDataAndFormData(req);

  const existingUser = await UserModel.findOne({ email: newUser.email });

  if (existingUser) throw new BadRequestError('Email in use');
  
  const user = UserModel.build(newUser);
  await user.save();

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.JWT_KEY!
  );

  // Store it on session object
  req.session = {
    jwt: userJwt
  };

  res.status(201).send(user);
};


router.post(
  '/api/users/signup',
  multerMiddleware('images'),
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('username')
      .not().isEmpty()
      .withMessage('User Model requires property username')
  ],
  validateRequest,
  userSignUp
);

export { router as signupRouter };
