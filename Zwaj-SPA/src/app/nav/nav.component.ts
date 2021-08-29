import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { User } from '../models/user';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

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
  unReadCount: number = 0;
  hubConnection: HubConnection;
  constructor(private authService: AuthService, private alert: AlertifyService, private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.user = this.authService.DecodToken();
    this.authService.decodedToken = this.user;
    this.currentUser = this.authService.curentUser;
    this.authService.currentPhotUrl.subscribe(res =>
      this.photoUrl = res
    );
    this.loadUnredMessageCount();
    this.hubConnection = new HubConnectionBuilder().withUrl('http://localhost:5000/chat').build();
    this.hubConnection.start();
    this.hubConnection.on('count', () => {
      setTimeout(() => {
        this.loadUnredMessageCount();
      }, 0);
    });
  }
  login() {
    this.authService.login(this.model).subscribe(
      res => {
        this.userName = res.username;
        this.alert.success(this.userName + ' مرحبا بك يا ');
        this.loadUnredMessageCount();

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

  loadUnredMessageCount() {
    this.userService.unReadMessageCount(this.authService.decodedToken.nameid).subscribe((res: number) => {
      this.authService.unReadMessageCount.next(res);
      // this.unReadCount = res;
    });
    this.authService.unReadMessageCount.subscribe(res => this.unReadCount = res);
  }

}
