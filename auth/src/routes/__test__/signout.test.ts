import request from 'supertest';
import { app } from '../../app';
import { signupUser } from './shared/signup-user';

describe('SignOut - api/users/signup', () => {

	it('clears the cookie after signing out', async () => {

		await signupUser({
			email: 'test@test.com',
			password: 'password',
			username: 'username' });
	  
		const response = await request(app)
		  .post('/api/users/signout')
		  .send({})
		  .expect(200);
	  
		expect(response.get('Set-Cookie')[0]).toEqual(
		  'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
		);
	});
});

