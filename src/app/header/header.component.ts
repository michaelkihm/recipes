import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, UserInfo } from './../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

	isUserAuthenticated: boolean = true;
	currentUser: UserInfo;
	private currentUserListener: Subscription;
	private logStatusListener: Subscription;

	constructor(private authService: AuthService) { }

	ngOnInit(): void {
		
		this.isUserAuthenticated = this.authService.getIsAuth();
		this.currentUser = this.authService.getUser();
		this.logStatusListener = this.authService.getAuthStatusListener().subscribe(loggedIn => {
			this.isUserAuthenticated = loggedIn;
		});
		this.currentUserListener = this.authService.getUserListener().subscribe(userInfo =>
			this.currentUser = { ...userInfo });
	}

	ngOnDestroy(): void {
		this.logStatusListener && this.logStatusListener.unsubscribe();
		this.currentUserListener && this.currentUserListener.unsubscribe();
	}

	onLogout(): void {
		this.authService.logout();
	}

}
