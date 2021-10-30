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
	username: string;
	private usernameStatusListener: Subscription;
	private logStatusListener: Subscription;

	constructor(private authService: AuthService) { }

	ngOnInit(): void {
		
		this.isUserAuthenticated = this.authService.getIsAuth();
		this.username = this.authService.getUsername();
		this.logStatusListener = this.authService.getAuthStatusListener().subscribe(loggedIn => {
			this.isUserAuthenticated = loggedIn;
		});
		this.usernameStatusListener = this.authService.getUsernameListener().subscribe(username =>
			this.username = username);
	}

	ngOnDestroy(): void {
		this.logStatusListener && this.logStatusListener.unsubscribe();
		this.usernameStatusListener && this.usernameStatusListener.unsubscribe();
	}

	onLogout(): void {
		this.authService.logout();
	}

}
