import { app } from '../../app';
import request from 'supertest';
import { RecipeModel } from '../../models/recipe.model';
import { NEW_RECIPES, user1Id } from './data/dummy-new-recipes';
import { UserModel } from '../../models/user.model';

describe('GET bookmarks - /api/recipes/bookmarks', () => {

    it('has a route handler listening to GET /api/recipes/bookmarks', async () => {

        const response = await request(app).get('/api/recipes/bookmarks').send();

        expect(response.status).not.toEqual(404);
    });

    it('can only be accessed if the user is signed in', async () => {

        await request(app).get('/api/recipes/bookmarks')
            .send({})
            .expect(401);
    });

    it('returns bookmarked recipes of logged in user', async () => {

        const [recipe1, recipe2] = [NEW_RECIPES[0], NEW_RECIPES[1]];
        const user = UserModel.build(user1Id, { username: 'username', email: 'test@test.com', image: 'image' });
        user.save();
        const rec1 = RecipeModel.build(recipe1);
        rec1.save();
        const rec2 = RecipeModel.build(recipe2);
        rec2.save();
        user.bookmarks = [rec1.id, rec2.id];
        await RecipeModel.build(NEW_RECIPES[2]).save();

        const response = await request(app).get('/api/recipes/bookmarks')
                .set('Cookie', global.signin())
                .send({});

        expect(response.body.length).toBe(2);
        expect([recipe1.name, recipe2.name]).toContain(response.body[0].name);
        expect([recipe1.name, recipe2.name]).toContain(response.body[1].name);
        
    });

    it('does not have a time out if logged in user is not found in database', async () => {

        await request(app).get('/api/recipes/bookmarks')
                .set('Cookie', global.signin())
                .send({})
                .expect(400);
    });
});