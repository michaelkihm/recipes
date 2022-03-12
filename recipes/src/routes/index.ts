import { Category } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { RecipeDoc, RecipeModel } from '../models/recipe.model';

type QueryParams = {
    userId?: string;
    ids?: string[];
    categories?: Category[];
    searchString?: string;
};
type GetRecipesRequest = Request<never,never,never,QueryParams>;

const router = express.Router();

router.get('/api/recipes', async (req: GetRecipesRequest, res: Response<RecipeDoc[]>) => {

    const query: FilterQuery<RecipeDoc> = {};
    
    if(req.query.ids){
        query._id = { $in: req.query.ids };
    } else if(req.query.categories) {
        query.categories = { $all: req.query.categories };
    } else if(req.query.searchString) {
        query.$text = { $search: req.query.searchString };
    } else if (req.query.userId) {
        const userId = req.query.userId;
        if(userId === 'currentUser' && req.currentUser) {
            query.userId = req.currentUser.id;
        } else
            query.userId = req.query.userId;
    }
    
    const recipes = await RecipeModel.find(query);
    res.send(recipes);
});

export { router as indexRecipeRouter };