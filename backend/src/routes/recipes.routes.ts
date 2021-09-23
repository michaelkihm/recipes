import { Router } from 'express';
import { getRandomRecipes, getRecipe, getRecipes } from '../controllers/recipes.controller';

export const recipeRouter = Router();


recipeRouter.get('', getRecipes);

recipeRouter.get('/random/:amount', getRandomRecipes);

recipeRouter.get('/:id',getRecipe);

