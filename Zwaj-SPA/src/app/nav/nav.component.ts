import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  login() {
    this.authService.login(this.model).subscribe(
      res => console.log('تم تسجيل الدخول بنجاح'), err => console.log('login error')
    );
  }
  loggedin(){
    const token =  localStorage.getItem('token');
    return !! token;
  }
  loggedOut(){
    localStorage.removeItem('token');
    console.log('تم تسجيل الخروج');
  }

}
