import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { Document, Types } from 'mongoose';
import { User } from '../../../models/user.model';
import { SECRET_STRING } from '../constants';
import { UserModel } from '../models/user';

type UserRequest = Request<never, never, User>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UserSaveResult = Document<any, any, User> & User & {_id: Types.ObjectId};
export type UserSignupResponse = {message: string, result: UserSaveResult};
export type LoginResponse = { message: string, token?: string, expiresIn?: number, userId?: string, username?: string };

export const signup = (req: UserRequest, res: Response<UserSignupResponse>): void => {
    
    hash(req.body.password, 10)
        .then(hash => {
            const user: User = {
                email: req.body.email,
                password: hash,
                username: req.body.username
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


export const login = (req: UserRequest, res: Response<LoginResponse>): void => {

    UserModel.findOne({ email: req.body.email })
        .then(async user => {

            if(!user) return res.status(401).json({ message: 'Did not find user' });
            const result = await compare(req.body.password, user.password);

            if(!result) return res.status(401).json({ message: 'Did not find user' });
            const token = sign(
                { email: user.email, userId: user._id },
                SECRET_STRING,
                { expiresIn: '1h' });
            return res.status(200).json({
                message: 'Logged in',
                token,
                expiresIn: 3600,
                userId: user._id,
                username: user.username
            });
        })
        .catch(_err => res.status(401).json({ message: 'Did not find user' }));
};