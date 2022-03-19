import { UserStrings } from '@mickenhosrecipes/common';
import request from 'supertest';
import { app } from '../../app';
import { signupUser } from './shared/signup-user';


describe('SignIn User - /api/users/signin', () => {

	it('fails when a email that does not exist is supplied', async () => {
		await request(app)
		  .post('/api/users/signin')
		  .send({
			email: 'test@test.com',
			password: 'password'
		  })
		  .expect(400)
	});
	
	it('fails when an incorrect password is supplied', async () => {

		const newUser: UserStrings = {
			email: 'test@test.com',
			password: 'password',
			username: 'username'
		};
		await signupUser(newUser).expect(201);
		
		await request(app)
			.post('/api/users/signin')
			.send({
			email: 'test@test.com',
			password: 'aslkdfjalskdfj'
			})
			.expect(400);
	});
	
	it('responds with a cookie when given valid credentials', async () => {

		const newUser: UserStrings = {
			email: 'test@test.com',
			password: 'password',
			username: 'username'
		};
		await signupUser(newUser).expect(201);
		
		const response = await request(app)
			.post('/api/users/signin')
			.send({
				email: newUser.email,
				password: newUser.password
			})
			.expect(200);
		
		expect(response.get('Set-Cookie')).toBeDefined();
	});
});
