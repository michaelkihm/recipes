import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RECIPES } from 'test_data/db-recipes';
import { RecipeListComponent } from './recipe-list.component';


describe('RecipeListComponent', () => {

	let component: RecipeListComponent;
	let fixture: ComponentFixture<RecipeListComponent>;
	let el: DebugElement;

	const RouterSpy = {
		navigate: jasmine.createSpy('navigate')
	};

	beforeEach(async () => {


		await TestBed.configureTestingModule({
		declarations: [ RecipeListComponent ],
		providers: [
			{ provide: Router, useValue: RouterSpy }
		]
		})
		.compileComponents();
	});

	beforeEach(() => {

		fixture = TestBed.createComponent(RecipeListComponent);
		component = fixture.componentInstance;
		component.recipes = RECIPES;
		el = fixture.debugElement;
		fixture.detectChanges();
	});

	it('should create', () => {

		expect(component).toBeTruthy();
	});

	it('should call router navigate when clicking on card',() => {

		const clickedRecipeId = RECIPES[0].id;
		const listCardDiv = el.nativeElement.querySelector(`#listCardDiv-${clickedRecipeId}`);
		expect(listCardDiv).toBeTruthy();
		
		listCardDiv.click();
		expect(RouterSpy.navigate).toHaveBeenCalledWith(['/recipes', clickedRecipeId]);
	});
});
