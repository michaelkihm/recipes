import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl = 'http://localhost:4000/api/user';
    private token: string;
    private isAuthenticated = false;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken(): string {
        return this.token;
    }

    getIsAuth(): boolean {
        return this.isAuthenticated;
    }

    getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string): void {
        
        const authData: AuthData = { email, password };
        this.http.post(`${this.baseUrl}/signup`,authData).subscribe(res => console.log(res));
    }

    login(email: string, password: string): void {

        const authData: AuthData = { email, password };
        this.http.post<{token: string}>(`${this.baseUrl}/login`,authData).subscribe(response => {
            this.token = response.token;
            if(this.token){
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.router.navigate(['/']);
            }
            
        });
    }

    logout(): void {

        this.token = '';
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
    }
}