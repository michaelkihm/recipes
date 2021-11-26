import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { User, userFormDataToUser, UserStrings } from '../../../../models/user.model';
import { UserModel } from '../../models/user';
import {
    LoginResponse, UserSaveResult, UserSignupResponse, UserUpdateResponse
} from './user.controller.types';

type UserLoginRequest = Request<never, never, User>;
type UserAddRequest = Request<never, never, UserStrings>;

type BookmarkUpdateRequest = Request<never, never, { bookmarks: string[] }>;


export const signup = (req: UserAddRequest, res: Response<UserSignupResponse>): void => {
    
    const userData = processImageDataAndFormData(req);

    hash(userData.password, 10)
        .then(hash => {
            const user: User = {
                email: userData.email,
                password: hash,
                username: userData.username,
                image: userData.image
            };
            UserModel.create(user)
                .then((result: UserSaveResult) => {
                    res.status(201).json({
                        message: 'User created',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Error during signup',
                        result: err
                    });
                });
        
        });
};


const processImageDataAndFormData = (req: UserAddRequest): User => {

    const didMulterSaveImage = (req: Request | UserAddRequest) => req?.file?.filename ? true : false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = userFormDataToUser(req.body);
    let image: string;
    if(didMulterSaveImage(req)){
        const url = `${req.protocol}://${req.get('host')}`;
        image = `${url}/images/${req?.file?.filename}`;
    }
    
    return { ...user, image };
};


export const login = (req: UserLoginRequest, res: Response<LoginResponse>): void => {

    UserModel.findOne({ email: req.body.email })
        .then(async user => {

            if(!user) return res.status(401).json({ message: 'Did not find user' });
            const result = await compare(req.body.password, user.password);

            if(!result) return res.status(401).json({ message: 'Wrong password' });
            const token = sign(
                { email: user.email, userId: user._id },
                process.env.SECRET_STRING,
                { expiresIn: '1h' });
            return res.status(200).json({
                message: 'Logged in',
                token,
                expiresIn: 3600,
                userId: user._id,
                username: user.username,
                bookmarks: user.bookmarks,
                image: user.image
            });
        })
        .catch(_err => res.status(401).json({ message: 'Did not find user' }));
};


export const updateBooksmarks = (req: BookmarkUpdateRequest, res: Response<UserUpdateResponse>): void => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userData.userId;
    UserModel.findByIdAndUpdate(userId, { bookmarks: req.body.bookmarks },{ new: true })
        .then(user => {
            if(!user) return res.status(401).json({ message: `Did not find user ${userId}` });
            
            return res.status(200).json({
                message: 'Updated bookmarks',
                userId: user._id,
                username: user.username,
                bookmarks: user.bookmarks,
            });
        })
        .catch(err => res.status(404).json({ message: `Could not find user with id: ${userId}. Error: ${err}` }));
};