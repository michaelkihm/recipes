import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ALL_CATEGORIES } from 'models/category.type';
import { RECIPES } from 'test_data/db-recipes';
import {
    RecipesGetResponse, SingleRecipeResponse
} from './../../../../backend/src/controllers/recipes-controller/recipes.controller.types';
import { RecipesService } from './recipes.service';

describe('ReceipesService',() => {

    let recipesService: RecipesService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RecipesService]
        });
        recipesService = TestBed.inject(RecipesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should return all categories', () => {

        expect(recipesService.getCategories()).toEqual(ALL_CATEGORIES);
    });

    it('should fetch a recipe by id',() => {

        const id = RECIPES[0].id as string;
        const recipeResult : SingleRecipeResponse = {
            message: 'Test message',
            recipe: RECIPES[0]
        };

        recipesService.fetchRecipe(id).subscribe(recipe => {
            expect(recipe).toEqual(RECIPES[0]);
        });

        const req = httpTestingController.expectOne(`http://localhost:4000/api/recipes/${id}`);
        expect(req.request.method).toEqual('GET');
        req.flush(recipeResult);
    });

    it('should fectch all recipes', () => {

        const recipesResult: RecipesGetResponse = {
            message: 'Test',
            recipes: RECIPES
        };

        recipesService.fetchRecipes().subscribe(recipes => {
            expect(recipes).toEqual(RECIPES);
        });

        const req = httpTestingController.expectOne('http://localhost:4000/api/recipes');
        expect(req.request.method).toEqual('GET');
        req.flush(recipesResult);
    });

    it('should update a recipe', () => {

        const recipe = RECIPES[0];
        const updatedName = 'Test';
        const id = recipe.id as string;
        const updatedRecipe = new FormData();
        updatedRecipe.append('name',updatedName);
        updatedRecipe.append('userId', recipe.userId as string);
        updatedRecipe.append('description', JSON.stringify(recipe.description));
        updatedRecipe.append('id',id);
        updatedRecipe.append('categories', JSON.stringify(recipe.categories));
        updatedRecipe.append('duration',JSON.stringify(recipe.duration));
        updatedRecipe.append('ingredients',JSON.stringify(recipe.ingredients));
        updatedRecipe.append('image',recipe.image as string);


        recipesService.updateRecipe(updatedRecipe).subscribe(result => {
            expect(result.message).toEqual(`Updated recipe ${id}`);
        });

        const req = httpTestingController.expectOne(`http://localhost:4000/api/recipes/${id}`);
        expect(req.request.method).toEqual('PUT');
        req.flush({
            message: `Updated recipe ${id}`
        });
    });

    it('should add a recipe',() => {

        const newRecipe = RECIPES[0];
        const recipeFormData = new FormData();
        recipeFormData.append('name',newRecipe.name);
        recipeFormData.append('userId', newRecipe.userId as string);
        recipeFormData.append('description', JSON.stringify(newRecipe.description));
        recipeFormData.append('id','');
        recipeFormData.append('categories', JSON.stringify(newRecipe.categories));
        recipeFormData.append('duration',JSON.stringify(newRecipe.duration));
        recipeFormData.append('ingredients',JSON.stringify(newRecipe.ingredients));
        recipeFormData.append('image',newRecipe.image as string);

        recipesService.addRecipe(recipeFormData).subscribe(result => {
            expect(result.message.includes('Created recipe')).toBeTrue();
        });

        const req = httpTestingController.expectOne('http://localhost:4000/api/recipes');
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(recipeFormData);
        req.flush({
            recipe: newRecipe,
            message: 'Created recipe'
        });
    });

    it('should remove a recipe correctly', () => {

        const id = '3';
        recipesService.deleteRecipe(id).subscribe(result => {
            expect(result.message.includes(`Deleted recipe ${id}`)).toBeTrue();
        });

        const req = httpTestingController.expectOne('http://localhost:4000/api/recipes/delete');
        expect(req.request.method).toEqual('DELETE');
        req.flush({
            message: `Deleted recipe ${id}`
        });

    });
});