import { connect, connection } from 'mongoose';
import { RECIPES } from '../../../test_data/db-data';
import { RecipeModel } from './../models/recipe';


const testDBPath = 'mongodb://root:rootpassword@localhost:27017/admin';

describe('Recipes Routes',() => {

    beforeAll((done) => {

        connect(testDBPath)
            .then(() => migrateData())
            .then(_result => {
                done();
            })
            .catch(err => {console.log(err);});
    });

    const migrateData = async () => RecipeModel.insertMany(RECIPES);

    afterAll((done) => {
        connection.collections.recipes.drop(() => {
            connection.close(true);
            done();
        });
    });

    it('should have migrated test data successfully', async () => {
        const docs = await RecipeModel.countDocuments();

        expect(docs).toBe(RECIPES.length);
    });
});