import { Document, Types } from 'mongoose';
import { Recipe } from '../../models/recipe.model';
import { User } from '../../models/user.model';
import { RECIPES } from '../../test_data/db-recipes';
import { USERS } from '../../test_data/db-users';
import { RecipeModel } from '../src/models/recipe';
import { UserModel } from '../src/models/user';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecipeDateReturn = Promise<(Document<any, any, Recipe> & Recipe & {_id: Types.ObjectId;})[]>;

export const migrateRecipeData = async (): RecipeDateReturn => RecipeModel.insertMany(RECIPES.map(recipe => ({
    ...recipe,
    userId: Types.ObjectId.createFromHexString(recipe.userId as string),
    _id: Types.ObjectId.createFromHexString(recipe.id)
})));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UserDataReturnType = Promise<(Document<any, any, User> & User & { _id: Types.ObjectId;})[]>;

export const migrateUserData = async (): UserDataReturnType => UserModel.insertMany(USERS.map(user => ({
    ...user,
    _id: Types.ObjectId.createFromHexString(user.id)
})));