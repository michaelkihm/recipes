import { BadRequestError, multerMiddleware, requireAuth, validateRequest } from '@mickenhosrecipes/common';
import express, { Response } from 'express';
import { RecipeDoc, RecipeModel } from '../models/recipe.model';
import { processImageDataAndFormData, PutRequest } from './shared';
import { body } from 'express-validator';

const router = express.Router();

const updateRecipe = async (req: PutRequest, res: Response<RecipeDoc>) => {

    const updatedRecipe = processImageDataAndFormData(req);

    const recipe = await RecipeModel.findByIdAndUpdate(req.params.id, updatedRecipe, { new: true });
    if(recipe) res.send(recipe);
    else throw new BadRequestError(`Could not find recipe with id ${req.params.id}`);

};

router.put(
    '/api/recipes/:id',
    requireAuth,
    multerMiddleware('images'),
    [
        body('name').not().isEmpty().withMessage('Recipe requires property name'),
        body('description').not().isEmpty().withMessage('Recipe requires property description'),
        body('duration').not().isEmpty().withMessage('Recipe requires property duration'),
        body('categories').not().isEmpty().withMessage('Recipe requires property categories'),
        body('ingredients').not().isEmpty().withMessage('Recipe requires property ingredients'),
    ],
    validateRequest,
    updateRecipe);

export { router as updateRecipeRouter };