import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  user$: Observable<User>;
  @ViewChild('editForm', { static: false }) editForm: NgForm;

  @HostListener('window:beforeunload', ['$event'])
  unLoadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  id: number;

  constructor(private userService: UserService, private authService: AuthService,
    private alert: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    const decodeUser = this.authService.decodedToken;
    // if rceved from router
    // this.id = this.route.params['id'];
    this.id = <number>decodeUser.nameid;
    this.user$ = this.userService.getUser(this.id);
  }
  updateUser(user: User) {

    this.userService.updateUser(this.id, user).subscribe(() => {
      this.alert.success('update success');
      this.editForm.reset(user);
    }, err => this.alert.error('update error' + err));

  }


}


