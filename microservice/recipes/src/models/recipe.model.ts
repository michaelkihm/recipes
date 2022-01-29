import { Ingredient, BaseRecipe, Recipe } from '@mickenhosrecipes/common';
import mongoose from 'mongoose';

export interface RecipeDoc extends mongoose.Document, BaseRecipe {}

interface RecipeModel extends mongoose.Model<RecipeDoc> {
    build(attrs: BaseRecipe): RecipeDoc;
}

const IngredientSchema = new mongoose.Schema<Ingredient>({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true },
},{
    toJSON: {
        transform(_doc, ret) {
            delete ret._id;
        }
    }
});

const RecipeSchema = new mongoose.Schema<Recipe>({
    name: { type: String, required: true },
    description: { type: [String], required: true },
    userId: { type: String ,required: true },
    duration: {
        type: {
            duration: Number,
            unit: String },
        required: true },
    categories: { type: [String], required: true },
    ingredients: { type: [IngredientSchema], required: true },
    image: { type: String, required: false, default: '/api/recipes/images/recipe-dummy.png' } },
    {
      toJSON: {
        transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
        },
      },
    }
);

RecipeSchema.statics.build = (attrs: Recipe) => {
    return new RecipeModel(attrs);
};
  
const RecipeModel = mongoose.model<RecipeDoc, RecipeModel>('Recipe', RecipeSchema);

export { RecipeModel };