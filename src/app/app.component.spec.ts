import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './header/header.component';

describe('AppComponent', () => {

  const authServiceSpy = jasmine.createSpyObj('AuthService', ['autoAuthUser']);

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
		}).compileComponents();
  });

  it('should create the app', () => {

		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
  });

  it('should have called autoAuthUser from AuthService', () => {

		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		expect(authServiceSpy.autoAuthUser).toHaveBeenCalled();
  });
});
