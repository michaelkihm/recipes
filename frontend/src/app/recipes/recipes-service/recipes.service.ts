import { Injectable } from '@angular/core';
import { Recipe } from 'models/recipe.model';
import { RECIPES } from '../../../../test_data/db-data';

@Injectable({
    providedIn: 'root'
})
export class ReceipeService {

    recipes: Recipe[] = RECIPES;

    getRecipe(id: string): Recipe | undefined {
        return this.recipes.find(recipe => recipe.id = id);
    }

    getRecipes(): Recipe[] {
        return this.recipes.slice();
    }
}