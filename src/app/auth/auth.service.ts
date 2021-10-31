import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { LoginResponse, UserSignupResponse } from '../../../backend/src/controllers/user.controller';
import { User } from '../../../models/user.model';

export type UserInfo = {
    username: string,
    userId: string
};
@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl = 'http://localhost:4000/api/user';
    private token: string;
    private isAuthenticated = false;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: NodeJS.Timer;
    private userId: string;
    private username: string;
    private usernameListener = new Subject<UserInfo>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken(): string {
        return this.token;
    }

    getUserId(): string {
        return this.userId;
    }

    getUser(): UserInfo {
        return {
            username: this.username,
            userId: this.userId
        };
    }

    getUserListener(): Observable<UserInfo> {
        return this.usernameListener.asObservable();
    }

    getIsAuth(): boolean {
        return this.isAuthenticated;
    }

    getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string, username: string): void {
        
        const authData: User = { email, password, username };
        this.http.post<UserSignupResponse>(`${this.baseUrl}/signup`,authData)
			.subscribe(res => console.log(res.message));
    }

    login(email: string, password: string): void {

        const authData: User = { email, password };
        this.http.post<LoginResponse>(`${this.baseUrl}/login`,authData)
          	.subscribe(response => {

				const { token, userId, expiresIn, username } = response;
				if (token && userId && expiresIn && username) {
                    this.token = token;
                    this.userId = userId;
                    this.username = username;
                    this.setAuthTimer(expiresIn);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.usernameListener.next({ username, userId });
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
                    this.saveAuthData(token, expirationDate, userId, username);
                    this.router.navigate(['/']);
				}
            });
      }
    
    autoAuthUser(): void {

        const authInformation = this.getAuthData();
        if (!authInformation) return;
        
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
			this.token = authInformation.token;
			this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.username = authInformation.username;
			this.setAuthTimer(expiresIn / 1000);
			this.authStatusListener.next(true);
            this.usernameListener.next({ username: authInformation.username, userId: authInformation.userId });
        }
    }
    
    logout(): void {
        this.token = '';
        this.isAuthenticated = false;
        this.userId = '';
        this.username = '';
        this.authStatusListener.next(false);
        this.usernameListener.next({ username: '', userId: '' });
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }
    
    private setAuthTimer(duration: number) {

        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, duration * 1000);
    }
    
    private saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
    }
    
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    }
    
    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        if (!token || !expirationDate || !userId || !username) return;
        
        return {
          token,
          expirationDate: new Date(expirationDate),
          userId,
          username
        };
    }
}