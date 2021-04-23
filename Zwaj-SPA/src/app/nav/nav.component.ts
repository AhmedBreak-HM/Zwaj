import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService, private alert: AlertifyService) { }

  ngOnInit() {
  }
  login() {
    this.authService.login(this.model).subscribe(
      res => {
        this.alert.success('تم تسجيل الدخول بنجاح');
        console.log('تم تسجيل الدخول بنجاح')
      }, err => {
        this.alert.error('login error is ' + err);
        console.log('login error is ' + err)
      }
    );
  }
  loggedin() {
    return ! this.authService.isUser();
  }
  loggedOut() {
    localStorage.removeItem('token');
    this.alert.warning('تم تسجيل الخروج');
    console.log('تم تسجيل الخروج');
  }

}
