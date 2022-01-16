import { BadRequestError, requireAuth, Recipe } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { RecipeDoc, RecipeModel } from '../models/recipe.model';

const router = express.Router();

const updateRecipe = async (req: Request<{id: string},Recipe>, res: Response<RecipeDoc>) => {

    const body = { ...req.body };
    delete body.userId;
    const recipe = await RecipeModel.findByIdAndUpdate(req.params.id, body, { new: true });
    if(recipe) res.send(recipe);
    else throw new BadRequestError(`Could not find recipe with id ${req.params.id}`);

};

router.put(
    '/api/recipes/:id',
    requireAuth,
    updateRecipe);

export { router as updateRecipeRouter };