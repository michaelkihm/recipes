import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
    LoginResponse, UserSignupResponse, UserUpdateResponse
} from '../../../backend/src/controllers/user-cotroller/user.controller.types';
import { User } from '../../../models/user.model';
import { environment } from './../../environments/environment';

export type UserInfo = {
    username: string,
    userId: string,
    bookmarks: string[];
    image: string;
};
@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl = `${environment.apiURL}/api/user`;
    private token: string;
    private isAuthenticated = false;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: NodeJS.Timer;
    private userId: string;
    private username: string;
    private image: string;
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
            image: this.image
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

    createUser(user: FormData): void {
        
        console.log('IMAGE',user.get('image'));
        this.http.post<UserSignupResponse>(`${this.baseUrl}/signup`,user)
			.subscribe(res => {
                if(res.message === 'User created') this.router.navigate(['/']);
                else console.error(res.message);
            });
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
                        image: this.image
                    });
                }
                
            });
    }

    login(email: string, password: string): void {

        const authData: User = { email, password };
        this.http.post<LoginResponse>(`${this.baseUrl}/login`,authData)
          	.subscribe(response => {

				const { token, userId, expiresIn, username, bookmarks, image } = response;
				if (token && userId && expiresIn && username && bookmarks && image) {
                    this.token = token;
                    this.userId = userId;
                    this.username = username;
                    this.image = image;
                    this.bookmarks = bookmarks;
                    this.setAuthTimer(expiresIn);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.userInfoListener.next({ username, userId, bookmarks, image });
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
                    this.saveAuthData(token, expirationDate, userId, username, bookmarks, image);
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
            this.image = authInformation.image;
            this.bookmarks = authInformation.bookmarks;
			this.setAuthTimer(expiresIn / 1000);
			this.authStatusListener.next(true);
            this.userInfoListener.next({
                username: authInformation.username,
                userId: authInformation.userId,
                bookmarks: authInformation.bookmarks,
                image: authInformation.image
            });
        }
    }
    
    logout(): void {
        this.token = '';
        this.isAuthenticated = false;
        this.userId = '';
        this.username = '';
        this.image = '';
        this.bookmarks = [];
        this.authStatusListener.next(false);
        this.userInfoListener.next({ username: '', userId: '' ,bookmarks: [], image: '' });
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }
    
    private setAuthTimer(duration: number) {

        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, duration * 1000);
    }
    
    private saveAuthData(
            token: string, expirationDate: Date, userId: string, username: string, bookmarks: string[], image: string) {

        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('image', image);
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }
    
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('bookmarks');
        localStorage.removeItem('image');
    }
    
    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        const image = localStorage.getItem('image');
        const bookmarksStorage = localStorage.getItem('bookmarks');
        const bookmarks = bookmarksStorage ? JSON.parse(bookmarksStorage) as string[] : [] ;
        if (!token || !expirationDate || !userId || !username || !bookmarks || !image) return;
        
        return {
          token,
          expirationDate: new Date(expirationDate),
          userId,
          username,
          bookmarks,
          image
        };
    }
}