import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ALL_CATEGORIES } from 'models/category.type';
import { Recipe } from 'models/recipe.model';
import { RECIPES } from 'test_data/db-data';
import { RecipesGetResponse, SingleRecipeResponse } from './../../../../backend/src/controllers/recipes.controller';
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

        const updatedRecipe = { ...RECIPES[0] };
        updatedRecipe.name = 'Test';
        const id = updatedRecipe.id as string;

        recipesService.updateRecipe(updatedRecipe).subscribe(recipe => {
            expect((recipe as Recipe).name).toEqual('Test');
        });

        const req = httpTestingController.expectOne(`http://localhost:4000/api/recipes/${id}`);
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body.recipe).toEqual(updatedRecipe);
        req.flush({
            recipe: updatedRecipe,
            message: `Updated recipe ${id}`
        });
    });

    it('should add a recipe',() => {

        const newRecipe = RECIPES[0];

        recipesService.addRecipe(newRecipe).subscribe(result => {
            expect(result).toEqual(newRecipe);
        });

        const req = httpTestingController.expectOne('http://localhost:4000/api/recipes');
        expect(req.request.method).toEqual('POST');
        expect(req.request.body.recipe).toEqual(newRecipe);
        req.flush({
            recipe: newRecipe,
            message: 'Created recipe'
        });
    });
});