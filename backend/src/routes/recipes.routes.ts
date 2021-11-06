import { Router } from 'express';
import {
    deleteRecipe,
    getRandomRecipes, getRecipe, getRecipes, postRecipe
} from '../controllers/recipes.controller';
import { multerMiddleware } from '../middleware/multer-image-save';
import { putRecipe } from './../controllers/recipes.controller';
import { checkAuth } from './../middleware/check-auth';

export const recipeRouter = Router();


recipeRouter.get('', getRecipes);

recipeRouter.post('', checkAuth, multerMiddleware, postRecipe);

recipeRouter.get('/random/:amount', getRandomRecipes);

recipeRouter.get('/:id',getRecipe);

recipeRouter.put('/:id',checkAuth, multerMiddleware, putRecipe);

recipeRouter.delete('/delete', checkAuth, deleteRecipe);