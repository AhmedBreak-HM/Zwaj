import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { User } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {
  user: User;
  ReadMoreIntro: boolean = true;
  ReadMorelookFor: boolean = true;
  ReadMoreInterests: boolean = true;
  created: string;
  age: string;
  @ViewChild('staticTabs', { static: true }) staticTabs: TabsetComponent;


  constructor(private userService: UserService, private alert: AlertifyService,
              private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {

    this.route.data.subscribe(res => {
      this.user = res['user'];
    });
    this.route.queryParams.subscribe(res => {
      const selectedTab = res['tab'];
      if (selectedTab > 0) {
        this.staticTabs.tabs[selectedTab].active = true;
      }
    });
    // this.loadUser();
    this.created = new Date(this.user.created)
      .toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      .replace('،', '');
    this.age = this.user.age.toLocaleString('ar-EG');

  }

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }

  closeConnenction() {
    this.authService.hubConnection.stop();

  }

  // loadUser() {
  //   const id = <number>this.route.snapshot.params['id'];
  //   this.userService.getUser(id).subscribe(res => {
  //     this.user = res;
  //   },err => this.alert.error(err));
  // }

}
