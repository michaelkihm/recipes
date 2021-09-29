import { Request, Response } from 'express';
import { Document, Types } from 'mongoose';
import { Category } from '../../../models/category.type';
import { Recipe } from '../../../models/recipe.model';
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
    
    RecipeModel.find()
        .then(docs => res.status(200).json({ message: `Have ${docs.length} recipes`, recipes: docs }))
        .catch(err => res.status(404).json({ message: `Error getting all docs: ${err}`, recipes: [] }));
};


export const getRandomRecipes = (req: Request<{amount: string}>, res: Response<RecipesGetResponse>): void => {

    RecipeModel.find()
        .then(docs => {
            if(+req.params.amount > docs.length)
                res.status(404).json({ message: `Number ${req.params.amount} is longer than the list of recipes`,
                        recipes: [] });
            else
                res.status(200).json({
                    message: `Return ${req.params.amount} recipes`,
                    recipes: docs.map(doc => mongoDBResultToRecipe(doc))
                                .sort(() => Math.random() - Math.random()).slice(0, +req.params.amount) });
        })
        .catch(err => res.status(404).json({
            message: `Error while fetching random recipes: ${err}`,
            recipes: []
        }));
    // if(+req.params.amount < RECIPES.length){
        // res.status(200).json({
        //     message: `Return ${req.params.amount} recipes`,
        //     recipes: RECIPES.sort(() => Math.random() - Math.random()).slice(0, +req.params.amount)
    //     });
    // } else {
    //     res.status(404).json({
    //         message: `Number ${req.params.amount} is longer than the list of recipes`,
    //         recipes: []
    //     });
    // }
};


export const getRecipe = (req: Request<{id: string}>, res: Response<SingleRecipeResponse>): void => {

    RecipeModel.findById(req.params.id)
        .then(doc => res.status(200).json({
            message: `Found recipe ${req.params.id}`,
            recipe: mongoDBResultToRecipe(doc)
        }))
        .catch(err => res.status(404).json({
            message: `Could not find recipe with id ${req.params.id}: ${err}`
        }));
};


export const postRecipe = (req: Request<never,never,{recipe: Recipe}>, res: Response<SingleRecipeResponse>): void => {

    RecipeModel.create(req.body.recipe)
        .then(createdRecipe => res.status(201).json({
                message: `Created recipe ${createdRecipe.name} successfully`,
                recipe: mongoDBResultToRecipe(createdRecipe) })
        )
        .catch(err => res.status(500).json({
            message: `Could not save recipe ${req.body.recipe.name} in the database. \n Error: ${err}`
        }));
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mongoDBResultToRecipe = (doc: Document<any, any, Recipe> & Recipe & {_id: Types.ObjectId;}): Recipe => ({
    name: doc.name,
    id: doc._id,
    description: doc.description,
    createdBy: doc.createdBy,
    category: doc.category as Category[],
    duration: { duration: doc.duration.duration, unit: doc.duration.unit },
    ingredients: doc.ingredients.map(
                    ingredient => ({ name: ingredient.name, amount: ingredient.amount, unit: ingredient.unit }))

});


// eslint-disable-next-line max-len
export const putRecipe = (req: Request<{id: string},never, {recipe: Recipe}>, res: Response<SingleRecipeResponse>): void => {

    RecipeModel.updateOne({ _id: req.params.id }, req.body.recipe)
        .then(() => res.status(200).json({
            message: `Updated recipe ${req.params.id}` }))
        .catch(err => res.status(404).json({ message: `Error while updating recipe ${req.params.id}: ${err}` }));
        
};