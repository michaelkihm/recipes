import { BaseRecipe, didMulterSaveImage, newRecipeStringToNewRecipe } from '@mickenhosrecipes/common';
import { PostRequest, PutRequest } from './types';
import { Request } from 'express';

export const processImageDataAndFormData = (req: PostRequest | PutRequest): BaseRecipe => {
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const recipe = newRecipeStringToNewRecipe({ ...req.body, userId: req.currentUser!.id });
    let image = recipe.image;
    if(didMulterSaveImage(req as Request)){
        const url = `${req.protocol}://${req.get('host')}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image = `${url}/images/${(req as any)?.file?.filename}`;
    }

    return { ...recipe, image: image || undefined };
};