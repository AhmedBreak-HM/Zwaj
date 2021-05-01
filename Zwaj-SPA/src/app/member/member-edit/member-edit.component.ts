import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  user$:Observable<User>;
  @ViewChild('editForm',{static: false}) editForm: NgForm;

  constructor(private userService:UserService,private authService:AuthService,
    private alert :AlertifyService) { }

  ngOnInit() {
    const decodeUser = this.authService.decodedToken;
    const id = decodeUser.nameid;
    this.user$ = this.userService.getUser(id);
  }
  updateUser(user:User){
    this.alert.success('update success');
    console.log(user);
    this.editForm.reset(user);

  }

}


