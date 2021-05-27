import { Component, OnInit } from '@angular/core';
import { Pagenation } from 'src/app/models/Pagenation';
import { UserParams } from 'src/app/models/UserParams';
import { User } from '../../models/user';
import { AlertifyService } from '../../services/alertify.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  users: User[] = [];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{ value: 'رجل', display: 'رجال' }, { value: 'إمرأة', display: 'نساء' }];
  pagination: Pagenation;
  userParams: UserParams = {
    gender: this.user.gender === 'رجل' ? 'إمرأة' : 'رجل',
    minAge: 18,
    maxAge: 99,
    orederBy:'lastActive'
  };

  constructor(private userService: UserService, private alert: AlertifyService) { }

  ngOnInit() {
    this.loadUsers();
  }
  loadUsers(pageNumber?: number, itemsPerPage?: number, userParams?: UserParams) {
    this.userService.getUsers(pageNumber, itemsPerPage, userParams).subscribe(res => {
      this.users = res.result;
      this.pagination = res.pagenation;

    }, err => this.alert.error(err));
  }
  pageChanged(event: any): void {
    this.loadUsers(this.pagination.currentPage, this.pagination.itemsPerPage);
  }
  resetFilter() {
    this.userParams.gender = this.user.gender === 'رجل' ? 'إمرأة' : 'رجل';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
  }


}
