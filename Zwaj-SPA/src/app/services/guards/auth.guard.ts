import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertifyService } from '../alertify.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private alert: AlertifyService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isUser()) {
      return true;
    } else {
      this.alert.error('يجب عليك تسجيل الدخول اولا');
      this.router.navigate(['/home']);
      return false;
    }
  }

}
