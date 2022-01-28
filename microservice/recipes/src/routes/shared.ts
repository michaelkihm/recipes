import { BaseRecipeStrings, newRecipeStringToNewRecipe } from './types';
import { BaseRecipe } from '@mickenhosrecipes/common';
import { Request } from 'express';

export type PostRequest = Request< never, BaseRecipeStrings>;
export type PutRequest = Request<{id: string}, never, BaseRecipeStrings>;

export const processImageDataAndFormData = (req: PostRequest | PutRequest): BaseRecipe => {

    const didMulterSaveImage = (req: PostRequest | PutRequest) => req?.file?.filename ? true : false;
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const recipe = newRecipeStringToNewRecipe({ ...req.body, userId: req.currentUser!.id });
    let image = recipe.image;
    if(didMulterSaveImage(req)){
        const url = `${req.protocol}://${req.get('host')}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image = `${url}/images/${(req as any)?.file?.filename}`;
    }
    return { ...recipe, image };
};