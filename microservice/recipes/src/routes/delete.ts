import { BadRequestError, requireAuth } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { RecipeModel } from '../models/recipe.model';

type DeleteRecipeResponse = {
    message: string;
};

const router = express.Router();

const deleteRecipe = async (req: Request<{id: string}>, res: Response<DeleteRecipeResponse>): Promise<void> => {

    try {
        await RecipeModel.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: `Deleted recipe ${req.params.id}` });
    } catch (err) {
        throw new BadRequestError(`Recipe with id ${req.params.id} does not exist and can not be deleted`);
    }
};

router.delete(
    '/api/recipes/:id',
    requireAuth,
    deleteRecipe);

export { router as deleteRecipeRouter };