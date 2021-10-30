import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './header/header.component';

describe('AppComponent', () => {

	const authServiceSpy = jasmine.createSpyObj('AuthService',
		['autoAuthUser', 'getIsAuth','getAuthStatusListener','getUsernameListener', 'getUsername']);
	authServiceSpy.getAuthStatusListener.and.returnValue(of(true));
	authServiceSpy.getUsernameListener.and.returnValue(of('Test User'));

	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	beforeEach(async () => {

			await TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
			],
			declarations: [
				AppComponent,
				HeaderComponent
			],
			providers: [
				{ provide: AuthService, useValue: authServiceSpy }
			]
			})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the app', () => {

			expect(component).toBeTruthy();
	});

	it('should have called autoAuthUser from AuthService', () => {

			fixture.detectChanges();
			expect(authServiceSpy.autoAuthUser).toHaveBeenCalled();
	});
});
