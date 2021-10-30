import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
	
	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let authService: any;
	let el: DebugElement;

	beforeEach(waitForAsync(() => {

		const authServiceSpy = jasmine.createSpyObj('AuthService',
			['getIsAuth', 'getAuthStatusListener', 'getUsernameListener', 'getUsername']);

		TestBed.configureTestingModule({
			declarations: [
				HeaderComponent
			],
			providers: [{ provide: AuthService, useValue: authServiceSpy }]
		}).compileComponents()
		.then(() => {
			fixture = TestBed.createComponent(HeaderComponent);
			component = fixture.componentInstance;
			el = fixture.debugElement;
			authService = TestBed.inject(AuthService);
			authService.getUsernameListener.and.returnValue(of('TestUser'));
		});
		
	}));

	it('should create', () => {
	
		expect(component).toBeTruthy();
	});

	it('should display only Einloggen button if NOT logged in', () => {

		authService.getAuthStatusListener.and.returnValue(of(false));
		authService.getIsAuth.and.returnValue(false);
		
		fixture.detectChanges();
		
		const einloggenBtn = el.query(By.css('#logInBtn'));
		const logOutbtn = el.query(By.css('#logOutbtn'));
		const userPageLink = el.query(By.css('#userPageLink'));
		const username = el.query(By.css('#username'));

		expect(einloggenBtn).toBeTruthy();
		expect(logOutbtn).not.toBeTruthy();
		expect(userPageLink).not.toBeTruthy();
		expect(username).not.toBeTruthy();
		
	});


	it('should display userPageLink, username and logOutbtn button if logged in', () => {

		authService.getAuthStatusListener.and.returnValue(of(true ));
		authService.getIsAuth.and.returnValue(true);
		fixture.detectChanges();
		
		const einloggenBtn = el.query(By.css('#logInBtn'));
		const logOutbtn = el.query(By.css('#logOutbtn'));
		const userPageLink = el.query(By.css('#userPageLink'));
		const username = el.query(By.css('#username'));

		expect(einloggenBtn).not.toBeTruthy();
		expect(logOutbtn).toBeTruthy();
		expect(userPageLink).toBeTruthy();
		expect(username).toBeTruthy();
		
	});


});
