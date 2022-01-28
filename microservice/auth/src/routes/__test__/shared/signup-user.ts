import { UserStrings } from '../../../models/user.type';
import request from 'supertest';
import { app } from '../../../app';

export const signupUser = (user: UserStrings): request.Test => {
	
	return request(app)
		.post('/api/users/signup')
		.attach('image', user.image || '')
		.set('Content-type', 'multipart/form-data')
		.field('email', user.email)
		.field('username', user.username)
		.field('password', user.password);
};