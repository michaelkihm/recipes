import { model, Schema } from 'mongoose';
import { Recipe } from '../../../models/recipe.model';


const recipeSchema = new Schema<Recipe>({
    name: { type: String, required: true },
    description: { type: [String], required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'UserModel' ,required: true },
    duration: {
        type: {
            duration: Number,
            unit: String },
        required: true },
    categories: { type: [String], required: true },
    ingredients: {
        type: [{
            name: String,
            amount: Number,
            unit: String
        }],
        required: true },
    image: { type: String, required: false },
});

export const RecipeModel = model<Recipe>('Recipe', recipeSchema);