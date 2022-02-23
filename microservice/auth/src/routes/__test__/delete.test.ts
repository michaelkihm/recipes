import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { UserModel } from '../../models/user';
import { natsWrapper, Subjects } from '@mickenhosrecipes/common';

describe('Delete User - /api/users/:id',() => {

    beforeEach(() => jest.clearAllMocks());

    it('has a route handler listening to DELETE /api/users/:id', async () => {
        
        const response = await request(app).delete('/api/users/1234').send({});
        expect(response.status).not.toEqual(404);
    });

    it('can only be accessed if the user is signed in', async () => {

        await request(app).delete('/api/users/1234')
            .send({})
            .expect(401);
    });

    it('returns an error if no valid user id is provided', async () => {


        const cookie = await global.signin();
        const response = await request(app)
                                .delete('/api/users/1234')
                                .set('Cookie', cookie)
                                .send({});

        expect(response.status).not.toEqual(401);
        expect(response.status).toEqual(400);
    });

    it('returns an error if param id does not correspond to currentUser', async () => {

        const id = new mongoose.Types.ObjectId();

        const cookie = await global.signin();
        const response = await request(app)
                                .delete(`/api/users/${id}`)
                                .set('Cookie', cookie)
                                .send({});

        expect(response.status).toEqual(400);
    });

    it('deletes the user if DELETE request is valid', async () => {

        const cookie = await global.signin();
        let foundUsers = await UserModel.find({ email: 'test@test.com' });

        await request(app)
                .delete(`/api/users/${foundUsers[0].id}`)
                .set('Cookie', cookie)
                .send({})
                .expect(200);
        
        foundUsers = await UserModel.find({ email: 'test@test.com' });
        expect(foundUsers.length).toBe(0);
    });

    it('publishes an event if user gets deleted',async () => {
        
        const cookie = await global.signin();
        jest.clearAllMocks();
        const foundUsers = await UserModel.find({ email: 'test@test.com' });

        await request(app)
                .delete(`/api/users/${foundUsers[0].id}`)
                .set('Cookie', cookie)
                .send({})
                .expect(200);
        
        expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
        expect((natsWrapper.client.publish as jest.Mock).mock.calls[0][0]).toBe(Subjects.UserDeleted);
        const publisherParameter = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
        expect(publisherParameter.version).toBe(0);
        expect(publisherParameter.userId).toBe(foundUsers[0].id);
    });
});