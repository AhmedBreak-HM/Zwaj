import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {

  @Input() user: User;
  userId:number ;

  constructor(private userService: UserService, private alert:AlertifyService,
    private authService:AuthService) { }

  ngOnInit() {
    this.userId = this.authService.decodedToken.nameid;
  }
  sendLike(likeeId){
    this.userService.likeUser(this.userId,likeeId).subscribe(
      (res:any)=>{
        this.alert.success('don');
      } ,
      err => {
        this.alert.error('like user is error ' + err);
        console.log(err);
      }
      );

  }


}
