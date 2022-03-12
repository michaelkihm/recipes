import { BaseRecipe, didMulterSaveImage, newRecipeStringToNewRecipe } from '@mickenhosrecipes/common';
import { PostRequest, PutRequest } from './types';
import { Request } from 'express';
import { recipeDefaultImageUrl } from '../../constants';

export const processImageDataAndFormData = (req: PostRequest | PutRequest): BaseRecipe => {
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const recipe = newRecipeStringToNewRecipe({ ...req.body, userId: req.currentUser!.id });
    let image = recipeDefaultImageUrl;
    if(didMulterSaveImage(req as Request)){
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image = `/api/recipes/images/${(req as any)?.file?.filename}`;
    }

    return { ...recipe, image: image || undefined };
};