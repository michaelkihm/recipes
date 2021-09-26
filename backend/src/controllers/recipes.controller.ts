import { Request, Response } from 'express';
import { Recipe } from '../../../models/recipe.model';
import { RECIPES } from '../../../test_data/db-data';
import { RecipeModel } from '../models/recipe';

export type RecipesGetResponse = {
    message: string,
    recipes: Recipe[]
};

export type SingleRecipeResponse = {
    message: string,
    recipe?: Recipe
};

export const getRecipes = (_req: Request, res: Response<RecipesGetResponse>): void => {
    
    RecipeModel.find({}, (err, docs) => {
        if(!err) res.status(200).json({ message: `Have ${docs.length} recipes`, recipes: docs });
        else res.status(404).json({ message: `Error getting all docs: ${err}`, recipes: [] });
    });
};

export const getRandomRecipes = (req: Request<{amount: string}>, res: Response<RecipesGetResponse>): void => {

    if(+req.params.amount < RECIPES.length){
        res.status(200).json({
            message: `Return ${req.params.amount} recipes`,
            recipes: RECIPES.sort(() => Math.random() - Math.random()).slice(0, +req.params.amount)
        });
    } else {
        res.status(404).json({
            message: `Number ${req.params.amount} is longer than the list of recipes`,
            recipes: []
        });
    }
};


export const getRecipe = (req: Request<{id: string}>, res: Response<SingleRecipeResponse>): void => {

    const recipe = RECIPES.find(recipe => recipe.id === req.params.id);
    if(recipe) res.status(200).json({ message: `Found recipe ${req.params.id}`, recipe });
    else res.status(404).json({ message: `Could not find ${req.params.id}` });
};