import { BaseRecipeStrings } from '@mickenhosrecipes/common';
import { Request } from 'express';

export type PostRequest = Request< never, BaseRecipeStrings>;
export type PutRequest = Request<{id: string}, never, BaseRecipeStrings>;

