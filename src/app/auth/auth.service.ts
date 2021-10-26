import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl = 'http://localhost:4000/api/user';
    private token: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken(): string {
        return this.token;
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
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
        });
    }
}