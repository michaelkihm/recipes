import { compare, hash } from 'bcrypt';
import { Request, Response, Router } from 'express';
import { sign } from 'jsonwebtoken';
import { SECRET_STRING } from '../constants';
import { UserModel } from './../models/user';

export const userRouter = Router();

type UserRequest = Request<never, never, {email: string, password: string}>;

userRouter.post(
    '/signup',
    (req: UserRequest, res: Response<{message: string, result: any}>) => {

    hash(req.body.password, 10)
        .then(hash => {
            const user = new UserModel({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
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
    
});

userRouter.post('/login', (req: UserRequest, res: Response<{message: string, token?: string}>) => {

    UserModel.findOne({ email: req.body.email })
        .then(async user => {

            if(!user) return res.status(401).json({ message: 'Did not find user' });
            const result = await compare(req.body.password, user.password);

            if(!result) return res.status(401).json({ message: 'Did not find user' });
            const token = sign(
                { email: user.email, userId: user._id },
                SECRET_STRING,
                { expiresIn: '1h' });

            res.status(200).json({
                message: 'Logged in',
                token
            });
        })
        .catch(_err => res.status(401).json({ message: 'Did not find user' }));
        
});