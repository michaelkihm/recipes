import { BaseRecipe } from '@mickenhosrecipes/common';
import request from 'supertest';
import { app } from '../../app';

export const createRecipe = (recipe: BaseRecipe): request.Test => {
    return request(app).post('/api/recipes').set('Cookie', global.signin()).send(recipe);
};