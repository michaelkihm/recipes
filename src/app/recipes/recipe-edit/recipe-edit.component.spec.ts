import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { of } from 'rxjs';
import { RECIPES } from 'test_data/db-recipes';
import { RecipeCategoryTranslatorPipe } from '../recipeCategoryTranslator/recipeCategoryTranslator.pipe';
import { RecipesService } from './../recipes-service/recipes.service';
import { RecipeEditComponent } from './recipe-edit.component';


describe('RecipeEditComponent', () => {
	
	let component: RecipeEditComponent;
	let fixture: ComponentFixture<RecipeEditComponent>;
	let el: DebugElement;
	//let router: any;
	const { name, description, duration, ingredients, categories } = RECIPES[0];
	const newRecipeIdForAdd = '5';
	const recipesServiceSpy = jasmine.createSpyObj('RecipesService', ['updateRecipe', 'addRecipe']);
	recipesServiceSpy.updateRecipe.and.returnValue(of({ message: 'Update recipe', id: RECIPES[0].id }));
	recipesServiceSpy.addRecipe.and.returnValue(
		of({ message: 'Created recipe', recipe: { ...RECIPES[0], id: newRecipeIdForAdd } }));
	const RouterSpy = {
		navigate: jasmine.createSpy('navigate'),
		url: '/recipes/6151e30732820d7c71705f24/edit'
	};

	beforeEach(async () => {
		

		await TestBed.configureTestingModule({
			declarations: [ RecipeEditComponent, RecipeCategoryTranslatorPipe ],
			imports: [ReactiveFormsModule],
			providers: [
				{ provide: ActivatedRoute,
					useValue: {
							data: {
								subscribe: (fn: (value: Data) => void) => fn({
									recipe: RECIPES[0],
								})
							}
					}
				},
				{ provide: RecipesService, useValue: recipesServiceSpy },
				{ provide: Router, useValue: RouterSpy }
				]
			}
		)
		.compileComponents();
	});

	beforeEach(() => {

		fixture = TestBed.createComponent(RecipeEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		el = fixture.debugElement;
		recipesServiceSpy.addRecipe.calls.reset();
		recipesServiceSpy.updateRecipe.calls.reset();
		RouterSpy.navigate.calls.reset();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have a the recipe name in the title',() => {
		
		const title = el.query(By.css('#title'));
		const durationValue = el.query(By.css('#durationValue'));
		const durationUnit = el.query(By.css('#durationUnit'));

		expect(title.nativeElement.textContent).toBe(`Edit ${name}`);
		expect(+durationValue.nativeElement.value).toBe(duration.duration);
		expect(durationUnit.nativeElement.value).toBe(duration.unit);

		description.forEach((step, i) => {
			expect(el.query(By.css(`#descr_${i}`))).toBeTruthy();
			expect(component.recipeForm.value['description'][i]).toBe(step);
		});

		ingredients.forEach((ingredient, i) => {
			expect(el.query(By.css(`#ingredientAmount_${i}`))).toBeTruthy();
			expect(component.recipeForm.value['ingredients'][i].amount).toBe(ingredient.amount);
			expect(el.query(By.css(`#ingredientName_${i}`))).toBeTruthy();
			expect(component.recipeForm.value['ingredients'][i].name).toBe(ingredient.name);
			expect(el.query(By.css(`#ingredientUnit_${i}`))).toBeTruthy();
			expect(component.recipeForm.value['ingredients'][i].unit).toBe(ingredient.unit);
		});

		expect(component.recipeForm.value['categories']).toEqual(categories);

	});

	it('Checkbox should update Form correctly',() => {

		expect(component.recipeForm.value['categories']).toEqual(categories);

		const italianCheck = el.nativeElement.querySelector('#italian');
		const pastaCheck = el.nativeElement.querySelector('#pasta');
		const indianCheck = el.nativeElement.querySelector('#indian');
		
		expect(italianCheck).toBeTruthy();
		expect(italianCheck.checked).toBeTruthy();
		expect(pastaCheck).toBeTruthy();
		expect(pastaCheck.checked).toBeTruthy();
		expect(indianCheck).toBeTruthy();
		expect(indianCheck.checked).not.toBeTruthy();

		indianCheck.click();
		expect(component.recipeForm.value['categories']).toEqual([...categories,'indian']);

		italianCheck.click();
		expect(italianCheck.checked).not.toBeTruthy();

		expect(component.recipeForm.value['categories']).toEqual(['pasta','indian']);
		
		
	});

	it('should call addRecipe if in add mode',() => {

		component.currentMode = 'add';
		component.onSubmit();
		fixture.detectChanges();

		expect(recipesServiceSpy.updateRecipe).not.toHaveBeenCalled();
		expect(recipesServiceSpy.addRecipe).toHaveBeenCalled();
		expect(RouterSpy.navigate).toHaveBeenCalledWith(['/recipes', newRecipeIdForAdd]);
	});

	it('should call updateRecipe if in edit mode',() => {

		component.currentMode = 'edit';
		component.onSubmit();
		fixture.detectChanges();

		expect(recipesServiceSpy.updateRecipe).toHaveBeenCalled();
		expect(recipesServiceSpy.addRecipe).not.toHaveBeenCalled();
		expect(RouterSpy.navigate).toHaveBeenCalledWith(['/recipes', RECIPES[0].id]);
	});
});
