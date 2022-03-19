import { natsWrapper, Subjects } from '@mickenhosrecipes/common';
import request from 'supertest';
import { app } from '../../app';
import { UserModel } from '../../models/user';

describe('Delete User - /api/users',() => {

    beforeEach(() => jest.clearAllMocks());

    it('has a route handler listening to DELETE /api/users', async () => {
        
        const response = await request(app).delete('/api/users').send({});
        expect(response.status).not.toEqual(404);
    });

    it('can only be accessed if the user is signed in', async () => {

        await request(app).delete('/api/users')
            .send({})
            .expect(401);
    });


    it('deletes the user if DELETE request is valid', async () => {

        const cookie = await global.signin();
        let foundUsers = await UserModel.find({ email: 'test@test.com' });

        await request(app)
                .delete('/api/users')
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
                .delete('/api/users')
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