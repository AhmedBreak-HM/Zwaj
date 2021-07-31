import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../models/message';
import { Pagenation } from '../models/Pagenation';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messges: Message[];
  pagenation: Pagenation;
  messageType = 'Unread';

  constructor(private userServices: UserService, private authServices: AuthService,
              private route: ActivatedRoute, private alert: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(
      res => {
        this.messges = res['messages'].result;
        this.pagenation = res['messages'].pagenation;
      }
    );
  }
  loadMessages() {
    this.userServices.getMessage(this.authServices.decodedToken.nameid, this.pagenation.currentPage,
      this.pagenation.itemsPerPage, this.messageType).subscribe(res => {
        this.messges = res.result;
        this.pagenation = res.pagenation;
      }, err => this.alert.error(err));
  }
  pageChanged(event: any): void {
    this.pagenation.currentPage = event.page;
    this.loadMessages();
  }
}
