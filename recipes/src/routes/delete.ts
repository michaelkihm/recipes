import { BadRequestError, requireAuth, natsWrapper, validateRequest } from '@mickenhosrecipes/common';
import express, { Request, Response } from 'express';
import { RecipeDeletedPublisher } from '../events/publishers/recipe-deleted-publisher';
import { RecipeModel } from '../models/recipe.model';
import { param } from 'express-validator';
import mongoose from 'mongoose';

type DeleteRecipeResponse = {
    message: string;
};

const router = express.Router();

const deleteRecipe = async (req: Request<{id: string}>, res: Response<DeleteRecipeResponse>): Promise<void> => {

    const recipe = await RecipeModel.findById(req.params.id);
    if(recipe){
        await recipe.remove();
        await new RecipeDeletedPublisher(natsWrapper.client).publish([{ id: req.params.id, version: recipe.version }]);
        res.status(200).send({ message: `Deleted recipe ${req.params.id}` });
    } else {
        throw new BadRequestError(`Recipe with id ${req.params.id} does not exist and can not be deleted`);
    }
};

router.delete(
    '/api/recipes/:id',
    requireAuth,
    [
        param('id')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('User Id must be a valid Mongo Object id')
    ],
    validateRequest,
    deleteRecipe);

export { router as deleteRecipeRouter };