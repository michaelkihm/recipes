import { BadRequestError, multerMiddleware, natsWrapper, validateRequest } from '@mickenhosrecipes/common';
import express, { Response } from 'express';
import { body } from 'express-validator';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { UserDoc, UserModel } from '../models/user';
import { generateJWT } from './shared/generate-jwt';
import { processImageDataAndFormData } from './shared/image-handling';
import { UserAddRequest } from './shared/types';


const router = express.Router();

const userSignUp = async (req: UserAddRequest, res: Response<UserDoc>) => {

  
 	const newUser = processImageDataAndFormData(req);

	const existingUser = await UserModel.findOne({ email: newUser.email });

	if (existingUser) throw new BadRequestError('Email in use');
	
	const user = UserModel.build(newUser);
	await user.save();
	await new UserCreatedPublisher(natsWrapper.client).publish({
		version: user.version,
		user: { username: user.username, image: user.image || '', email: user.email },
		userId: user.id,
	});

	generateJWT(user, req);

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
