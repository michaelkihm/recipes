import { BadRequestError } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { RecipeDoc, RecipeModel } from '../models/recipe.model';

const router = express.Router();

router.get('/api/recipes/:id', async (req: Request<{id: string}>, res: Response<RecipeDoc>) => {

    const recipe = await RecipeModel.findById(req.params.id).populate('userId');
    if(recipe) res.send(recipe);
    else throw new BadRequestError(`Could not find recipe with id ${req.params.id}`);

});

export { router as getRecipeRouter };