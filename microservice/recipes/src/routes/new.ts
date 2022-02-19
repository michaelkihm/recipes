import { requireAuth, validateRequest, multerMiddleware, natsWrapper } from '@mickenhosrecipes/common';
import express, { Response } from 'express';
import { body } from 'express-validator';
import { RecipeCreatedPublisher } from '../events/publishers/recipe-created-publisher';
import { RecipeModel } from '../models/recipe.model';
import { processImageDataAndFormData } from './shared/image-handling';
import { PostRequest } from './shared/types';


const router = express.Router();


const postHandler = async (req: PostRequest, res: Response): Promise<void> => {

    const newRecipe = processImageDataAndFormData(req);

    const recipe = RecipeModel.build(newRecipe);
    await recipe.save();
    const { id, name, description, userId, categories, ingredients, duration, image } = recipe;
    await new RecipeCreatedPublisher(natsWrapper.client).publish({
        id,
        userId,
        name,
        description,
        ingredients,
        categories,
        duration,
        image
    });

    res.status(201).send(recipe);
};

router.post(
    '/api/recipes',
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
    postHandler,
);

export { router as newRecipeRouter };