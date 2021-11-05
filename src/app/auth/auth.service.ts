import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
    LoginResponse, UserSignupResponse, UserUpdateResponse
} from '../../../backend/src/controllers/user.controller';
import { User } from '../../../models/user.model';

export type UserInfo = {
    username: string,
    userId: string,
    bookmarks: string[];
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
    private userInfoListener = new Subject<UserInfo>();
    private bookmarks: string[];

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
            userId: this.userId,
            bookmarks: this.bookmarks,
        };
    }

    getUserListener(): Observable<UserInfo> {
        return this.userInfoListener.asObservable();
    }

    getIsAuth(): boolean {
        return this.isAuthenticated;
    }

    getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string, username: string): void {
        
        const authData: User = { email, password, username, bookmarks: [] };
        this.http.post<UserSignupResponse>(`${this.baseUrl}/signup`,authData)
			.subscribe(res => console.log(res.message));
    }

    upateBookmarks(recipeId: string, action: 'add' | 'remove'): void {

        let updatedBookmarks: string[];
        if(action === 'add') updatedBookmarks = [...this.bookmarks, recipeId];
        else updatedBookmarks = this.bookmarks.filter(item => item !== recipeId);
        
        this.http.put<UserUpdateResponse>(`${this.baseUrl}/update/bookmarks`,{ bookmarks: updatedBookmarks })
            .subscribe(result => {
                const bookmarks = result.bookmarks;
                if(bookmarks && result.message === 'Updated bookmarks'){
                    this.bookmarks = [...bookmarks];
                    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
                    this.userInfoListener.next({
                        username: this.username,
                        userId: this.userId,
                        bookmarks: bookmarks,
                    });
                }
                
            });
    }

    login(email: string, password: string): void {

        const authData: User = { email, password };
        this.http.post<LoginResponse>(`${this.baseUrl}/login`,authData)
          	.subscribe(response => {

				const { token, userId, expiresIn, username, bookmarks } = response;
				if (token && userId && expiresIn && username && bookmarks) {
                    this.token = token;
                    this.userId = userId;
                    this.username = username;
                    this.bookmarks = bookmarks;
                    this.setAuthTimer(expiresIn);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.userInfoListener.next({ username, userId, bookmarks });
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
                    this.saveAuthData(token, expirationDate, userId, username, bookmarks);
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
            this.bookmarks = authInformation.bookmarks;
			this.setAuthTimer(expiresIn / 1000);
			this.authStatusListener.next(true);
            this.userInfoListener.next({
                username: authInformation.username,
                userId: authInformation.userId,
                bookmarks: authInformation.bookmarks,
            });
        }
    }
    
    logout(): void {
        this.token = '';
        this.isAuthenticated = false;
        this.userId = '';
        this.username = '';
        this.bookmarks = [];
        this.authStatusListener.next(false);
        this.userInfoListener.next({ username: '', userId: '' ,bookmarks: [] });
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }
    
    private setAuthTimer(duration: number) {

        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, duration * 1000);
    }
    
    private saveAuthData(token: string, expirationDate: Date, userId: string, username: string, bookmarks: string[]) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }
    
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('bookmarks');
    }
    
    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        const bookmarksStorage = localStorage.getItem('bookmarks');
        const bookmarks = bookmarksStorage ? JSON.parse(bookmarksStorage) as string[] : [] ;
        if (!token || !expirationDate || !userId || !username || !bookmarks) return;
        
        return {
          token,
          expirationDate: new Date(expirationDate),
          userId,
          username,
          bookmarks
        };
    }
}