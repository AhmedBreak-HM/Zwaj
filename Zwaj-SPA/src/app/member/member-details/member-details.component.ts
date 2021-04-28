import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {
  user: User;


  constructor(private userService: UserService, private alert: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(res => {
      this.user = res['user'];
    });
    // this.loadUser();

  }

  // loadUser() {
  //   const id = <number>this.route.snapshot.params['id'];
  //   this.userService.getUser(id).subscribe(res => {
  //     this.user = res;
  //   },err => this.alert.error(err));
  // }

}
