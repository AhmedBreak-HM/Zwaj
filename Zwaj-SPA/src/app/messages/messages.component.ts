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

  messages: Message[];
  pagination: Pagenation;
  messageType = 'Unread';
  search: boolean = false;

  constructor(private userServices: UserService, private authServices: AuthService,
              private route: ActivatedRoute, private alert: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(
      res => {
        this.messages = res['messages'].result;
        this.pagination = res['messages'].pagenation;
      }
    );
  }
  loadMessages() {
    if (!this.search) {
      this.pagination.currentPage = 1;

    }
    this.userServices.getMessage(this.authServices.decodedToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageType).subscribe(res => {
        this.messages = res.result;
        this.pagination = res.pagenation;
      }, err => this.alert.error(err));
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page ;
    this.loadMessages();
  }
}
