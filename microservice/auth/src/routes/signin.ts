import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password';
import { BadRequestError, validateRequest } from '@mickenhosrecipes/common';
import { UserModel } from '../models/user';

const router = express.Router();

const userSignIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        image: existingUser.image
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt
    };

    res.status(200).send(existingUser);
};

router.post(
	'/api/users/signin',
	[
		body('email')
		.isEmail()
		.withMessage('Email must be valid'),
		body('password')
		.trim()
		.notEmpty()
		.withMessage('You must supply a password')
	],
	validateRequest,
	userSignIn
);

export { router as signinRouter };
