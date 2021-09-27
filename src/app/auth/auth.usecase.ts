import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { LoginViewModel } from './LoginViewModel';

const BACKEND_URL = environment.apiUrl;


@Injectable({
    providedIn: 'root'
})
export class AuthUsecase {
    loginvm: LoginViewModel | undefined;
    private token: string | undefined;
    private isAuthenticated = false;
    private tokenTimer: any;
    private authStatusListener = new Subject<boolean>();
    constructor(private http: HttpClient,
        private spinner: NgxSpinnerService,
        private toast: ToastrService,
        private router: Router) { }

    logout(logout: any) {
        this.token = undefined;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        if (logout !== undefined) {
            this.router.navigateByUrl('/home');
        }
    }

    login(request: LoginViewModel) {
        this.loginvm = request;
        this.spinner.show();
        this.http.post<{ token: string, expiresIn: number }>(`${BACKEND_URL}/api/Auth/login/`, {}).subscribe((resp: any) => {
            this.spinner.hide();
            if (resp.response) {
                var decoded: any = jwt_decode(resp.response.token);
                const token = resp.response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = decoded.exp;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const expirationDate = new Date(expiresInDuration * 1000);
                    this.saveAuthData(token,
                        expirationDate,
                        decoded,
                        resp.response.onlineUserTypeName);
                    if (resp.response.onlineUserTypeName === "Internal_User") {
                        this.router.navigateByUrl('/user-subscriptions');;
                    } else if (resp.response.onlineUserTypeName === "Admin") {
                        this.router.navigateByUrl('/admin-dashboard');
                    }
                }
            } else {
                this.toast.info('Identifiant ou mot de passe incorrect');
                this.router.navigateByUrl('/login');
            }
        }, error => {
            this.spinner.hide();
            this.toast.error(error.error.message);
        });
    }

    register(user: any) {
        return this.http.post(`${BACKEND_URL}/api/User/`, user);
    }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener(): Observable<any> {
        return this.authStatusListener.asObservable();
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout('/home');
        }, duration);
    }

    private saveAuthData(token: string, expirationDate: Date, decoded: any, role: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', decoded.unique_name[0]);
        localStorage.setItem('userId', decoded.unique_name[1]);
        localStorage.setItem('firstname', decoded.unique_name[2]);
        localStorage.setItem('lastname', decoded.unique_name[3]);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('cellphone');
        localStorage.removeItem('expiration');
    }

    private getAuthData() {
        const tokenStorage = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!tokenStorage || !expirationDate) {
            return;
        }
        return {
            token: tokenStorage,
            expirationDate: new Date(expirationDate)
        };
    }

    private getLoginvm() {
        return this.loginvm;
    }
}
