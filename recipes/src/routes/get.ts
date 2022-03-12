import { BadRequestError, isRecipeUserDetails } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { RecipeModel } from '../models/recipe.model';

const router = express.Router();

router.get('/api/recipes/:id', async (req: Request<{id: string}>, res: Response) => {

    const recipe = await RecipeModel.findById(req.params.id).populate('userId');
    if(recipe && isRecipeUserDetails(recipe.userId)) res.send(recipe);
    else if(!recipe) throw new BadRequestError(`Could not find recipe with id ${req.params.id}`);
    else throw new BadRequestError('Could not populate data with user data');

});

export { router as getRecipeRouter };