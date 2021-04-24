import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  model: any = {};
  user: any;
  constructor(private authService: AuthService, private alert: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.user = this.authService.DecodToken();
  }
  login() {
    this.authService.login(this.model).subscribe(
      res => {
        this.alert.success('تم تسجيل الدخول بنجاح');
      }, err => {
        this.alert.error('login error is : ' + err);
      },
      () => {
        this.user.unique_name = this.model.username;
        this.router.navigate(['/members']);
      }
    );
  }
  loggedin() {
    return this.authService.isUser();
  }
  loggedOut() {
    localStorage.removeItem('token');
    this.alert.warning('تم تسجيل الخروج');
    this.router.navigate(['']);
  }

}
