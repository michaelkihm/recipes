import { requireAuth, validateRequest } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { multerMiddleware } from '../middlewares/multer-image-save';
import { RecipeModel } from '../models/recipe.model';
import { processImageDataAndFormData } from './shared';
import { BaseRecipeStrings } from './types';

export type PostRequest = Request<{id: string}, never, BaseRecipeStrings>;

const router = express.Router();


const postHandler = async (req: PostRequest, res: Response): Promise<void> => {

    const newRecipe = processImageDataAndFormData(req);

    const recipe = RecipeModel.build(newRecipe);
    await recipe.save();

    res.status(201).send(recipe);
};

router.post(
    '/api/recipes',
    requireAuth,
    multerMiddleware,
    [
        body('name').not().isEmpty().withMessage('Recipe requires property name'),
        body('description').not().isEmpty().withMessage('Recipe requires property description'),
        body('duration').not().isEmpty().withMessage('Recipe requires property duration'),
        body('categories').not().isEmpty().withMessage('Recipe requires property categories'),
        body('ingredients').not().isEmpty().withMessage('Recipe requires property ingredients'),
    ],
    validateRequest,
    postHandler,
);

export { router as newRecipeRouter };