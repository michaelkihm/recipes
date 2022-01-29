import { UserStrings } from '@mickenhosrecipes/common';
import { signupUser } from './shared/signup-user';


describe('Signup User - /api/users/signup', () => {

	const validUser: UserStrings = {
		email: 'test@test.com',
		password: 'password',
		username: 'username',
	};

	it('returns a 201 on successful signup', async () => {
	
		await signupUser(validUser).expect(201);
	});
	
	it('returns a 400 with an invalid email', async () => {

		const newUser: UserStrings = {
			email: 'alskdflaskjfd',
			password: 'password',
			username: 'username',
		};
		await signupUser(newUser).expect(400);
	});
	  
	it('returns a 400 with an invalid password', async () => {
		
		const newUser: UserStrings = {
			email: 'test@test.com',
			password: 'p',
			username: 'username',
		};
		await signupUser(newUser).expect(400);
	});
	  
	it('returns a 400 with missing email and password', async () => {

		const newUser: UserStrings = {
			email: 'test@test.com',
			password: 'password',
			username: 'username',
		};

		await signupUser({ ...newUser, password: '' }).expect(400);
		await signupUser({ ...newUser, email: '' }).expect(400);
	});
	  
	it('disallows duplicate emails', async () => {

		const newUser1 = { ...validUser };
		const newUser2 = { ...newUser1, username: 'testuser', password: 'secretpassword' };

		await signupUser(newUser1).expect(201);
		await signupUser(newUser2).expect(400);
	});
	  
	it('sets a cookie after successful signup', async () => {

		const response = await signupUser(validUser).expect(201);
	
		expect(response.get('Set-Cookie')).toBeDefined();
	});

	it('Saves an image if provided', async () => {

		const newUser = { ...validUser, image: 'images/identicon.png' };

		const response = await signupUser(newUser).expect(201);

		expect(response.body.image).toBeDefined();
		expect(response.body.image.includes(newUser.image)).toBeTruthy();
		expect(response.body.image.includes(newUser.image)).toBeTruthy();
	});
 
	it('Set profile-dummy image a profile image if new image is provided', async () => {

		const baseURL = '/api/users/images';
		const response = await signupUser(validUser).expect(201);

		expect(response.body.image).toBeDefined();
		expect(response.body.image.substring(0,baseURL.length)).toEqual(baseURL);
		expect(response.body.image).toEqual('/api/users/images/profile-dummy.jpg');
	});
});