import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RecipeCategoryTranslatorPipe } from '../recipeCategoryTranslator/recipeCategoryTranslator.pipe';
import { ALL_CATEGORIES } from './../../../../models/category.type';
import { RecipesService } from './../recipes-service/recipes.service';
import { CategoriesListComponent } from './categories-list.component';

describe('CategoriesListComponent', () => {
	let component: CategoriesListComponent;
	let fixture: ComponentFixture<CategoriesListComponent>;
	let el: DebugElement;

	beforeEach(async () => {
		
		const recipeServiceSpy = jasmine.createSpyObj('RecipesService',['getCategories']);
		recipeServiceSpy.getCategories.and.returnValue(ALL_CATEGORIES);

		await TestBed.configureTestingModule({
			declarations: [ CategoriesListComponent, RecipeCategoryTranslatorPipe ],
			providers: [{ provide: RecipesService, useValue: recipeServiceSpy }]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CategoriesListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		el = fixture.debugElement;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display all categories', () => {

		const categories = el.queryAll(By.css('.category'));
		expect(categories.length).toBe(ALL_CATEGORIES.length);
	});

	it('should update selected array',() => {

		expect(component.selected).toEqual([]);

		const italianCheck = el.nativeElement.querySelector('#italian');
		const vegetarianCheck = el.nativeElement.querySelector('#vegetarian');
		const indianCheck = el.nativeElement.querySelector('#indian');
		const salatCheck = el.nativeElement.querySelector('#salat');

		expect(italianCheck).toBeTruthy();
		expect(vegetarianCheck).toBeTruthy();

		italianCheck.click();
		vegetarianCheck.click();
		expect(italianCheck.checked).toBeTruthy();
		expect(vegetarianCheck.checked).toBeTruthy();
		expect(component.selected).toEqual(['italian', 'vegetarian']);

		italianCheck.click();
		expect(italianCheck.checked).toBeFalsy();
		expect(vegetarianCheck).toBeTruthy();
		expect(component.selected).toEqual(['vegetarian']);

		indianCheck.click();
		salatCheck.click();
		expect(component.selected).toEqual(['vegetarian','indian','salat']);

		indianCheck.click();
		expect(indianCheck.checked).toBeFalsy();
		expect(component.selected).toEqual(['vegetarian','salat']);

		
	});
});
