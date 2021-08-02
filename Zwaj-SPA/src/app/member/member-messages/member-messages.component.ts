import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  constructor(private userService: UserService, private authService: AuthService,
              private alert: AlertifyService) { }

  ngOnInit() {
    this.loadMessage();
  }
  loadMessage() {
    this.userService.getConverstion(this.authService.decodedToken.nameid, this.recipientId).subscribe(res => {
      this.messages = res;
    }, err => this.alert.error(err));
  }

}
