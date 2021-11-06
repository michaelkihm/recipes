import { Document, Types } from 'mongoose';
import { User } from '../../../../models/user.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UserSaveResult = Document<any, any, User> & User & {_id: Types.ObjectId};

export type UserSignupResponse = {message: string, result: UserSaveResult};

export type LoginResponse = {
    message: string,
    token?: string,
    expiresIn?: number,
    userId?: string,
    username?: string,
    bookmarks?: string[]
};

export type UserUpdateResponse = {
    message: string,
    userId?: string,
    username?: string,
    bookmarks?: string[],
};