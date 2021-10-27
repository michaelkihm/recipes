import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { LoginResponse, UserSignupResponse } from '../../../backend/src/controllers/user.controller';
import { User } from '../../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl = 'http://localhost:4000/api/user';
    private token: string;
    private isAuthenticated = false;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: NodeJS.Timer;
    private userId: string;

    constructor(private http: HttpClient, private router: Router) { }

    getToken(): string {
        return this.token;
    }

    getUserId(): string {
        return this.userId;
    }

    getIsAuth(): boolean {
        return this.isAuthenticated;
    }

    getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string): void {
        
        const authData: User = { email, password };
        this.http.post<UserSignupResponse>(`${this.baseUrl}/signup`,authData)
			.subscribe(res => console.log(res.message));
    }

    login(email: string, password: string): void {

        const authData: User = { email, password };
        this.http.post<LoginResponse>(`${this.baseUrl}/login`,authData)
          	.subscribe(response => {

				const { token, userId, expiresIn } = response;
				if (token && userId && expiresIn) {
                    this.token = token;
                    this.userId = userId;
                    this.setAuthTimer(expiresIn);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
                    console.log(expirationDate);
                    this.saveAuthData(token, expirationDate, userId);
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
			this.setAuthTimer(expiresIn / 1000);
			this.authStatusListener.next(true);
        }
    }
    
    logout(): void {
        this.token = '';
        this.isAuthenticated = false;
        this.userId = '';
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }
    
    private setAuthTimer(duration: number) {
        console.log('Setting timer: ' + duration);
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, duration * 1000);
    }
    
    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }
    
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }
    
    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate || !userId) return;
        
        return {
          token,
          expirationDate: new Date(expirationDate),
          userId
        };
    }
}