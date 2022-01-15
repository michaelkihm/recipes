import { Recipe, requireAuth, validateRequest } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { RecipeModel } from '../models/recipe.model';


const router = express.Router();


const postHandler = async (req: Request<never,never,Recipe>, res: Response): Promise<void> => {

    const { name, description, duration, categories, ingredients } = req.body;

    const recipe = RecipeModel.build({ name, description, duration, categories, ingredients,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId: req.currentUser!.id,
    });
    await recipe.save();

    res.status(201).send(recipe);
};

router.post(
    '/api/recipes',
    requireAuth,
    [
        body('name').not().isEmpty().withMessage('Recipe requires property name'),
        body('description').not().isEmpty().withMessage('Recipe requires property description'),
        body('duration').not().isEmpty().withMessage('Recipe requires property duration'),
        body('categories').not().isEmpty().withMessage('Recipe requires property categories'),
        body('ingredients').not().isEmpty().withMessage('Recipe requires property ingredientss'),
    ],
    validateRequest,
    postHandler,
);

export { router as newRecipeRouter };