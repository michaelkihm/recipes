import { Request } from 'express';
import { UserStrings } from '../../models/user.type';

export type UserAddRequest = Request<never,UserStrings>;
