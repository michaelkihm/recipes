import { connect, connection } from 'mongoose';
import { migrateRecipeData, migrateUserData } from './migration-helpers';

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