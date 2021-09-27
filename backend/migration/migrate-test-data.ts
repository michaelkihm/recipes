import { connect, connection, Types } from 'mongoose';
import { RECIPES } from '../../test_data/db-data';
import { RecipeModel } from '../src/models/recipe';

const dBPath = 'mongodb://root:rootpassword@localhost:27017/admin';

connect(dBPath)
    .then(() => connection.collections.recipes.drop())
    .then(() => migrateData())
    .then(() => {
        console.log('Migrated test_db');
        connection.close();
    })
    .catch(err => console.error(`Error during test data migration: \n ${err}`));

const migrateData = async () => RecipeModel.insertMany(RECIPES.map(recipe => ({
    ...recipe,
    _id: Types.ObjectId.createFromHexString(recipe.id)
})));