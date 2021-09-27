import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthUsecase } from './auth/auth.usecase';
import { LoginViewModel } from './auth/LoginViewModel';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  login: LoginViewModel | undefined;
  constructor(private auth: AuthUsecase) { 
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.login = this.auth.loginvm;
    let tokenizerReq = {} as HttpRequest<any>;
    if (!req.url.includes('login')) {
      tokenizerReq = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      return next.handle(tokenizerReq);
    } else {
      tokenizerReq = req.clone({
        setHeaders: {
          Authorization: `Basic ${window.btoa(`${this.login?.email}:${this.login?.password}`)}`
        }
      })
      return next.handle(tokenizerReq);
    }
  }
}
