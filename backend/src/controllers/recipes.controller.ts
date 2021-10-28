import { Request, Response } from 'express';
import { Document, Types } from 'mongoose';
import multer from 'multer';
import { Category } from '../../../models/category.type';
import { Recipe, recipeFormDataToRecipe, RecipeStrings } from '../../../models/recipe.model';
import { RecipeModel } from '../models/recipe';

export type RecipesGetResponse = {
    message: string,
    recipes: Recipe[]
};


export type SingleRecipeResponse = {
    message: string,
    recipe?: Recipe
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MongooseRecipeResult = Document<any, any, Recipe> & Recipe & {_id: Types.ObjectId;};


type PutPostRequest = Request<{id: string},never, RecipeStrings>;

const getMimeType = (type: string) => {

    const MIME_TYPE_MAP: {[key:string]: string} = {
        'image/png': 'png',
        'image/jpeg': 'png',
        'image/jpg': 'jpg'
    };

    if(type in MIME_TYPE_MAP){
        return MIME_TYPE_MAP[type];
    } else return '';
};


const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        
        const isValid = getMimeType(file.mimetype);
        let error: Error | null = new Error('Invalid Mime type');
        if(isValid) error = null;
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = getMimeType(file.mimetype);
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

export const multerMiddleware = multer({ storage }).single('image');
const didMulterSaveImage = (req: Request | PutPostRequest) => req?.file?.filename ? true : false;

export const getRecipes = (_req: Request, res: Response<RecipesGetResponse>): void => {
    
    RecipeModel.find()
        .then(docs => res.status(200).json({
            message: `Have ${docs.length} recipes`,
            recipes: docs.map(doc => mongoDBResultToRecipe(doc)) }))
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
};


export const getRecipe = (req: Request<{id: string}>, res: Response<SingleRecipeResponse>): void => {

    RecipeModel.findById(req.params.id)
        .then(doc => res.status(200).json({
            message: `Found recipe ${req.params.id}`,
            recipe: doc ? mongoDBResultToRecipe(doc) : undefined
        }))
        .catch(err => res.status(404).json({
            message: `Could not find recipe with id ${req.params.id}: ${err}`
        }));
};


export const postRecipe = (req: PutPostRequest, res: Response<SingleRecipeResponse>): void => {

    const recipe = processImageDataAndFormData(req);
    
    RecipeModel.create(recipe)
        .then(createdRecipe => res.status(201).json({
                message: `Created recipe ${createdRecipe.name} successfully`,
                recipe: mongoDBResultToRecipe(createdRecipe) })
        )
        .catch(err => res.status(500).json({
            message: `Could not save recipe ${recipe.name} in the database. \n Error: ${err}`
        }));
};


const mongoDBResultToRecipe = (doc: MongooseRecipeResult ): Recipe => ({
    name: doc.name,
    id: doc._id,
    description: doc.description,
    userId: doc.userId,
    categories: doc.categories as Category[],
    duration: { duration: doc.duration.duration, unit: doc.duration.unit },
    ingredients: doc.ingredients.map(
                    ingredient => ({ name: ingredient.name, amount: ingredient.amount, unit: ingredient.unit })),
    image: doc.image || ''

});


// eslint-disable-next-line max-len
export const putRecipe = (req: PutPostRequest, res: Response<SingleRecipeResponse>): void => {
    
    const recipe = processImageDataAndFormData(req);
  
    RecipeModel.updateOne({ _id: req.params.id, userId: recipe.userId }, recipe)
        .then(result => {
            if(result.modifiedCount > 0) return res.status(200).json({ message: `Updated recipe ${req.params.id}` });
            else return res.status(401).json({ message: `Not Authorized!! Could not update recipe ${req.params.id}.` });
        })
        .catch(err => res.status(404).json({ message: `Error while updating recipe ${req.params.id}: ${err}` }));
};

const processImageDataAndFormData = (req: PutPostRequest): Recipe => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recipe = recipeFormDataToRecipe({ ...req.body, userId: (req as any).userData.userId });
    let image = recipe.image;
    if(didMulterSaveImage(req)){
        const url = `${req.protocol}://${req.get('host')}`;
        image = `${url}/images/${req?.file?.filename}`;
    }
    return { ...recipe, image };
};