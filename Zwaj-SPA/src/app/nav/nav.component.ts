import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  model: any = {};
  user: any = {};
  userName: string = '';
  currentUser: User;
  photoUrl: string;
  constructor(private authService: AuthService, private alert: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.user = this.authService.DecodToken();
    this.currentUser = this.authService.curentUser;
    this.authService.currentPhotUrl.subscribe(res =>
      this.photoUrl = res
    );
  }
  login() {
    this.authService.login(this.model).subscribe(
      res => {
        this.userName = res.username;
        this.alert.success(this.userName + ' مرحبا بك يا ');
      }, err => {
        this.alert.error('login error is : ' + err);
      },
      () => {
        this.router.navigate(['/members']);
      }
    );
  }
  loggedin() {
    return this.authService.isUser();
  }
  loggedOut() {
    localStorage.removeItem('token');
    this.authService.decodedToken = null;

    localStorage.removeItem('user');
    this.authService.curentUser = null;

    this.alert.warning('تم تسجيل الخروج');
    this.router.navigate(['']);
  }

}
