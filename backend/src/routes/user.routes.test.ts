/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { connection } from 'mongoose';
import path from 'path';
import { agent, SuperAgentTest } from 'supertest';
import { UserStrings } from '../../../models/user.model';
import { RECIPES } from '../../../test_data/db-recipes';
import { USERS } from '../../../test_data/db-users';
import { migrateRecipeData, migrateUserData } from '../../migration/migration-helpers';
import { app, server } from '../app';
import { RecipeModel } from './../models/recipe';
import { UserModel } from './../models/user';

jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('User Routes', () => {

    let appAgent: SuperAgentTest;

    beforeAll( (done) => {

        appAgent = agent(app);
        migrateUserData()
            .then(() => migrateRecipeData())
            .then(() => done());
    });

    afterAll((done) => {
 
        connection.collections.users.drop()
            .then(() => connection.collections.recipes.drop())
            .then(() => connection.close())
            .then(() => {
                server.close();
                removeDummyFiles();
                done();
            });
    });

    it('should have migrated test data successfully', async () => {

        const docs = await RecipeModel.countDocuments();
        const users = await UserModel.countDocuments();

        expect(docs).toBe(RECIPES.length);
        expect(users).toBe(USERS.length);
    });

    
    it('should create a new User when POST to /api/user/signup', async () => {

        const hashedPW = 'hashedPW';
        (bcrypt.hash as jest.Mock).mockReturnValue(Promise.resolve(hashedPW));
        const user: UserStrings = {
            username: 'TestUser',
            email: 'hello@web.de',
            password: '123',
        };
        const response = await appAgent.post('/api/user/signup')
                                    .field('username', user.username)
                                    .field('email', user.email)
                                    .field('password', user.password)
                                    .attach('image','backend/images/recipe-dummy.png');


        expect(response.statusCode).toBe(201);
        expect(response.body.message).toEqual('User created');

        const foundUser = await UserModel.findOne({ email: user.email });
        expect(foundUser.email).toEqual(user.email);
        expect(foundUser.username).toEqual(user.username);
        expect(foundUser.password).toEqual(hashedPW);
    });

    // eslint-disable-next-line max-len
    it('should login a User and return userdata and token when POST to /api/user/login with correct password', async () => {
        
        (bcrypt.compare as jest.Mock).mockReturnValue(Promise.resolve(true));
        (jwt.sign as jest.Mock).mockReturnValue('token');
        const user = USERS[0];
        
        const response = await appAgent.post('/api/user/login').send({ email: user.email, password: user.password });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Logged in');
        expect(response.body.expiresIn).toBe(3600);
        expect(response.body.username).toBe(user.username);
        expect(response.body.userId).toBe(user.id!);
        expect(response.body.bookmarks).toEqual(user.bookmarks!);
        expect(response.body.token).toEqual('token');
    });

    it('should return 401 when POST to api/user/login with INCORRECT password', async () => {

        (bcrypt.compare as jest.Mock).mockReturnValue(Promise.resolve(false));
        const user = USERS[0];
        
        const response = await appAgent.post('/api/user/login').send({ email: user.email, password: user.password });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Wrong password');
    });

    it('should update the bookmarks when PUT /api/user/update/bookmarks', async () => {

        const user = USERS[0];
        const updatedBookmarks = [...user.bookmarks as string[], '1234'];
        (jwt.verify as jest.Mock).mockReturnValue({ email: user.email, userId: user.id });

        const response = await appAgent.put('/api/user/update/bookmarks')
            .send({ bookmarks: updatedBookmarks })
            .set('authorization','Bearer token');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Updated bookmarks');
        expect(response.body.userId).toBe(user.id);
        expect(response.body.username).toBe(user.username);
        expect(response.body.bookmarks).toEqual(updatedBookmarks);

    });
});


const removeDummyFiles = () => {
    
    const imagePath = './backend/images';
    fs.readdir(imagePath, (err, files) => {
    
        files.forEach(file => {
            const fileDir = path.join(imagePath, file);
            if (file !== 'test_burger.jpeg' && file !== 'test_falafel.jpeg' && file !== 'test_spaghetti.jpeg'
                && file !== 'profile-dummy.jpg' && file !== 'recipe-dummy.png' && file !== 'User1.png') {
                fs.unlinkSync(fileDir);
            }
        });
    });
};