import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  user$:Observable<User>;

  constructor(private userService:UserService,private authService:AuthService) { }

  ngOnInit() {
    const decodeUser = this.authService.decodedToken;
    const id = decodeUser.nameid;
    this.user$ = this.userService.getUser(id);
  }

}
