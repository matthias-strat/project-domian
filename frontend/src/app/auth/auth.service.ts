import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable()
export class AuthService {
    constructor(public jwtHelper: JwtHelperService) {}

    public getToken(): string {
        return localStorage.getItem('token');
    }

    public isAuthenticated(): boolean {
        const token = this.getToken();

        // Check whether the token is expired and return true or false
        return !this.jwtHelper.isTokenExpired(token);
    }
}