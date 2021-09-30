import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from 'models/recipe.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipesGetResponse, SingleRecipeResponse } from './../../../../backend/src/controllers/recipes.controller';
import { ALL_CATEGORIES, Category } from './../../../../models/category.type';

@Injectable({
    providedIn: 'root'
})
export class RecipesService {

    private baseUrl = 'http://localhost:4000/api/recipes';
    private randomRecipesAmount = 2;

    constructor(private http: HttpClient) {}

    fetchRecipes(): Observable<Recipe[]> {
        return this.http.get<RecipesGetResponse>(this.baseUrl).pipe(map(response => response.recipes));
    }

    fetchRecipe(id: string): Observable<Recipe | undefined> {
        return this.http.get<SingleRecipeResponse>(`${this.baseUrl}/${id}`).pipe(map(response => response.recipe));
    }

    fetchRandomRecipes(): Observable<Recipe[]> {
        return this.http.get<RecipesGetResponse>(`${this.baseUrl}/random/${this.randomRecipesAmount}`)
            .pipe(map(response => response.recipes));
    }
    
    getCategories(): readonly Category[] {
        return ALL_CATEGORIES;
    }

    updateRecipe(recipe: Recipe): Observable<Recipe | undefined> {
        return this.http.put<SingleRecipeResponse>(`${this.baseUrl}/${recipe.id}`, { recipe })
            .pipe(map(response => response.recipe));
    }
}