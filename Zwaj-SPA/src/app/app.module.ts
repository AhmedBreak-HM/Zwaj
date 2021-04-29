import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { JwtModule } from "@auth0/angular-jwt";
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from 'ngx-gallery';

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
import { MemberGalleryComponent } from './member/member-gallery/member-gallery.component';
import { MemberEditComponent } from './member/member-edit/member-edit.component';

//  this code for ngx-gallery solve problem
export class CustomHammerConfig extends HammerGestureConfig  {
  overrides = {
      pinch: { enable: false },
      rotate: { enable: false }
  };
}// this code for get token @auth0/angular-jwt send token with http header request
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
    MemberDetailsComponent,
    MemberGalleryComponent,
    MemberEditComponent
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
    NgxGalleryModule

  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig
  },
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
