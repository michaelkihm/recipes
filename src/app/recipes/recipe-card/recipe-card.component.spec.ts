import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { RECIPES } from 'test_data/db-recipes';
import { USERS } from 'test_data/db-users';
import { RecipeCardComponent } from './recipe-card.component';


describe('RecipeCardComponent', () => {
	
	let component: RecipeCardComponent;
	let fixture: ComponentFixture<RecipeCardComponent>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let authService: any;
	const { username, bookmarks, id } = USERS[0];
 
	const authServiceSpy = jasmine.createSpyObj('AuthService',
			['getUserListener', 'upateBookmarks','getUser']);

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ RecipeCardComponent ],
			imports: [RouterTestingModule],
			providers: [{ provide: AuthService, useValue: authServiceSpy }]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecipeCardComponent);
		component = fixture.componentInstance;
		component.recipe = RECIPES[0];
		authService = TestBed.inject(AuthService);
		authService.getUser.and.returnValue({ username, userId: id, bookmarks });
		authService.getUserListener.and.returnValue(of({ username, userId: id, bookmarks }));
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
