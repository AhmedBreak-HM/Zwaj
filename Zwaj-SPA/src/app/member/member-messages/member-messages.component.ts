import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { tap } from 'rxjs/operators';
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
  // hubConnection: HubConnection; remove to authservices golabl variable
  hubConnection2: HubConnection;
  constructor(private userService: UserService, private authService: AuthService,
              private alert: AlertifyService) { }
  ngAfterViewChecked(): void {
    this.panal.nativeElement.scrollTop = this.panal.nativeElement.scrollHeight;
  }

  ngOnInit() {
    this.loadMessage();
    this.hubConnection2 = new HubConnectionBuilder().withUrl('http://localhost:5000/chat').build();
    this.hubConnection2.start();

    this.authService.hubConnection.start();
    this.authService.hubConnection.on('refresh', () => {
        this.loadMessage();
    });

  }
  loadMessage() {
    const userId =  this.authService.decodedToken.nameid as number;
    this.userService.getConverstion(userId, this.recipientId).pipe(
      tap(messages => {
        for (const message of messages) {
          if (message.isRead === false && message.recipientId === userId) {
            this.userService.markIsRead(userId, message.id);
          }
        }
      })
    )
    .subscribe(res => {
      this.messages = res.reverse();
    }, err => this.alert.error(err), () => {
      setTimeout(() => {
        this.userService.unReadMessageCount(userId).subscribe((res: number) => {
          this.authService.unReadMessageCount.next(res);
          setTimeout(() => {
            this.userService.getConverstion(userId, this.recipientId).subscribe( messages=>this.messages=messages.reverse());
            }, 3000);
        });
      }, 1000);
    });
  }
  senMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe((res: Message) => {
      // this.messages.push(res);
      this.newMessage.content = '';
      this.authService.hubConnection.invoke('refresh');

    }, error => this.alert.error(error), () => {
      setTimeout(() => {
        this.hubConnection2.invoke('count');
        this.loadMessage();
      }, 0);

    });
  }

}
