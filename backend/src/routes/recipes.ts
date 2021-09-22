import { Request, Response, Router } from 'express';
import { RECIPES } from '../../../test_data/db-data';
import { Recipe } from './../../../models/recipe.model';

export const recipeRouter = Router();

export type RecipesGetResponse = {
    message: string,
    recipes: Recipe[]
};

export type SingleRecipeResponse = {
    message: string,
    recipe?: Recipe
};

recipeRouter.get('',(req, res: Response<RecipesGetResponse>) => {
    res.status(200).json({ message: `Have ${RECIPES.length} recipes`, recipes: RECIPES });
});

recipeRouter.get('/random/:amount', (req: Request<{amount: string}>, res: Response<RecipesGetResponse>) => {
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
});

recipeRouter.get('/:id',(req: Request<{id: string}>, res: Response<SingleRecipeResponse>) => {

    const recipe = RECIPES.find(recipe => recipe.id === req.params.id);
    if(recipe) res.status(200).json({ message: `Found recipe ${req.params.id}`, recipe });
    else res.status(404).json({ message: `Could not find ${req.params.id}` });
});

