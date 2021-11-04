import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createRequest, createResponse } from 'node-mocks-http';
import { UserModel } from '../models/user';
import { User } from './../../../models/user.model';
import { USERS } from './../../../test_data/db-users';
import { SECRET_STRING } from './../constants';
import { login, signup } from './user.controller';

jest.mock('../models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

jest.spyOn(UserModel, 'create');
jest.spyOn(UserModel, 'findOne');

// const mockedHash = jest.spyOn(bcrypt, 'hash');
// const mockedCompare = jest.spyOn(bcrypt, 'compare');

// const mockedVerify = jest.spyOn(jwt, 'sign');
    //verify.mockImplementation(() => ({ email: 'test@test.com', userId: user1Id }));


describe('User Controller', () => {

    let req, res, _next;
    beforeEach(() => {
        req = createRequest();
        res = createResponse();
        _next = null;
    });

    it('should save a new user with hashed password if calling signup function', async () => {

        const hashedPW = 'hashedPW';
        (UserModel.create as jest.Mock).mockReturnValue(Promise.resolve());
        (bcrypt.hash as jest.Mock).mockReturnValue(Promise.resolve(hashedPW));

        const body: User = {
            email: 'Test@test.com',
            password: '123',
            username: 'Test User'
        };
        req.body = body;
        
        await signup(req, res);
        
        expect(UserModel.create).toBeCalledWith({ ...body, password: hashedPW });
        expect(bcrypt.hash).toBeCalledWith(body.password,10);
        await expect(UserModel.create).toBeCalledTimes(1);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should login a user if login is called with correct password', async () => {

        (UserModel.findOne as jest.Mock).mockReturnValue(Promise.resolve({ ...USERS[0], _id: USERS[0].id }));
        (bcrypt.compare as jest.Mock).mockReturnValue(Promise.resolve(true));
        (jwt.sign as jest.Mock).mockReturnValue('token');

        const user: User = {
            email: 'User@t.com',
            password: '124'
        };
        req.body = user;

        await login(req, res);

        await expect(UserModel.findOne).toBeCalledWith({ email: user.email });
        await expect(bcrypt.compare).toBeCalledWith(user.password,USERS[0].password);
        expect(jwt.sign).toBeCalledWith(
            { email: USERS[0].email, userId: USERS[0].id },
            SECRET_STRING, { expiresIn: '1h' });
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should NOT login a user if login is called with wrong password', async () => {

        (UserModel.findOne as jest.Mock).mockReturnValue(Promise.resolve(USERS[0]));
        (bcrypt.compare as jest.Mock).mockReturnValue(Promise.resolve(false));

        const user: User = {
            email: 'User@t.com',
            password: '124'
        };
        req.body = user;

        await login(req, res);

        await expect(UserModel.findOne).toBeCalledWith({ email: user.email });
        await expect(bcrypt.compare).toBeCalledWith(user.password,USERS[0].password);
        expect(res.statusCode).toBe(401);
        expect(res._isEndCalled()).toBeTruthy();
    });
});