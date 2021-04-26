import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { AlertifyService } from '../services/alertify.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  users: User[] =[];

  constructor(private userService: UserService,private alert: AlertifyService) { }

  ngOnInit() {
    this.loadUsers();
  }
  loadUsers(){
    this.userService.getUsers().subscribe(res => {
      this.users = res;
    },err => this.alert.error(err));
  }

}
