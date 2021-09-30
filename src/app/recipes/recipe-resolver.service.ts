import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from 'models/recipe.model';
import { Observable } from 'rxjs';
import { RecipesService } from './recipes-service/recipes.service';


@Injectable({
    providedIn: 'root'
})
export class RecipeResolver implements Resolve<Recipe | undefined> {

    constructor(private recipesService: RecipesService) {}

    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Recipe | undefined> {
        return this.recipesService.fetchRecipe(route.params['id']);
    }
}