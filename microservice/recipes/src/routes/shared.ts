import { newRecipeStringToNewRecipe } from './types';
import { NewRecipe } from '@mickenhosrecipes/common';
import { PostRequest } from './new';


export const processImageDataAndFormData = (req: PostRequest): NewRecipe => {

    const didMulterSaveImage = (req: PostRequest) => req?.file?.filename ? true : false;
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const recipe = newRecipeStringToNewRecipe({ ...req.body, userId: req.currentUser!.id });
    let image = recipe.image;
    if(didMulterSaveImage(req)){
        const url = `${req.protocol}://${req.get('host')}`;
        image = `${url}/images/${req?.file?.filename}`;
    }
    return { ...recipe, image };
};