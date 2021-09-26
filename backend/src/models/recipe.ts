import { model, Schema } from 'mongoose';
import { Recipe } from '../../../models/recipe.model';


const recipeSchema = new Schema<Recipe>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: String, required: true },
    duration: {
        type: {
            duration: Number,
            unit: String },
        required: true },
    category: { type: [String], required: true },
    ingredients: {
        type: [{
            name: Number,
            amount: Number
        }],
        required: true }
});

export const RecipeModel = model<Recipe>('Recipe', recipeSchema);