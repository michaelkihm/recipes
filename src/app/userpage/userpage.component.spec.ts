import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RECIPES } from 'test_data/db-recipes';
import { user1Id } from './../../../test_data/db-users';
import { AuthService } from './../auth/auth.service';
import { RecipesService } from './../recipes/recipes-service/recipes.service';
import { UserpageComponent } from './userpage.component';

describe('UserpageComponent', () => {

	let component: UserpageComponent;
	let fixture: ComponentFixture<UserpageComponent>;

	const recipesServiceSpy = jasmine.createSpyObj('RecipesService', ['fetchRecipes']);
	recipesServiceSpy.fetchRecipes.and.returnValue(of(RECIPES.filter(recipe => recipe.userId === user1Id)));

	const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
	authServiceSpy.getUser.and.returnValue({ username: 'TestUser', userId: user1Id });

	beforeEach(async () => {

		await TestBed.configureTestingModule({
			declarations: [ UserpageComponent ],
			providers: [
				{ provide: RecipesService, useValue: recipesServiceSpy },
				{ provide: AuthService, useValue: authServiceSpy }
			]
		})
		.compileComponents();
	});

	beforeEach(() => {

		fixture = TestBed.createComponent(UserpageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		
		expect(component).toBeTruthy();
	});
});
