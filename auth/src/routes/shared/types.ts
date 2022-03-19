import { UserStrings } from '@mickenhosrecipes/common';
import { Request } from 'express';

export type UserAddRequest = Request<never,UserStrings>;
