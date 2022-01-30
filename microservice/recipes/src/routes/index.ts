import { Category } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { RecipeDoc, RecipeModel } from '../models/recipe.model';

type GetRecipesRequest = Request<never,never,never,{userId?: string; ids?: string[], categories?: Category[]}>;

const router = express.Router();

router.get('/api/recipes', async (req: GetRecipesRequest, res: Response<RecipeDoc[]>) => {

    let recipes: RecipeDoc[] = [];

    if(req.query.ids){
        recipes = await RecipeModel.find({ _id: { $in: req.query.ids } });
    } else if(req.query.categories) {
        recipes = await RecipeModel.find({ categories: { $all: req.query.categories } });
    } else {
        recipes = await RecipeModel.find(req.query);
    }
    
    res.send(recipes);
});

export { router as indexRecipeRouter };