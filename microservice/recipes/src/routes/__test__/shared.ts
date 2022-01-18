import { NewRecipe } from '@mickenhosrecipes/common';
import request from 'supertest';
import { app } from '../../app';

export const createRecipe = (recipe: NewRecipe): request.Test => {
    return request(app).post('/api/recipes').set('Cookie', global.signin()).send(recipe);
};