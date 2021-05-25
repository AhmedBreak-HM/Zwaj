import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagenation } from 'src/app/models/Pagenation';
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
  pagination: Pagenation;
  // users: Observable<User[]>;

  constructor(private userService: UserService, private alert: AlertifyService) { }

  ngOnInit() {
    this.loadUsers();
    console.log('data from load')

    // this.users = this.userService.getUsers();
  }
  loadUsers(pageNumber?: number, itemsPerPage?: number) {
    this.userService.getUsers(pageNumber, itemsPerPage).subscribe(res => {
      this.users = res.result;
      this.pagination = res.pagenation;
      console.log(this.pagination)

    }, err => this.alert.error(err));
  }
  pageChanged(event: any): void {
    this.loadUsers(this.pagination.currentPage,this.pagination.itemsPerPage);
    // this.loadUsers(this.pagination.currentPage,5);


  }

}
