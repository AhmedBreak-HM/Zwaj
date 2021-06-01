import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagenation } from '../models/Pagenation';
import { User } from '../models/user';
import { AlertifyService } from '../services/alertify.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  constructor(private router: ActivatedRoute, private userService: UserService,
    private alert: AlertifyService) { }
  users: User[] = [];
  pagenation: Pagenation;
  likeParam: string ='likers';
  search: boolean = false;

  ngOnInit() {
    this.router.data.subscribe(
      res => {
        this.users = res['users'].result;
        this.pagenation = res['users'].pagenation;
      }
    )
  }
  loadUsers() {
    if (!this.search) {
      this.pagenation.currentPage = 1;

    }
    this.userService.getUsers(this.pagenation.currentPage, this.pagenation.itemsPerPage, null,this.likeParam).subscribe(res => {
      this.users = res.result;
      this.pagenation = res.pagenation;

    }, err => this.alert.error(err));
  }

  pageChanged(event: any): void {
    this.pagenation.currentPage =event.page ;
    this.loadUsers();
  }

}
