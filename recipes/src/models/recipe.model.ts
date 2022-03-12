import { Ingredient, BaseRecipe, Recipe, Duration } from '@mickenhosrecipes/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose from 'mongoose';
import { recipeDefaultImageUrl } from '../constants';

export interface RecipeDoc extends mongoose.Document, BaseRecipe {
    version: number;
}

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

const DurationSchema = new mongoose.Schema<Duration>({
    duration: { type: Number, required: true },
    unit: { type: String, required: true },
},{
    toJSON: {
        transform(_doc, ret) {
            delete ret._id;
        }
    }
});

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: [String], required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true },
    duration: { type: DurationSchema, required: true },
    categories: { type: [String], required: true },
    ingredients: { type: [IngredientSchema], required: true },
    image: { type: String, required: false, default: recipeDefaultImageUrl } },
    {
      toJSON: {
        transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
        },
      },
    }
);

RecipeSchema.index({ name: 'text', description: 'text' });
RecipeSchema.set('versionKey','version');
RecipeSchema.plugin(updateIfCurrentPlugin);


RecipeSchema.statics.build = (attrs: Recipe) => {
    return new RecipeModel(attrs);
};
  
const RecipeModel = mongoose.model<RecipeDoc, RecipeModel>('Recipe', RecipeSchema);

export { RecipeModel };