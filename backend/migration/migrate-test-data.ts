import { connect, connection, Types } from 'mongoose';
import { RECIPES } from '../../test_data/db-recipes';
import { USERS } from '../../test_data/db-users';
import { RecipeModel } from '../src/models/recipe';
import { UserModel } from '../src/models/user';

const dBPath = 'mongodb://root:rootpassword@localhost:27017/admin';

connect(dBPath)
    .then(() => {
        connection.collections.recipes.drop();
        connection.collections.users.drop();
    })
    .then(() => migrateRecipeData())
    .then(() => migrateUserData())
    .then(() => {
        console.log('Migrated test_db');
        connection.close();
    })
    .catch(err => console.error(`Error during test data migration: \n ${err}`));

const migrateRecipeData = async () => RecipeModel.insertMany(RECIPES.map(recipe => ({
    ...recipe,
    _id: Types.ObjectId.createFromHexString(recipe.id)
})));

const migrateUserData = async () => UserModel.insertMany(USERS.map(user => ({
    ...user,
    _id: Types.ObjectId.createFromHexString(user.id)
})));