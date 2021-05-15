import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Zwaj-SPA';
  jwtHelper = new JwtHelperService();

  constructor(public authService: AuthService) { }
  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }

    const user = localStorage.getItem('user');
    if (user) {
      this.authService.curentUser = JSON.parse(user);
      // send new photo url
      this.authService.changeUserPhoto(this.authService.curentUser.photoURL);
    }

  }
}
