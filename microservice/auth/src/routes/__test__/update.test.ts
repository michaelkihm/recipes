import { app } from '../../app';
import request from 'supertest';
import { UserModel } from '../../models/user';
import { natsWrapper, Subjects } from '@mickenhosrecipes/common';
import mongoose from 'mongoose';

describe('Update User', () => {

    beforeEach(() => jest.clearAllMocks());

    it('has a route handler listening to PUT /api/users', async () => {
        
        const response = await request(app).put('/api/users').send({});
        expect(response.status).not.toEqual(404);
    });

    it('can be only be accessed if the user is signed in', async () => {

        await request(app).put('/api/users')
            .send({})
            .expect(401);
    });

    it('returns an error if username is not provided in request body', async () => {

        const cookie = await global.signin();
        await request(app)
            .put('/api/users')
            .set('Cookie', cookie)
            .send({
                image: 'src/1'
            })
            .expect(400);
    });

    it('updates username and image if request is valid', async () => {
        
        const updatedUser: { username: string; image: string } = {
            username: 'new username',
            image: 'images/identicon.png',
        };

        const cookie = await global.signin();
        const response = await request(app)
                            .put('/api/users')
                            .attach('image', updatedUser.image)
                            .field('username', updatedUser.username)
                            .set('Cookie', cookie)
                            .expect(200);

        expect(response.body.username).toBe(updatedUser.username);
        expect(response.body.username).not.toBe('/api/users/images/profile-dummy.jpg');
        expect(response.body.image.includes(updatedUser.image)).toBeTruthy();

        // assert db update
        const foundUser = await UserModel.find({ username: updatedUser.username });
        expect(foundUser.length).toBe(1);
        expect(foundUser[0].username).toBe(updatedUser.username);
        expect(foundUser[0].image?.includes(updatedUser.image)).toBeTruthy();
    });

    it('publishes and user:update event', async () => {

        const updatedUser: { username: string; image: string } = {
            username: 'new username',
            image: 'images/identicon.png',
        };

        const cookie = await global.signin();
        jest.clearAllMocks(); // clear user:created event from signin
        await request(app)
                .put('/api/users')
                .attach('image', updatedUser.image)
                .field('username', updatedUser.username)
                .set('Cookie', cookie)
                .expect(200);

        expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
        expect((natsWrapper.client.publish as jest.Mock).mock.calls[0][0]).toBe(Subjects.UserUpdated);
        const publisherParameter = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
        expect(publisherParameter.version).toBe(0);
        expect(publisherParameter.user.username).toBe(updatedUser.username);
        expect(publisherParameter.user.email).toBe('test@test.com');
        expect(mongoose.Types.ObjectId.isValid(publisherParameter.userId)).toBeTruthy();
    });

});