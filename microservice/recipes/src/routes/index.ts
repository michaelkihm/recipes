import express, { Request, Response } from 'express';
import { RecipeDoc, RecipeModel } from '../models/recipe.model';

const router = express.Router();

router.get('/api/recipes', async (req: Request, res: Response<RecipeDoc[]>) => {

    const recipes = await RecipeModel.find({});
    res.send(recipes);
});

export { router as indexRecipeRouter };