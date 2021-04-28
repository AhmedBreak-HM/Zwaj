import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { JwtModule } from "@auth0/angular-jwt";
import { TabsModule } from 'ngx-bootstrap/tabs';


import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { AuthGuard } from './services/guards/auth.guard';
import { AlertifyService } from './services/alertify.service';
import { ErrorInterceptorProvidor } from './services/error.interceptor';
import { MemberDetailsResolver } from './resolvers/member-details.resolver';


import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './member/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberCardComponent } from './member/member-card/member-card.component';
import { MemberDetailsComponent } from './member/member-details/member-details.component';


export function tokenGetter() {
  return localStorage.getItem('token');
}


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // @auth0/angular-jwt send token with http header request
    // https://github.com/auth0/angular2-jwt
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:5000'],
        disallowedRoutes: ['localhost:5000/api/auth'],
      },
    }),
    // ---------------------------------------------------------
    FormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),

  ],
  providers: [

    // Globsl Http Interceptor
    ErrorInterceptorProvidor,
    // Guards
    AuthGuard,


    // Resolvers
    MemberDetailsResolver,

    // Services
    AuthService,
    UserService,
    AlertifyService,


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
