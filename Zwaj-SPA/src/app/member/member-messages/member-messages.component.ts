import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from 'src/app/models/message';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit, AfterViewChecked {
  @Input() recipientId: number;
  @ViewChild('panal', { static: false }) panal: ElementRef<any>;
  messages: Message[];
  newMessage: any = {};
  hubConnection: HubConnection;
  constructor(private userService: UserService, private authService: AuthService,
              private alert: AlertifyService) { }
  ngAfterViewChecked(): void {
    this.panal.nativeElement.scrollTop = this.panal.nativeElement.scrollHeight;
  }

  ngOnInit() {
    this.loadMessage();
    this.hubConnection = new HubConnectionBuilder().withUrl('http://localhost:5000/chat').build();
    this.hubConnection.start();
    this.hubConnection.on('refresh', () => {
      setTimeout(() => {
        this.loadMessage();
      }, 500);
    });

  }
  loadMessage() {
    this.userService.getConverstion(this.authService.decodedToken.nameid, this.recipientId).subscribe(res => {
      this.messages = res.reverse();
    }, err => this.alert.error(err));
  }
  senMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe((res: Message) => {
      // this.messages.push(res);
      this.newMessage.content = '';
      this.hubConnection.invoke('refresh');

    });
  }

}
