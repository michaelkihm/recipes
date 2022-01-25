import { BaseRecipe } from '@mickenhosrecipes/common';
import request from 'supertest';
import { app } from '../../app';

export const createRecipe = (recipe: BaseRecipe): request.Test => {
    
    return request(app)
        .post('/api/recipes')
        .set('Cookie', global.signin())
        .set('Content-type', 'multipart/form-data')
        .field('name',recipe.name )
        .field('userId', recipe.userId)
        .field('description', JSON.stringify(recipe.description))
        .field('categories', JSON.stringify(recipe.categories))
        .field('duration',JSON.stringify(recipe.duration))
        .field('ingredients',JSON.stringify(recipe.ingredients))
        .attach('image',recipe.image || '');
};