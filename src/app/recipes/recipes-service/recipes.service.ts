import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipesGetResponse, SingleRecipeResponse } from './../../../../backend/src/controllers/recipes.controller';
import { ALL_CATEGORIES, Category } from './../../../../models/category.type';

@Injectable({
    providedIn: 'root'
})
export class ReceipesService {

    private baseUrl = 'http://localhost:4000/api/recipes';
    private randomRecipesAmount = 2;

    constructor(private http: HttpClient) {}

    fetchRecipes(): Observable<RecipesGetResponse> {
        return this.http.get<RecipesGetResponse>(this.baseUrl);
    }

    fetchRecipe(id: string): Observable<SingleRecipeResponse> {
        return this.http.get<SingleRecipeResponse>(`${this.baseUrl}/${id}`);
    }

    fetchRandomRecipes(): Observable<RecipesGetResponse> {
        return this.http.get<RecipesGetResponse>(`${this.baseUrl}/random/${this.randomRecipesAmount}`);
    }
    
    getCategories(): readonly Category[] {
        return ALL_CATEGORIES;
    }
}