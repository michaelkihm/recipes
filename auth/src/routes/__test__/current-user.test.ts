import request from 'supertest';
import { app } from '../../app';

describe('Get curentuser - api/users/currentuser', () => {

	it('responds with details about the current user', async () => {


		const cookie = await global.signin();
	  
		const response = await request(app)
		  .get('/api/users/currentuser')
		  .set('Cookie', cookie)
		  .send()
		  .expect(200);
	  
		expect(response.body.currentUser.email).toEqual('test@test.com');
		expect(response.body.currentUser.username).toEqual('username');
		expect(response.body.currentUser.image).toBeDefined();
		expect(response.body.currentUser.image.includes('profile-dummy')).toBeTruthy();
	  });
	  
	it('responds with null if not authenticated', async () => {

		const response = await request(app)
		  .get('/api/users/currentuser')
		  .send()
		  .expect(200);
	  
		expect(response.body.currentUser).toEqual(null);
	});
});

