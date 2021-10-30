import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

	isUserAuthenticated: boolean = true;
	private logStatusListener: Subscription;

	constructor(private authService: AuthService) { }

	ngOnInit(): void {
		
		this.isUserAuthenticated = this.authService.getIsAuth();
		this.logStatusListener = this.authService.getAuthStatusListener().subscribe(loggedIn => {
			this.isUserAuthenticated = loggedIn;
		});
	}

	ngOnDestroy(): void {
		this.logStatusListener && this.logStatusListener.unsubscribe();
	}

	onLogout(): void {
		this.authService.logout();
	}

}
