import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper = new JwtHelperService();
  baseUrl: string = environment.baseUrl + 'auth/';
  decodedToken:any;
  curentUser:User;

  constructor(private http: HttpClient) { }


  login(model: any) {
    return this.http.post(`${this.baseUrl}login`, model).pipe(
      map((res: any) => {
        const user = res;
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user',JSON.stringify(user.user));
          this.curentUser = user.user;

          return model;
        }
      })
    );
  }

  register(model: any) {
    return this.http.post(`${this.baseUrl}register`, model);
  }
  isUser() {
    try {
      const token = localStorage.getItem('token');
      this.DecodToken = this.jwtHelper.decodeToken(token);
      return !this.jwtHelper.isTokenExpired(token);
    }
    catch {
      return false;
    }
  }
  DecodToken() {
    const token = localStorage.getItem('token');
    const user = this.jwtHelper.decodeToken(token);
    return user;
  }
}
