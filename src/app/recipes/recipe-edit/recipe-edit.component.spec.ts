import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { RECIPES } from 'test_data/db-data';
import { RecipeEditComponent } from './recipe-edit.component';


describe('RecipeEditComponent', () => {
	
	let component: RecipeEditComponent;
	let fixture: ComponentFixture<RecipeEditComponent>;
	let el: DebugElement;
	const { name, description, duration, ingredients, categories } = RECIPES[0];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
		declarations: [ RecipeEditComponent ],
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
			}]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecipeEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		el = fixture.debugElement;
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
});
