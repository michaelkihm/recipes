import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from 'models/recipe.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    DeleteRecipeResponse, RecipesGetResponse, SingleRecipeResponse
} from './../../../../backend/src/controllers/recipes.controller';
import { ALL_CATEGORIES, Category } from './../../../../models/category.type';

@Injectable({
    providedIn: 'root'
})
export class RecipesService {

    private baseUrl = 'http://localhost:4000/api/recipes';
    private randomRecipesAmount = 2;

    constructor(private http: HttpClient) {}

    fetchRecipes( userId?: string, recipeIds?: string[]): Observable<Recipe[]> {
        
        let params = new HttpParams();
        if(userId) params = params.append('userId',userId);
        if(recipeIds) params = params.append('ids',JSON.stringify(recipeIds));
        
        return this.http.get<RecipesGetResponse>(this.baseUrl, { params })
            .pipe(map(response => response.recipes));
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

    updateRecipe(recipe: FormData): Observable<SingleRecipeResponse> {

        const id = recipe.get('id') as string;
        return this.http.put<SingleRecipeResponse>(`${this.baseUrl}/${id}`, recipe );
    }

    addRecipe(recipe: FormData): Observable<SingleRecipeResponse> {
        return this.http.post<SingleRecipeResponse>(this.baseUrl, recipe);
    }

    deleteRecipe(recipeId: string): Observable<DeleteRecipeResponse> {
        return this.http.delete<DeleteRecipeResponse>(`${this.baseUrl}/delete`,{ body: { id: recipeId } });
    }

}